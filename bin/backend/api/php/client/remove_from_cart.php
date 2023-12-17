<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];
$product_id = $data['product_id'];

$sql = "DELETE FROM `cart` WHERE product_id = ? AND user_id = ?;";
$stmt = $db_conn->prepare($sql);
$stmt->bind_param("ii", $product_id, $user_id);

if ($stmt->execute()) {
    // User exists, fetch user data and send a success response with user information
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Removed from cart successfully.']);
} else {
    // User doesn't exist or credentials are incorrect, send a failure response
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Something went wrong.']);
}
// Close the connection
$stmt->close();
$db_conn->close();
?>
