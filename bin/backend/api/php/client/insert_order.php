<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];
$products = $data['products'];
$total_amount = $data['total_amount'];

mysqli_begin_transaction($db_conn);

try {
    // Insert orders and update stock for each product
    foreach ($products as $product) {
        $product_id = $product['product_id'];
        $quantity = $product['quantity'];

        $orderInserted = insertOrder($db_conn, $user_id, $product_id, $quantity);
        if (!$orderInserted) {
            throw new Exception('Failed to insert order for product_id ' . $product_id);
        }

        $success = updateStockForProduct($db_conn, $product_id, $quantity);
        if (!$success) {
            throw new Exception('Insufficient stock for product_id ' . $product_id);
        }
    }

    // Update user balance
    $selectSql = "SELECT balance FROM `users` WHERE user_id = ?";
    $selectStmt = $db_conn->prepare($selectSql);
    $selectStmt->bind_param("i", $user_id);
    $selectStmt->execute();
    $selectStmt->bind_result($currentBalance);

    // Check if the user exists
    if ($selectStmt->fetch()) {
        $newBalance = $currentBalance - $total_amount;

        $selectStmt->close();

        $updateSql = "UPDATE `users` SET balance = ? WHERE user_id = ?";
        $updateStmt = $db_conn->prepare($updateSql);
        $updateStmt->bind_param("di", $newBalance, $user_id);

        if ($updateStmt->execute()) {
            mysqli_commit($db_conn);
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'message' => 'Orders and payment successful.', 'balance' => $newBalance]);
        } else {
            throw new Exception('Failed to update user balance.');
        }

        $updateStmt->close();
    } else {
        throw new Exception('User not found.');
    }
} catch (Exception $e) {
    mysqli_rollback($db_conn);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    if (isset($stmt1)) $stmt1->close();
    if (isset($stmt2)) $stmt2->close();
    if (isset($stmt3)) $stmt3->close();
    $db_conn->close();
}

function insertOrder($db_conn, $user_id, $product_id, $quantity) {
    // Your existing insertOrder function
}

function updateStockForProduct($db_conn, $product_id, $quantity) {
    // Your existing updateStockForProduct function
}
?>
