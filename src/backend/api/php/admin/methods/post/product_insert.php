<?php
require "database_connection.php";
require "methods\post\insert_data.php";
function handleProductInsertion($db_conn)
{
    // Assuming the data is sent as JSON in the request body
    $postData = json_decode(file_get_contents("php://input"), true);

    // Validate and sanitize the input data
    // (You should implement proper validation and sanitization)
    $name = $postData['name'];
    $description = $postData['description'];
    $price = $postData['price'];
    $stock = $postData['stock'];

    // Insert data into the products table
    $sql = "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)";
    $success = insertData($db_conn, $sql, [$name, $description, $price, $stock]);

    if ($success) {
        echo json_encode(["message" => "Product inserted successfully"]);
    } else {
        echo json_encode(["message" => "Failed to insert product"]);
    }
}
?>