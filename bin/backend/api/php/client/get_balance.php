<?php
require "db_connection.php"; // Include your database connection file

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];

// Fetch user's balance
$selectSql = "SELECT balance FROM `users` WHERE user_id = ?";
$selectStmt = $db_conn->prepare($selectSql);
$selectStmt->bind_param("i", $user_id);
$selectStmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Return the balance
    $balance = $result->fetch_assoc();
    header('Content-Type: application/json');
    echo json_encode($balance);
} else {
    // User doesn't exist or credentials are incorrect, send a failure response
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Something went wrong.']);
}

$selectStmt->close();

// Close the database connection
$db_conn->close();
?>
