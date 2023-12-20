<?php
    require "db_connection.php";

    // Fetch product data from the database
    $sql = "SELECT * FROM products";
    $result = $db_conn->query($sql);

    $productData = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $productData[] = array(
                'id' => $row['product_id'],
                'name' => $row['name'],
                'description' => $row['description'],
                'price' => $row['price'],
                'stock' => $row['stock'],
                'total_sales_quantity' => $row['total_sales_quantity'],
                'total_sales_amount' => $row['total_sales_amount'],
                'status_id' => $row['status_id']
            );
        }
    }

    // Close the database connection
    $db_conn->close();

    // Convert product data to JSON and output
    header('Content-Type: application/json');
    echo json_encode($productData);
?>