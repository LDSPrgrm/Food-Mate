<?php
require "database_connection.php";
require "methods\delete\delete_data.php";

function handleProductDeletion($db_conn, $params)
{
    // Assuming the item ID is passed as a parameter in the URL
    if (count($params) > 1) {
        $productId = $params[1];

        // Delete data from the products table
        $sql = "DELETE FROM products WHERE product_id = ?";
        $success = deleteData($db_conn, $sql, [$productId]);

        if ($success) {
            echo json_encode(["message" => "Product deleted successfully"]);
        } else {
            echo json_encode(["message" => "Failed to delete product"]);
        }
    } else {
        echo json_encode(["message" => "Invalid request for product deletion"]);
    }
}
?>