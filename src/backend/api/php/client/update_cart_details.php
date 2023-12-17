<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];
$product_id = $data['product_id'];
$newQuantity = $data['quantity'];
$newSubtotal = $data['subtotal'];

mysqli_begin_transaction($db_conn);

// SQL query to update the cart table
$updateQuery = "UPDATE cart
                SET quantity = $newQuantity,
                    subtotal = $newSubtotal
                WHERE user_id = $user_id
                    AND product_id = $product_id;";

// Execute the update query
if ($db_conn->query($updateQuery) === TRUE) {
    mysqli_commit($db_conn);
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Successfully updated cart details']);
} else {
    mysqli_rollback($db_conn);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Failed to update item in the cart']);
}

// Close the connection
$db_conn->close();
?>
