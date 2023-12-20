<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$username = $data['username'];
$password = $data['password'];

// SQL query to get the hashed password for the provided username
$sql = "SELECT * FROM `users` WHERE `username` = ?";
$stmt = $db_conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // User exists, fetch user data and check the password
    $userData = $result->fetch_assoc();
    $hashedPassword = $userData['password'];

    // Check if the entered password matches the stored hash
    if (password_verify($password, $hashedPassword)) {
        // Password is correct, send a success response with user information
        unset($userData['password']); // Remove the hashed password from the response
        header('Content-Type: application/json');
        echo json_encode($userData);
    } else {
        // Password is incorrect, send a failure response
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Invalid username or password.']);
    }
} else {
    // User doesn't exist, send a failure response
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Invalid username or password.']);
}

// Close the connection
$stmt->close();
$db_conn->close();
?>
