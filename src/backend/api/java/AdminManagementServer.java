package backend.api.java;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.*;

public class AdminManagementServer {
    static final String URL = "jdbc:mariadb://127.0.0.1:3301/ecommerce";
    static final String USER = "root";
    static final String PASSWORD = "admin"; 
    public static void main(String[] args) {
        try {
            int port = 9999;
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            // Main page
            server.createContext("/", exchange -> {
                contextCreation(exchange, "src/frontend/admin/html/index.html","text/html");
            });

            // Main page CSS
            server.createContext("/css-main", exchange -> {
                contextCreation(exchange, "src/frontend/admin/css/style.css","text/css");
            });

            // Main page JS
            server.createContext("/js-main", exchange -> {
                contextCreation(exchange, "src/frontend/admin/js/script.js","text/javascript");
            });

            // Customers
            server.createContext("/products", exchange -> {
                try {
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                    String sql = "SELECT * FROM product";
                    PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                    ResultSet resultSet = preparedStatement.executeQuery();

                    JSONArray jsonArray = new JSONArray();
                    while(resultSet.next()) {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("product_id", resultSet.getInt("product_id"));
                        jsonObject.put("name", resultSet.getString("name"));
                        jsonObject.put("description", resultSet.getString("description"));
                        jsonObject.put("price", resultSet.getFloat("price"));
                        jsonObject.put("stock", resultSet.getInt("stock"));
                        jsonObject.put("status_id", resultSet.getInt("status_id"));
                        jsonArray.put(jsonObject);
                    }

                    String json = jsonArray.toString();
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, json.length());

                    OutputStream outputStream = exchange.getResponseBody();
                    outputStream.write(json.getBytes());

                    outputStream.close();
                    preparedStatement.close();
                    dbConnection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            });

            server.createContext("/product-search", exchange -> {
                String keyword = exchange.getRequestURI().getQuery().substring(2);
                try {
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                    String sql = "SELECT * FROM product WHERE name LIKE ?" + 
                                    "OR description LIKE ?" +
                                    "OR price LIKE ?" +
                                    "OR stock LIKE ?";
                    PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);

                    preparedStatement.setString(1, "%" + keyword + "%");
                    preparedStatement.setString(2, "%" + keyword + "%");
                    preparedStatement.setString(3, "%" + keyword + "%");
                    preparedStatement.setString(4, "%" + keyword + "%");

                    productContextCreation(exchange, dbConnection, preparedStatement, sql);
                }
                catch(SQLException sqlE) {
                    sqlE.printStackTrace();
                }
            });

            server.createContext("/product-add", exchange -> {
                if ("POST".equals(exchange.getRequestMethod())) {
                    InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
                    BufferedReader br = new BufferedReader(isr);
                    StringBuilder requestBody = new StringBuilder();

                    String line;
                    while ((line = br.readLine()) != null) {
                        requestBody.append(line);
                    }
                    
                    try {
                        Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);

                        JSONObject json = new JSONObject(requestBody.toString());
                        String name = json.getString("name");
                        String description = json.getString("description");
                        float price = json.getFloat("price");
                        int stock = json.getInt("stock");
                        
                        //SQL query to insert data
                        String sql = "INSERT INTO product(name, description, price, stock) VALUES(?,?,?,?)";

                        //Create a PreparedStatement
                        PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                        preparedStatement.setString(1, name);
                        preparedStatement.setString(2, description);
                        preparedStatement.setFloat(3, price);
                        preparedStatement.setInt(4, stock);

                        //Execute the INSERT command
                        preparedStatement.executeUpdate();

                        sql = "SELECT * FROM product";
                        selectAllProducts(dbConnection, exchange, sql);
                    } catch (Exception e) {
                        e.printStackTrace();
                        String response = "Error adding a new entry.";
                        exchange.getResponseHeaders().set("Content-Type", "text/plain");
                        exchange.sendResponseHeaders(500, response.length()); // 500 Internal Server Error

                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    }
                } else {
                    // Handle invalid HTTP method (e.g., not POST)
                    String response = "Invalid request.";
                    exchange.getResponseHeaders().set("Content-Type", "text/plain");
                    exchange.sendResponseHeaders(405, response.length());

                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            });

            server.createContext("/product-delete", exchange -> {
                if ("DELETE".equals(exchange.getRequestMethod())){
                    // Extract the item ID to be deleted from the request, for example, from the URI
                    String id = exchange.getRequestURI().getQuery().substring(3);
                                        
                    try{
                        Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);

                        // SQL query to delete data
                        String sql = "DELETE FROM product WHERE product_id = ?";

                        resetAutoIncrement(dbConnection, sql, "product", id);

                        sql = "SELECT * FROM product";
                        selectAllProducts(dbConnection, exchange, sql);
                    } catch(SQLException e) {
                        e.printStackTrace();
                    }

                } else {
                    // Handle invalid HTTP method
                    String response = "Invalid HTTP method. Only DELETE requests are accepted.";
                    exchange.sendResponseHeaders(405, response.length());
                    exchange.getResponseBody().write(response.getBytes());
                }	
            });

            
            server.createContext("/product-update", exchange -> {
                // Extract the item ID to be deleted from the request, for example, from the URI
                String id = exchange.getRequestURI().getQuery().substring(3);
            
                try {
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                    
                    //SQL query to fetch single row
                    String sql = "SELECT * FROM product WHERE product_id = ?";
                    //Create a PreparedStatement
                    PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                    preparedStatement.setInt(1, Integer.parseInt(id));
            
                    //Execute query
                    ResultSet resultSet = preparedStatement.executeQuery();
                    JSONObject jsonObject = new JSONObject();
                    while(resultSet.next()){
                        jsonObject.put("product_id", resultSet.getInt("product_id"));
                        jsonObject.put("name", resultSet.getString("name"));
                        jsonObject.put("description", resultSet.getString("description"));
                        jsonObject.put("price", resultSet.getFloat("price"));
                        jsonObject.put("stock", resultSet.getInt("stock"));
                        jsonObject.put("status_id", resultSet.getInt("status_id"));
                    }
                    //Convert JSON array object to String
                    String jsonString = jsonObject.toString();
                    //Close prepared statement
                    preparedStatement.close();   
                    //Close database connection
                    dbConnection.close();
                    
                    // Send a response
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, jsonString.length());

                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonString.getBytes());
                    os.close();
                }catch(SQLException e){
                      throw new RuntimeException("An error occurred", e);
                }
            });  

            server.createContext("/product-update-save", exchange -> {
                if ("PUT".equals(exchange.getRequestMethod())) {
                    InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
                    BufferedReader br = new BufferedReader(isr);
                    StringBuilder requestBody = new StringBuilder();
                    
                    String line;
                    while ((line = br.readLine()) != null) {
                        requestBody.append(line);
                    }
                    // Parse the JSON and extract data using JSONObject
                    try {
                        JSONObject json = new JSONObject(requestBody.toString());

                        int id = json.getInt("product_id");
                        String name = json.getString("name");
                        String description = json.getString("description");
                        float price = json.getFloat("price");
                        String stock = json.getString("stock");

                        Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);

                        //SQL query to update data
                        String sql = "UPDATE product SET name = ?, description = ?, price = ?, stock = ? WHERE product_id = ?";
                        
                        //Create a PreparedStatement
                        PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                        preparedStatement.setString(1, name);
                        preparedStatement.setString(2, description);
                        preparedStatement.setFloat(3, price);
                        preparedStatement.setString(4, stock);
                        preparedStatement.setInt(5, id);
                        
                        //Execute the UPDATE command
                        preparedStatement.executeUpdate();

                        sql = "SELECT * FROM product";
                        selectAllProducts(dbConnection, exchange, sql);
                        
                    } catch (Exception e) {
                        e.printStackTrace();
                        // Handle errors and send an error response
                        String response = "Error updating the entry.";
                        exchange.getResponseHeaders().set("Content-Type", "text/plain");
                        exchange.sendResponseHeaders(500, response.length()); // 500 Internal Server Error

                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    }
            
                } else {
                    // Handle invalid HTTP method (e.g., not POST)
                    String response = "Method not allowed.";
                    exchange.getResponseHeaders().set("Content-Type", "text/plain");
                    exchange.sendResponseHeaders(405, response.length()); // 405 Method Not Allowed

                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }   
            });

            // Add this block within your existing server.createContext("/product-status", ...) block
            server.createContext("/product-status", exchange -> {
                try {
                    // Extract the product ID from the request, for example, from the URI
                    String productId = exchange.getRequestURI().getQuery().substring(3);

                    // Fetch the current status of the product from the database
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                    String sql = "SELECT status_id FROM product WHERE product_id = ?";
                    PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                    preparedStatement.setInt(1, Integer.parseInt(productId));
                    ResultSet resultSet = preparedStatement.executeQuery();

                    JSONObject jsonResponse = new JSONObject();
                    if (resultSet.next()) {
                        int currentStatusId = resultSet.getInt("status_id");
                        jsonResponse.put("status_id", currentStatusId);
                    } else {
                        // Handle the case where the product ID is not found
                        jsonResponse.put("error", "Product not found");
                    }

                    // Convert JSON response to String
                    String jsonString = jsonResponse.toString();

                    // Send the response to the client
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, jsonString.length());

                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonString.getBytes());
                    os.close();

                    // Close resources
                    resultSet.close();
                    preparedStatement.close();
                    dbConnection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                    // Handle database error
                    exchange.sendResponseHeaders(500, 0); // 500 Internal Server Error
                    exchange.getResponseBody().close();
                }
            });

            server.createContext("/product-toggle-status", exchange -> {
                if ("PUT".equals(exchange.getRequestMethod())) {
                    try {
                        int queryLength = exchange.getRequestURI().getQuery().length();

                        // Extract the product ID and new status from the request, for example, from the URI
                        String productId = "";
                        String newStatusId = "";
                        if(queryLength == 13) {
                            productId = exchange.getRequestURI().getQuery().substring(3, 4);
                            newStatusId = exchange.getRequestURI().getQuery().substring(12);
                        } else if(queryLength == 14) {
                            productId = exchange.getRequestURI().getQuery().substring(3, 5);
                            newStatusId = exchange.getRequestURI().getQuery().substring(13);
                        } else if(queryLength == 15) {
                            productId = exchange.getRequestURI().getQuery().substring(3, 6);
                            newStatusId = exchange.getRequestURI().getQuery().substring(14);
                        } 

                        // Update the status of the product in the database
                        Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                        String sql = "UPDATE product SET status_id = ? WHERE product_id = ?";
                        PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                        preparedStatement.setInt(1, Integer.parseInt(newStatusId));
                        preparedStatement.setInt(2, Integer.parseInt(productId));
            
                        // Execute the update
                        int rowsUpdated = preparedStatement.executeUpdate();
            
                        // Check if the update was successful
                        if (rowsUpdated > 0) {
                            // Return the updated product information, if needed
                            // You can fetch the updated product details and send them in the response
                            // Alternatively, you can just send a success status without additional data
            
                            // For demonstration purposes, we'll return a success message
                            JSONObject jsonResponse = new JSONObject();
                            jsonResponse.put("message", "Status updated successfully");
            
                            // Convert JSON response to String
                            String jsonString = jsonResponse.toString();
            
                            // Send the response to the client
                            exchange.getResponseHeaders().set("Content-Type", "application/json");
                            exchange.sendResponseHeaders(200, jsonString.length());
            
                            OutputStream os = exchange.getResponseBody();
                            os.write(jsonString.getBytes());
                            os.close();
                        } else {
                            // Handle the case where the product ID is not found
                            exchange.sendResponseHeaders(404, 0); // 404 Not Found
                            exchange.getResponseBody().close();
                        }
            
                        // Close resources
                        preparedStatement.close();
                        dbConnection.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                        // Handle database error
                        exchange.sendResponseHeaders(500, 0); // 500 Internal Server Error
                        exchange.getResponseBody().close();
                    }
                } else {
                    // Handle invalid HTTP method
                    exchange.sendResponseHeaders(405, 0); // 405 Method Not Allowed
                    exchange.getResponseBody().close();
                }
            });
            

            server.createContext("/product-content", exchange -> {
                contextCreation(exchange, "src/frontend/admin/html/products.html","text/html");
            });

            server.createContext("/product-create", exchange -> {
                contextCreation(exchange, "src/frontend/admin/html/product_create.html","text/html");
            });

            server.createContext("/js-product", exchange -> {
                contextCreation(exchange, "src\\frontend\\admin\\js\\product.js","text/javascript");
            });

            server.setExecutor(null);
            server.start();
            System.out.println("Server is running at http://localhost:" + port);
        }
        catch(IOException e) {
            e.printStackTrace();
        }
    }

    private static void contextCreation(HttpExchange exchange, String path, String headerValue) {
        try {
            byte[] content = Files.readAllBytes(Paths.get(path));
            
            exchange.getResponseHeaders().set("Content-Type", headerValue);
            exchange.sendResponseHeaders(200, content.length);

            OutputStream output = exchange.getResponseBody();
            output.write(content);
            output.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void productContextCreation(HttpExchange exchange, Connection dbConnection, PreparedStatement preparedStatement, String sql) {
        try {
            JSONArray jsonArray = new JSONArray();
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("product_id", resultSet.getInt("product_id"));
                jsonObject.put("name", resultSet.getString("name"));
                jsonObject.put("description", resultSet.getString("description"));
                jsonObject.put("price", resultSet.getFloat("price"));
                jsonObject.put("stock", resultSet.getInt("stock"));
                jsonObject.put("status_id", resultSet.getInt("status_id"));
                jsonArray.put(jsonObject);
            }

            String json = jsonArray.toString();
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, json.length());

            OutputStream outputStream = exchange.getResponseBody();
            outputStream.write(json.getBytes());

            outputStream.close();
            preparedStatement.close();
            dbConnection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void selectAllProducts(Connection dbConnection, HttpExchange exchange, String sql) {
        try {
            //Prepare statement
            PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);

            //Execute query
            ResultSet resultSet = preparedStatement.executeQuery();

            // Iterate the result set
            JSONArray jsonArr = new JSONArray();
            while(resultSet.next()){
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("product_id", resultSet.getInt("product_id"));
                jsonObject.put("name", resultSet.getString("name"));
                jsonObject.put("description", resultSet.getString("description"));
                jsonObject.put("price", resultSet.getFloat("price"));
                jsonObject.put("stock", resultSet.getInt("stock"));
                jsonObject.put("status_id", resultSet.getInt("status_id"));
                jsonArr.put(jsonObject);
            }
            String json = jsonArr.toString();
            
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, json.length());

            OutputStream os = exchange.getResponseBody();
            os.write(json.getBytes());
            os.close();
            
            //Close prepared statement
            preparedStatement.close();          

            //Close database connection
            dbConnection.close();
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    private static void resetAutoIncrement(Connection dbConnection, String sql, String tableName, String id) {
        try {
        String resetAutoIncrementSql = "ALTER TABLE " + tableName + " AUTO_INCREMENT = 0";
            // Create a PreparedStatement for the delete operation
            PreparedStatement deletePreparedStatement = dbConnection.prepareStatement(sql);
            deletePreparedStatement.setInt(1, Integer.parseInt(id));

            deletePreparedStatement.executeUpdate();

            // Reset the auto-increment value to 0
            Statement resetAutoIncrementStatement = dbConnection.createStatement();
            resetAutoIncrementStatement.executeUpdate(resetAutoIncrementSql);

            deletePreparedStatement.close();
            resetAutoIncrementStatement.close();

            // Create a PreparedStatement
            PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
            preparedStatement.setInt(1, Integer.parseInt(id));

            // Execute the DELETE command
            preparedStatement.executeUpdate();
            preparedStatement.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}