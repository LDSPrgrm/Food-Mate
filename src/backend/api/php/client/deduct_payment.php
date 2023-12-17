<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];
$total_amount = $data['total_amount'];

// Fetch current balance
$selectSql = "SELECT balance FROM `users` WHERE user_id = ?";
$selectStmt = $db_conn->prepare($selectSql);
$selectStmt->bind_param("i", $user_id);
$selectStmt->execute();
$selectStmt->bind_result($currentBalance);

// Check if the user exists
if ($selectStmt->fetch()) {
    // User exists, update the balance
    $newBalance = $currentBalance - $total_amount;

    // Close the previous result set
    $selectStmt->close();

    // Update the balance
    $updateSql = "UPDATE `users` SET balance = ? WHERE user_id = ?";
    $updateStmt = $db_conn->prepare($updateSql);
    $updateStmt->bind_param("di", $newBalance, $user_id);

    if ($updateStmt->execute()) {
        // Recharge successful, send a success response
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Payment successful.', 'balance' => $newBalance]);
    } else {
        // Update failed, send a failure response
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Payment failed.']);
    }

    $updateStmt->close();
} else {
    // User doesn't exist, send a failure response
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'User not found.']);
}

// Close the connection
$db_conn->close();
?>
