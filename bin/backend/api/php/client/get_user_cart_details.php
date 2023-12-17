<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$username = $data['username'];

$sql = "SELECT cart_id, users.username, cart.product_id, products.price, cart.quantity, cart.subtotal 
FROM `cart` 
JOIN `users` ON users.user_id = cart.user_id 
JOIN `products` ON products.product_id = cart.product_id 
WHERE username = '$username';";

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
