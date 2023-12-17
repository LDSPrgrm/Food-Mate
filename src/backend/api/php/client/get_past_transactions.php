<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];

// Get transaction count
$countQuery = "SELECT COUNT(DISTINCT order_date) AS transaction_count FROM `orders` JOIN `users` ON users.user_id = orders.user_id WHERE users.user_id = '$user_id'";
$countResult = $db_conn->query($countQuery);
$countRow = $countResult->fetch_assoc();
$transactionCount = $countRow['transaction_count'];

// Get distinct order dates
$dateQuery = "SELECT DISTINCT order_date FROM `orders` JOIN `users` ON users.user_id = orders.user_id WHERE users.user_id = '$user_id'";
$dateResult = $db_conn->query($dateQuery);

// Fetch orders for each date
$transactions = [];
while ($dateRow = $dateResult->fetch_assoc()) {
    $orderDate = $dateRow['order_date'];

    $orderQuery = "SELECT products.name, products.price, orders.quantity, orders.subtotal, orders.order_date FROM `orders` 
                   JOIN `users` ON users.user_id = orders.user_id 
                   JOIN `products` ON products.product_id = orders.product_id 
                   WHERE users.user_id = '$user_id' AND order_date = '$orderDate'";

    $orderResult = $db_conn->query($orderQuery);

    $orders = [];
    while ($orderRow = $orderResult->fetch_assoc()) {
        $orders[] = $orderRow;
    }

    $transactions[] = ['order_date' => $orderDate, 'orders' => $orders];
}

// Close the database connection
$db_conn->close();

// Output JSON response
header('Content-Type: application/json');
echo json_encode(['transaction_count' => $transactionCount, 'transactions' => $transactions]);
?>
