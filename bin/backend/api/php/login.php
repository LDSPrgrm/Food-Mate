<?php
require 'db_connection.php';

// Read the input data
$data = json_decode(file_get_contents("php://input"));

echo $data;

// Extract username and password
$username = mysqli_real_escape_string($db_conn, $data->username);
$password = mysqli_real_escape_string($db_conn, $data->password);

// Use prepared statement to prevent SQL injection
$query = "SELECT * FROM user WHERE username = ? AND `password` = ?";
$stmt = mysqli_prepare($db_conn, $query);
mysqli_stmt_bind_param($stmt, "ss", $username, $password);
mysqli_stmt_execute($stmt);

// Check if the query was successful
$result = mysqli_stmt_get_result($stmt);

if ($result) {
    // Check if the user exists
    if (mysqli_num_rows($result) > 0) {
        // User authentication successful
        echo json_encode(['success' => true]);
    } else {
        // User not found or invalid credentials
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
} else {
    // Query execution failed
    echo json_encode(['success' => false, 'message' => 'Query execution failed']);
}

// Close the prepared statement and database connection
mysqli_stmt_close($stmt);
mysqli_close($db_conn);
?>
