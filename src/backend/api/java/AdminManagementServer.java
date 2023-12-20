package backend.api.java;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.*;

public class AdminManagementServer {
    static final String URL = "jdbc:mariadb://127.0.0.1:3301/foodmate_db";
    static final String USER = "root";
    static final String PASSWORD = "admin";

    public static void main(String[] args) {
        try {
            int port = 9999;
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            // Main page
            server.createContext("/", exchange -> {
                contextCreation(exchange, "src/frontend/admin/html/index.html", "text/html");
            });

            server.createContext("/logo", exchange -> {
                try {
                    // Specify the path to your logo file
                    Path logoPath = Paths.get("src\\frontend\\admin\\src\\logo.png");
            
                    // Read the logo file and send it as the response
                    byte[] logoBytes = Files.readAllBytes(logoPath);
            
                    // Set the appropriate content type for an image (adjust if necessary)
                    exchange.getResponseHeaders().set("Content-Type", "image/png");
            
                    // Send the logo image as the response body
                    exchange.sendResponseHeaders(200, logoBytes.length);
            
                    OutputStream outputStream = exchange.getResponseBody();
                    outputStream.write(logoBytes);
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                    // Handle error and send an error response
                    String response = "Error serving the logo";
                    exchange.getResponseHeaders().set("Content-Type", "text/plain");
                    exchange.sendResponseHeaders(500, response.length());
            
                    OutputStream outputStream = exchange.getResponseBody();
                    outputStream.write(response.getBytes());
                    outputStream.close();
                }
            });
            

            // Main page
            server.createContext("/dashboard", exchange -> {
                contextCreation(exchange, "src/frontend/admin/html/dashboard.html", "text/html");
            });

            // Main page
            server.createContext("/js-dashboard", exchange -> {
                contextCreation(exchange, "src/frontend/admin/js/dashboard.js", "text/javascript");
            });

            server.createContext("/dashboard-stats", exchange -> {
                try {
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);

                    // User Statistics
                    String userStatsSql = "SELECT COUNT(user_id) AS totalUsers, " +
                            "SUM(CASE WHEN role_id = 1 THEN 1 ELSE 0 END) AS adminCount, " +
                            "SUM(CASE WHEN role_id = 2 THEN 1 ELSE 0 END) AS clientCount " +
                            "FROM users";
                    PreparedStatement userStatsPreparedStatement = dbConnection.prepareStatement(userStatsSql);
                    ResultSet userStatsResultSet = userStatsPreparedStatement.executeQuery();

                    JSONObject userStatsJsonObject = new JSONObject();
                    if (userStatsResultSet.next()) {
                        userStatsJsonObject.put("totalUsers", userStatsResultSet.getInt("totalUsers"));
                        userStatsJsonObject.put("adminCount", userStatsResultSet.getInt("adminCount"));
                        userStatsJsonObject.put("clientCount", userStatsResultSet.getInt("clientCount"));
                    }

                    // Product Statistics
                    String productStatsSql = "SELECT " +
                            "(SELECT COUNT(product_id) FROM products) AS totalProducts, " +
                            "(SELECT COUNT(product_id) FROM products WHERE stock < 10) AS lowStockCount, " +
                            "(SELECT p.name FROM products p " +
                            "WHERE total_sales_amount = (SELECT MAX(total_sales_amount) FROM products)) AS topSellingProductAmount, "
                            +
                            "(SELECT p.name FROM products p " +
                            "WHERE total_sales_quantity = (SELECT MAX(total_sales_quantity) FROM products)) AS topSellingProductQuantity;";

                    PreparedStatement productStatsPreparedStatement = dbConnection.prepareStatement(productStatsSql);
                    ResultSet productStatsResultSet = productStatsPreparedStatement.executeQuery();

                    JSONObject productStatsJsonObject = new JSONObject();
                    if (productStatsResultSet.next()) {
                        productStatsJsonObject.put("totalProducts", productStatsResultSet.getInt("totalProducts"));
                        productStatsJsonObject.put("topSellingProductAmount",
                                productStatsResultSet.getString("topSellingProductAmount"));
                        productStatsJsonObject.put("topSellingProductQuantity",
                                productStatsResultSet.getString("topSellingProductQuantity"));
                        productStatsJsonObject.put("lowStockCount", productStatsResultSet.getInt("lowStockCount"));
                    }

                    // Sales Statistics
                    String salesStatsSql = "SELECT " +
                            "(SELECT SUM(total_sales_amount) FROM products) AS totalSalesAmount, " +
                            "(SELECT SUM(total_sales_quantity) FROM products) AS totalSalesQuantity;";

                    PreparedStatement salesStatsPreparedStatement = dbConnection.prepareStatement(salesStatsSql);
                    ResultSet salesStatsResultSet = salesStatsPreparedStatement.executeQuery();

                    JSONObject salesStatsJsonObject = new JSONObject();
                    if (salesStatsResultSet.next()) {
                        salesStatsJsonObject.put("totalSalesAmount", salesStatsResultSet.getFloat("totalSalesAmount"));
                        salesStatsJsonObject.put("totalSalesQuantity",
                                salesStatsResultSet.getInt("totalSalesQuantity"));
                    }

                    // Combine both user and product statistics
                    JSONObject combinedJsonObject = new JSONObject();
                    combinedJsonObject.put("userStatistics", userStatsJsonObject);
                    combinedJsonObject.put("productStatistics", productStatsJsonObject);
                    combinedJsonObject.put("salesStatistics", salesStatsJsonObject);

                    String json = combinedJsonObject.toString();
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, json.length());

                    OutputStream outputStream = exchange.getResponseBody();
                    outputStream.write(json.getBytes());

                    outputStream.close();
                    userStatsPreparedStatement.close();
                    productStatsPreparedStatement.close();
                    dbConnection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            });

            // Main page CSS
            server.createContext("/css-main", exchange -> {
                contextCreation(exchange, "src/frontend/admin/css/style.css", "text/css");
            });

            // Main page JS
            server.createContext("/js-main", exchange -> {
                contextCreation(exchange, "src/frontend/admin/js/script.js", "text/javascript");
            });

            server.createContext("/products", exchange -> {
                try {
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                    String sql = "SELECT * FROM products";
                    PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                    ResultSet resultSet = preparedStatement.executeQuery();

                    JSONArray jsonArray = new JSONArray();
                    while (resultSet.next()) {
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
                    String sql = "SELECT * FROM products WHERE name LIKE ?" +
                            "OR description LIKE ?" +
                            "OR price LIKE ?" +
                            "OR stock LIKE ?";
                    PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);

                    preparedStatement.setString(1, "%" + keyword + "%");
                    preparedStatement.setString(2, "%" + keyword + "%");
                    preparedStatement.setString(3, "%" + keyword + "%");
                    preparedStatement.setString(4, "%" + keyword + "%");

                    productContextCreation(exchange, dbConnection, preparedStatement, sql);
                } catch (SQLException sqlE) {
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

                        // SQL query to insert data
                        String sql = "INSERT INTO products(name, description, price, stock) VALUES(?,?,?,?)";

                        // Create a PreparedStatement
                        PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                        preparedStatement.setString(1, name);
                        preparedStatement.setString(2, description);
                        preparedStatement.setFloat(3, price);
                        preparedStatement.setInt(4, stock);

                        // Execute the INSERT command
                        preparedStatement.executeUpdate();

                        sql = "SELECT * FROM products";
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
                if ("DELETE".equals(exchange.getRequestMethod())) {
                    // Extract the item ID to be deleted from the request, for example, from the URI
                    String id = exchange.getRequestURI().getQuery().substring(3);

                    try {
                        Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);

                        // SQL query to delete data
                        String sql = "DELETE FROM products WHERE product_id = ?";

                        resetAutoIncrement(dbConnection, sql, "product", id);

                        sql = "SELECT * FROM products";
                        selectAllProducts(dbConnection, exchange, sql);
                    } catch (SQLException e) {
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

                    // SQL query to fetch single row
                    String sql = "SELECT * FROM products WHERE product_id = ?";
                    // Create a PreparedStatement
                    PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                    preparedStatement.setInt(1, Integer.parseInt(id));

                    // Execute query
                    ResultSet resultSet = preparedStatement.executeQuery();
                    JSONObject jsonObject = new JSONObject();
                    while (resultSet.next()) {
                        jsonObject.put("product_id", resultSet.getInt("product_id"));
                        jsonObject.put("name", resultSet.getString("name"));
                        jsonObject.put("description", resultSet.getString("description"));
                        jsonObject.put("price", resultSet.getFloat("price"));
                        jsonObject.put("stock", resultSet.getInt("stock"));
                        jsonObject.put("status_id", resultSet.getInt("status_id"));
                    }
                    // Convert JSON array object to String
                    String jsonString = jsonObject.toString();
                    // Close prepared statement
                    preparedStatement.close();
                    // Close database connection
                    dbConnection.close();

                    // Send a response
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, jsonString.length());

                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonString.getBytes());
                    os.close();
                } catch (SQLException e) {
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

                        // SQL query to update data
                        String sql = "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE product_id = ?";

                        // Create a PreparedStatement
                        PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                        preparedStatement.setString(1, name);
                        preparedStatement.setString(2, description);
                        preparedStatement.setFloat(3, price);
                        preparedStatement.setString(4, stock);
                        preparedStatement.setInt(5, id);

                        // Execute the UPDATE command
                        preparedStatement.executeUpdate();

                        sql = "SELECT * FROM products";
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

            // Add this block within your existing server.createContext("/product-status",
            // ...) block
            server.createContext("/product-status", exchange -> {
                try {
                    // Extract the product ID from the request, for example, from the URI
                    String productId = exchange.getRequestURI().getQuery().substring(3);

                    // Fetch the current status of the product from the database
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                    String sql = "SELECT status_id FROM products WHERE product_id = ?";
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

                        // Extract the product ID and new status from the request, for example, from the
                        // URI
                        String productId = "";
                        String newStatusId = "";
                        if (queryLength == 13) {
                            productId = exchange.getRequestURI().getQuery().substring(3, 4);
                            newStatusId = exchange.getRequestURI().getQuery().substring(12);
                        } else if (queryLength == 14) {
                            productId = exchange.getRequestURI().getQuery().substring(3, 5);
                            newStatusId = exchange.getRequestURI().getQuery().substring(13);
                        } else if (queryLength == 15) {
                            productId = exchange.getRequestURI().getQuery().substring(3, 6);
                            newStatusId = exchange.getRequestURI().getQuery().substring(14);
                        }

                        // Update the status of the product in the database
                        Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                        String sql = "UPDATE products SET status_id = ? WHERE product_id = ?";
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
                contextCreation(exchange, "src/frontend/admin/html/products.html", "text/html");
            });

            server.createContext("/product-create", exchange -> {
                contextCreation(exchange, "src/frontend/admin/html/product_create.html", "text/html");
            });

            server.createContext("/js-product", exchange -> {
                contextCreation(exchange, "src\\frontend\\admin\\js\\product.js", "text/javascript");
            });

            // Users
            server.createContext("/users", exchange -> {
                try {
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                    String sql = "SELECT * FROM users";
                    PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                    ResultSet resultSet = preparedStatement.executeQuery();

                    JSONArray jsonArray = new JSONArray();
                    while (resultSet.next()) {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("user_id", resultSet.getInt("user_id"));
                        jsonObject.put("role_id", resultSet.getInt("role_id"));
                        jsonObject.put("username", resultSet.getString("username"));
                        jsonObject.put("password", resultSet.getString("password"));
                        jsonObject.put("first_name", resultSet.getString("first_name"));
                        jsonObject.put("middle_name", resultSet.getString("middle_name"));
                        jsonObject.put("last_name", resultSet.getString("last_name"));
                        jsonObject.put("birthdate", resultSet.getString("birthdate"));
                        jsonObject.put("sex", resultSet.getString("sex"));
                        jsonObject.put("civil_status", resultSet.getString("civil_status"));
                        jsonObject.put("email", resultSet.getString("email"));
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

            server.createContext("/user-search", exchange -> {
                String keyword = exchange.getRequestURI().getQuery().substring(2);
                try {
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                    String sql = "SELECT * FROM users a INNER JOIN `roles` b ON a.role_id = b.role_id WHERE role_name LIKE ?"
                            +
                            "OR username LIKE ?" +
                            "OR password LIKE ?" +
                            "OR first_name LIKE ?" +
                            "OR middle_name LIKE ?" +
                            "OR middle_name LIKE ?" +
                            "OR last_name LIKE ?" +
                            "OR birthdate LIKE ?" +
                            "OR sex LIKE ?" +
                            "OR civil_status LIKE ?" +
                            "OR email LIKE ?";
                    PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);

                    preparedStatement.setString(1, "%" + keyword + "%");
                    preparedStatement.setString(2, "%" + keyword + "%");
                    preparedStatement.setString(3, "%" + keyword + "%");
                    preparedStatement.setString(4, "%" + keyword + "%");
                    preparedStatement.setString(5, "%" + keyword + "%");
                    preparedStatement.setString(6, "%" + keyword + "%");
                    preparedStatement.setString(7, "%" + keyword + "%");
                    preparedStatement.setString(8, "%" + keyword + "%");
                    preparedStatement.setString(9, "%" + keyword + "%");
                    preparedStatement.setString(10, "%" + keyword + "%");
                    preparedStatement.setString(11, "%" + keyword + "%");

                    userContextCreation(exchange, dbConnection, preparedStatement, sql);
                } catch (SQLException sqlE) {
                    sqlE.printStackTrace();
                }
            });

            server.createContext("/user-add", exchange -> {
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
                        int role_id = json.getInt("role_id");
                        String username = json.getString("username");
                        String password = json.getString("password");
                        String firstName = json.getString("first_name");
                        String middleName = json.getString("middle_name");
                        String lastName = json.getString("last_name");
                        String birthdate = json.getString("birthdate");
                        String sex = json.getString("sex");
                        String civilStatus = json.getString("civil_status");
                        String email = json.getString("email");

                        // SQL query to insert data
                        String sql = "INSERT INTO users(role_id, username, password, " +
                                "first_name, middle_name, last_name, " +
                                "birthdate, sex, civil_status, email) " +
                                "VALUES(?,?,?,?,?,?,?,?,?,?)";

                        // Create a PreparedStatement
                        PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                        preparedStatement.setInt(1, role_id);
                        preparedStatement.setString(2, username);
                        preparedStatement.setString(3, password);
                        preparedStatement.setString(4, firstName);
                        preparedStatement.setString(5, middleName);
                        preparedStatement.setString(6, lastName);
                        preparedStatement.setString(7, birthdate);
                        preparedStatement.setString(8, sex);
                        preparedStatement.setString(9, civilStatus);
                        preparedStatement.setString(10, email);

                        // Execute the INSERT command
                        preparedStatement.executeUpdate();

                        sql = "SELECT * FROM users";
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

            server.createContext("/user-delete", exchange -> {
                if ("DELETE".equals(exchange.getRequestMethod())) {
                    // Extract the item ID to be deleted from the request, for example, from the URI
                    String id = exchange.getRequestURI().getQuery().substring(3);

                    try {
                        Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);

                        // SQL query to delete data
                        String sql = "DELETE FROM users WHERE product_id = ?";

                        resetAutoIncrement(dbConnection, sql, "users", id);

                        sql = "SELECT * FROM users";
                        selectAllProducts(dbConnection, exchange, sql);
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }

                } else {
                    // Handle invalid HTTP method
                    String response = "Invalid HTTP method. Only DELETE requests are accepted.";
                    exchange.sendResponseHeaders(405, response.length());
                    exchange.getResponseBody().write(response.getBytes());
                }
            });

            server.createContext("/user-update", exchange -> {
                // Extract the item ID to be deleted from the request, for example, from the URI
                String id = exchange.getRequestURI().getQuery().substring(3);

                try {
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);

                    // SQL query to fetch single row
                    String sql = "SELECT * FROM users WHERE user_id = ?";
                    // Create a PreparedStatement
                    PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                    preparedStatement.setInt(1, Integer.parseInt(id));

                    // Execute query
                    ResultSet resultSet = preparedStatement.executeQuery();
                    JSONObject jsonObject = new JSONObject();
                    while (resultSet.next()) {
                        jsonObject.put("user_id", resultSet.getInt("user_id"));
                        jsonObject.put("role_id", resultSet.getInt("role_id"));
                        jsonObject.put("username", resultSet.getString("username"));
                        jsonObject.put("password", resultSet.getString("password"));
                        jsonObject.put("first_name", resultSet.getString("first_name"));
                        jsonObject.put("middle_name", resultSet.getString("middle_name"));
                        jsonObject.put("last_name", resultSet.getString("last_name"));
                        jsonObject.put("birthdate", resultSet.getString("birthdate"));
                        jsonObject.put("sex", resultSet.getString("sex"));
                        jsonObject.put("civil_status", resultSet.getString("civil_status"));
                        jsonObject.put("email", resultSet.getString("email"));

                    }
                    // Convert JSON array object to String
                    String jsonString = jsonObject.toString();
                    // Close prepared statement
                    preparedStatement.close();
                    // Close database connection
                    dbConnection.close();

                    // Send a response
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, jsonString.length());

                    OutputStream os = exchange.getResponseBody();
                    os.write(jsonString.getBytes());
                    os.close();
                } catch (SQLException e) {
                    throw new RuntimeException("An error occurred", e);
                }
            });

            server.createContext("/user-update-save", exchange -> {
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

                        int id = json.getInt("user_id");
                        int role_id = json.getInt("role_id");
                        String username = json.getString("username");
                        String password = json.getString("password");
                        String firstName = json.getString("first_name");
                        String middleName = json.getString("middle_name");
                        String lastName = json.getString("last_name");
                        String birthdate = json.getString("birthdate");
                        String sex = json.getString("sex");
                        String civilStatus = json.getString("civil_status");
                        String email = json.getString("email");

                        Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);

                        // SQL query to update data
                        String sql = "UPDATE users SET role_id = ?, username = ?, password = ?, " +
                                "first_name = ?, middle_name = ?, last_name = ?, " +
                                "birthdate = ?, sex = ?, civil_status = ?, email = ? WHERE user_id = ?";

                        // Create a PreparedStatement
                        PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                        preparedStatement.setInt(1, role_id);
                        preparedStatement.setString(2, username);
                        preparedStatement.setString(3, password);
                        preparedStatement.setString(4, firstName);
                        preparedStatement.setString(5, middleName);
                        preparedStatement.setString(6, lastName);
                        preparedStatement.setString(7, birthdate);
                        preparedStatement.setString(8, sex);
                        preparedStatement.setString(9, civilStatus);
                        preparedStatement.setString(10, email);
                        preparedStatement.setInt(11, id);

                        // Execute the UPDATE command
                        preparedStatement.executeUpdate();

                        sql = "SELECT * FROM users";
                        selectAllUsers(dbConnection, exchange, sql);

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

            // Add this block within your existing server.createContext("/product-status",
            // ...) block
            server.createContext("/product-status", exchange -> {
                try {
                    // Extract the product ID from the request, for example, from the URI
                    String productId = exchange.getRequestURI().getQuery().substring(3);

                    // Fetch the current status of the product from the database
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                    String sql = "SELECT status_id FROM products WHERE product_id = ?";
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
                        String query = exchange.getRequestURI().getQuery();
                        int queryLength = query.length();

                        // Extract the product ID and new status from the request, for example, from the
                        // URI
                        String productId = "";
                        String newStatusId = "";
                        if (queryLength == 13) {
                            productId = query.substring(3, 4);
                            newStatusId = query.substring(12);
                        } else if (queryLength == 14) {
                            productId = query.substring(3, 5);
                            newStatusId = query.substring(13);
                        } else if (queryLength == 15) {
                            productId = query.substring(3, 6);
                            newStatusId = query.substring(14);
                        }

                        // Update the status of the product in the database
                        Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                        String sql = "UPDATE products SET status_id = ? WHERE product_id = ?";
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

            server.createContext("/user-content", exchange -> {
                contextCreation(exchange, "src/frontend/admin/html/users.html", "text/html");
            });

            server.createContext("/user-create", exchange -> {
                contextCreation(exchange, "src/frontend/admin/html/user_create.html", "text/html");
            });

            server.createContext("/js-user", exchange -> {
                contextCreation(exchange, "src/frontend/admin/js/user.js", "text/javascript");
            });

            server.createContext("/sales", exchange -> {
                try {
                    Connection dbConnection = DriverManager.getConnection(URL, USER, PASSWORD);
                    String sql = "SELECT name, total_sales_quantity, total_sales_amount FROM products;";
                    PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);
                    ResultSet resultSet = preparedStatement.executeQuery();

                    JSONArray jsonArray = new JSONArray();
                    while (resultSet.next()) {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("name", resultSet.getString("name"));
                        jsonObject.put("total_sales_quantity", resultSet.getInt("total_sales_quantity"));
                        jsonObject.put("total_sales_amount", resultSet.getFloat("total_sales_amount"));
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

            server.createContext("/sales-content", exchange -> {
                contextCreation(exchange, "src/frontend/admin/html/sales.html", "text/html");
            });

            server.createContext("/js-sales", exchange -> {
                contextCreation(exchange, "src\\frontend\\admin\\js\\sales.js", "text/javascript");
            });

            server.setExecutor(null);
            server.start();
            System.out.println("Server is running at http://localhost:" + port);
        } catch (IOException e) {
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

    private static void productContextCreation(HttpExchange exchange, Connection dbConnection,
            PreparedStatement preparedStatement, String sql) {
        try {
            JSONArray jsonArray = new JSONArray();
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
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
            // Prepare statement
            PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);

            // Execute query
            ResultSet resultSet = preparedStatement.executeQuery();

            // Iterate the result set
            JSONArray jsonArr = new JSONArray();
            while (resultSet.next()) {
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

            // Close prepared statement
            preparedStatement.close();

            // Close database connection
            dbConnection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void userContextCreation(HttpExchange exchange, Connection dbConnection,
            PreparedStatement preparedStatement, String sql) {
        try {
            JSONArray jsonArray = new JSONArray();
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("user_id", resultSet.getInt("user_id"));
                jsonObject.put("role_id", resultSet.getInt("role_id"));
                jsonObject.put("username", resultSet.getString("username"));
                jsonObject.put("password", resultSet.getString("password"));
                jsonObject.put("first_name", resultSet.getString("first_name"));
                jsonObject.put("middle_name", resultSet.getString("middle_name"));
                jsonObject.put("last_name", resultSet.getString("last_name"));
                jsonObject.put("birthdate", resultSet.getString("birthdate"));
                jsonObject.put("sex", resultSet.getString("sex"));
                jsonObject.put("civil_status", resultSet.getString("civil_status"));
                jsonObject.put("email", resultSet.getString("email"));
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

    private static void selectAllUsers(Connection dbConnection, HttpExchange exchange, String sql) {
        try {
            // Prepare statement
            PreparedStatement preparedStatement = dbConnection.prepareStatement(sql);

            // Execute query
            ResultSet resultSet = preparedStatement.executeQuery();

            // Iterate the result set
            JSONArray jsonArray = new JSONArray();
            while (resultSet.next()) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("user_id", resultSet.getInt("user_id"));
                jsonObject.put("role_id", resultSet.getInt("role_id"));
                jsonObject.put("username", resultSet.getString("username"));
                jsonObject.put("password", resultSet.getString("password"));
                jsonObject.put("first_name", resultSet.getString("first_name"));
                jsonObject.put("middle_name", resultSet.getString("middle_name"));
                jsonObject.put("last_name", resultSet.getString("last_name"));
                jsonObject.put("birthdate", resultSet.getString("birthdate"));
                jsonObject.put("sex", resultSet.getString("sex"));
                jsonObject.put("civil_status", resultSet.getString("civil_status"));
                jsonObject.put("email", resultSet.getString("email"));
                jsonArray.put(jsonObject);
            }
            String json = jsonArray.toString();

            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, json.length());

            OutputStream os = exchange.getResponseBody();
            os.write(json.getBytes());
            os.close();

            // Close prepared statement
            preparedStatement.close();

            // Close database connection
            dbConnection.close();
        } catch (Exception e) {
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