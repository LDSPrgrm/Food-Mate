<?php
require "database_connection.php";
require "methods\put\update_data.php";
function handleProductUpdateSave($db_conn) {
    // Assuming the data is sent as JSON in the request body
    $putData = json_decode(file_get_contents("php://input"), true);

    try {
        $id = $putData['product_id'];
        $name = $putData['name'];
        $description = $putData['description'];
        $price = $putData['price'];
        $stock = $putData['stock'];

        // Update data in the products table
        $sql = "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE product_id = ?";
        $success = updateData($db_conn, $sql, [$name, $description, $price, $stock, $id]);

        if ($success) {
            $sql = "SELECT * FROM products";
            selectAllProducts($db_conn, $sql);
        } else {
            throw new Exception("Error updating the entry.");
        }
    } catch (Exception $e) {
        // Handle errors and send an error response
        $response = "Error updating the entry.";
        http_response_code(500); // 500 Internal Server Error
        echo json_encode(["message" => $response]);
    }
}

function selectAllProducts($db_conn, $sql) {
    $result = $db_conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo json_encode([]);
    }
}
?>