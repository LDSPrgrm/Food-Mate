<?php
require "db_connection.php"; // Include your database connection file

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$username = $data['username'];
$password = $data['password'];

// Validate input (you may want to add more validation)
if (empty($username) || empty($password)) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Invalid username or password.']);
    exit;
}

// Hash the password before comparing
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Query to check if the username and password match
$sql = "SELECT user_id, username, password, role_id FROM users WHERE username = ?";
$stmt = $db_conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($user_id, $username, $storedPassword, $role_id);

if ($stmt->fetch() && password_verify($password, $storedPassword)) {
    if ($role_id == 1) { // Assuming role_id 1 is for admin
        // Admin login successful
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'user_id' => $user_id, 'username' => $username, 'role_id' => $role_id]);
    } else {
        // User is not an admin
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Invalid credentials.']);
    }
} else {
    // Invalid username or password
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Invalid credentials.']);
}

$stmt->close();
$db_conn->close();
?>
