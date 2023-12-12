<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$sql = "SELECT COUNT(DISTINCT order_date) AS transaction_count FROM `order`;";
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
