<?php
    // Database configuration
$host = "localhost";
$db_name = "foodmate_db";
$username = "root";
$password = "admin";
$port = 3301;

// Create a database connection
$db_conn = new mysqli($host, $username, $password, $db_name, $port);

// Check the connection
if ($db_conn->connect_error) {
    die("Connection failed: " . $db_conn->connect_error);
}
?>