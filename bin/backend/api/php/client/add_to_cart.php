<?php
// Include your database connection file
require "db_connection.php";

// Retrieve data from the request
$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];
$product_id = $data['product_id'];
$quantity = $data['quantity'];
$price = getProductPrice($db_conn, $product_id);
$subtotal = $price * $quantity;

// Begin a transaction (optional, depending on your needs)
mysqli_begin_transaction($db_conn);

try {
    // Check if the combination of user_id and product_id exists in the cart
    $existingCartItem = getCartItem($db_conn, $user_id, $product_id);

    if ($existingCartItem) {
        // If it exists, update the quantity and subtotal
        $newQuantity = $existingCartItem['quantity'] + $quantity;
        $newSubtotal = $price * $newQuantity;

        $updateSql = "UPDATE `cart` SET quantity = ?, subtotal = ? WHERE user_id = ? AND product_id = ?";
        $updateStmt = $db_conn->prepare($updateSql);
        $updateStmt->bind_param("idii", $newQuantity, $newSubtotal, $user_id, $product_id);
        $updateStmt->execute();

        // Check if the update was successful
        if ($updateStmt->affected_rows > 0) {
            // Commit the transaction if everything is successful
            mysqli_commit($db_conn);
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'message' => 'Cart updated successfully']);
        } else {
            // Rollback the transaction if there was an issue
            mysqli_rollback($db_conn);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'Failed to update cart']);
        }

        // Close the update statement
        $updateStmt->close();
    } else {
        // If it doesn't exist, insert a new row
        $insertSql = "INSERT INTO `cart` (user_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)";
        $insertStmt = $db_conn->prepare($insertSql);
        $insertStmt->bind_param("iiid", $user_id, $product_id, $quantity, $subtotal);
        $insertStmt->execute();

        // Check if the insertion was successful
        if ($insertStmt->affected_rows > 0) {
            // Commit the transaction if everything is successful
            mysqli_commit($db_conn);
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'message' => 'Item added to the cart']);
        } else {
            // Rollback the transaction if there was an issue
            mysqli_rollback($db_conn);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'Failed to add item to the cart']);
        }

        // Close the insert statement
        $insertStmt->close();
    }
} catch (Exception $e) {
    // Handle any exceptions and rollback the transaction
    mysqli_rollback($db_conn);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    // Close the database connection
    $db_conn->close();
}

function getCartItem($db_conn, $user_id, $product_id) {
    $sql = "SELECT * FROM `cart` WHERE user_id = ? AND product_id = ?";
    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("ii", $user_id, $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $row = $result->fetch_assoc()) {
        return $row;
    } else {
        return false;
    }
}

function getProductPrice($db_conn, $product_id) {
    $sql = "SELECT price FROM `products` WHERE product_id = ?";
    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $row = $result->fetch_assoc()) {
        return $row['price'];
    } else {
        return false;
    }
}
?>
