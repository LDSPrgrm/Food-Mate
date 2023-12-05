<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$username = $data['username'];
$password = $data['password'];

// SQL query to check if the user exists
$sql = "SELECT * FROM `user` WHERE `username` = ? AND `password` = ?";
$stmt = $db_conn->prepare($sql);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

// Check if there are any results
if ($result->num_rows > 0) {
    // User exists, fetch user data and send a success response with user information
    $userData = $result->fetch_assoc();
    header('Content-Type: application/json');
    echo json_encode($userData);
} else {
    // User doesn't exist or credentials are incorrect, send a failure response
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Invalid username or password.']);
}

// Close the connection
$stmt->close();
$db_conn->close();
?>
