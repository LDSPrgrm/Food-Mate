<?php
require "database_connection.php";
require "methods\put\update_data.php";
function handleProductUpdate($db_conn, $params) {
    // Assuming the item ID is passed as a parameter in the URL
    if (count($params) > 1) {
        $productId = $params[1];

        // Fetch data for the specified product ID
        $sql = "SELECT * FROM products WHERE product_id = ?";
        $productData = getDataWithId($db_conn, $sql, $productId);

        if (!empty($productData)) {
            // Assuming the data is sent as JSON in the request body
            $postData = json_decode(file_get_contents("php://input"), true);

            // Validate and sanitize the input data
            // (You should implement proper validation and sanitization)
            $name = $postData['name'];
            $description = $postData['description'];
            $price = $postData['price'];
            $stock = $postData['stock'];

            // Update data in the products table
            $sql = "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE product_id = ?";
            $success = updateData($db_conn, $sql, [$name, $description, $price, $stock, $productId]);

            if ($success) {
                echo json_encode(["message" => "Product updated successfully"]);
            } else {
                echo json_encode(["message" => "Failed to update product"]);
            }
        } else {
            echo json_encode(["message" => "Product not found"]);
        }
    } else {
        echo json_encode(["message" => "Invalid request for product update"]);
    }
}
?>