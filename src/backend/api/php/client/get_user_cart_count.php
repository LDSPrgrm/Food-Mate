<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$username = $data['username'];

$sql = "SELECT COUNT(cart_id) AS cart_count FROM `cart` JOIN `users` ON users.user_id = cart.user_id WHERE username = '$username';";
$result = mysqli_query($db_conn, $sql);

if ($result->num_rows > 0) {
    $data = mysqli_fetch_assoc($result);
    header('Content-Type: application/json');
    echo json_encode($data);
} else {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'An error has occured']);
}

$db_conn->close();
?>
