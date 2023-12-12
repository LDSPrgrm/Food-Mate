<?php
// Include your database connection file
require "db_connection.php";

// Retrieve data from the request
$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];
$product_id = $data['product_id'];
$quantity = $data['quantity'];
$price = $data['price'];

// Begin a transaction (optional, depending on your needs)
mysqli_begin_transaction($db_conn);

try {
    // Insert into the cart table
    $sql = "INSERT INTO `cart` (user_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("iiid", $user_id, $product_id, $quantity, $price);
    $stmt->execute();

    // Check if the insertion was successful
    if ($stmt->affected_rows > 0) {
        // Commit the transaction if everything is successful
        mysqli_commit($db_conn);
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Item added to the cart']);
    } else {
        // Rollback the transaction if there was an issue
        mysqli_rollback($db_conn);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Failed to add item to the cart']);
    }
} catch (Exception $e) {
    // Handle any exceptions and rollback the transaction
    mysqli_rollback($db_conn);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    // Close the prepared statement
    $stmt->close();
    // Close the database connection
    $db_conn->close();
}
?>
