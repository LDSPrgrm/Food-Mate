<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];

$sql = "SELECT users.username, cart.product_id, products.name, products.price, products.stock, cart.quantity, cart.subtotal 
FROM `cart` 
JOIN `users` ON users.user_id = cart.user_id 
JOIN `products` ON products.product_id = cart.product_id 
WHERE users.user_id = '$user_id';";

$result = mysqli_query($db_conn, $sql);

if ($result) {
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($data);
} else {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'An error has occurred']);
}

$db_conn->close();
?>
