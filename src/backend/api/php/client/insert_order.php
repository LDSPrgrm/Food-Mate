<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];
$products = $data['products'];

mysqli_begin_transaction($db_conn);

try {
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

    // Remove items from the cart after a successful order
    foreach ($products as $product) {
        $product_id = $product['product_id'];
        $deleteSuccess = removeFromCart($db_conn, $user_id, $product_id);
        if (!$deleteSuccess) {
            throw new Exception('Failed to remove product_id ' . $product_id . ' from the cart.');
        }
    }

    mysqli_commit($db_conn);
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Orders successful']);
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
    $sql = "INSERT INTO `orders` (user_id, product_id, quantity) VALUES (?, ?, ?)";
    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("iii", $user_id, $product_id, $quantity);
    $stmt->execute();

    return $stmt->affected_rows > 0;
}

function removeFromCart($db_conn, $user_id, $product_id) {
    $sql = "DELETE FROM `cart` WHERE product_id = ? AND user_id = ?";
    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("ii", $product_id, $user_id);
    $stmt->execute();

    return $stmt->affected_rows > 0;
}

function getStockForProduct($db_conn, $product_id) {
    $sql = "SELECT stock FROM `products` WHERE product_id = ?";
    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $row = $result->fetch_assoc()) {
        return $row['stock'];
    } else {
        return false;
    }
}

function updateStockForProduct($db_conn, $product_id, $quantity) {
    $currentStock = getStockForProduct($db_conn, $product_id);

    if ($currentStock !== false) {
        if ($quantity > $currentStock) {
            return false;
        }

        $newStock = $currentStock - $quantity;

        $sql = "UPDATE `products` SET stock = ? WHERE product_id = ?";
        $stmt = $db_conn->prepare($sql);
        $stmt->bind_param("ii", $newStock, $product_id);
        $stmt->execute();

        return true;
    } else {
        return false;
    }
}
?>
