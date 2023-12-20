<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];
$products = $data['products'];
$total_amount = $data['total_amount'];

date_default_timezone_set('Asia/Manila');
$currentDateTime = new DateTime();
$currentTimestamp = $currentDateTime->format('Y-m-d H:i:s');

mysqli_begin_transaction($db_conn);

try {
    // Fetch current balance
    $selectSql = "SELECT balance FROM `users` WHERE user_id = ?";
    $selectStmt = $db_conn->prepare($selectSql);
    $selectStmt->bind_param("i", $user_id);
    $selectStmt->execute();
    $selectStmt->bind_result($currentBalance);

    // Check if the user exists
    if (!$selectStmt->fetch()) {
        throw new Exception('User not found.');
    }

    // Check if the balance is sufficient
    if ($currentBalance < $total_amount) {
        throw new Exception('Insufficient balance.');
    }

    // Deduct payment from the user's balance
    $newBalance = $currentBalance - $total_amount;
    $updateBalanceSql = "UPDATE `users` SET balance = ? WHERE user_id = ?";
    $updateBalanceStmt = $db_conn->prepare($updateBalanceSql);
    $updateBalanceStmt->bind_param("di", $newBalance, $user_id);
    $updateBalanceStmt->execute();

    // Insert orders and update stock and sales
    foreach ($products as $product) {
        $product_id = $product['product_id'];
        $quantity = $product['quantity'];

        // Insert order
        $orderInserted = insertOrder($db_conn, $user_id, $product_id, $quantity, $currentTimestamp);
        if (!$orderInserted) {
            throw new Exception('Failed to insert order for product_id ' . $product_id);
        }

        // Update stock and sales
        $success = updateStockAndSales($db_conn, $product_id, $quantity);
        if (!$success) {
            throw new Exception('Insufficient stock for product_id ' . $product_id);
        }

        // Remove from cart
        $deleteSuccess = removeFromCart($db_conn, $user_id, $product_id);
        if (!$deleteSuccess) {
            throw new Exception('Failed to remove product_id ' . $product_id . ' from the cart.');
        }
    }

    mysqli_commit($db_conn);
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Orders and payment successful']);
} catch (Exception $e) {
    mysqli_rollback($db_conn);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    if (isset($selectStmt)) $selectStmt->close();
    if (isset($updateBalanceStmt)) $updateBalanceStmt->close();
    $db_conn->close();
}

function updateStockAndSales($db_conn, $product_id, $quantity) {
    $currentStock = getStockForProduct($db_conn, $product_id);

    if ($currentStock !== false) {
        if ($quantity > $currentStock) {
            return false;
        }

        $newStock = $currentStock - $quantity;
        $productPrice = getProductPrice($db_conn, $product_id);

        // Get existing sales information
        $existingSales = getExistingSales($db_conn, $product_id);

        if ($existingSales !== false) {
            // Product already exists in sales, update the values
            $newTotalSalesQuantity = $existingSales['total_sales_quantity'] + $quantity;
            $newTotalSalesAmount = $existingSales['total_sales_amount'] + ($quantity * $productPrice);

            $sql = "UPDATE `products` SET stock = ?, total_sales_quantity = ?, total_sales_amount = ? WHERE product_id = ?";
            $stmt = $db_conn->prepare($sql);
            $stmt->bind_param("iiid", $newStock, $newTotalSalesQuantity, $newTotalSalesAmount, $product_id);
            $stmt->execute();
        } else {
            // Product doesn't exist in sales, insert a new record
            $newTotalSalesQuantity = $quantity;
            $newTotalSalesAmount = $quantity * $productPrice;

            $sql = "INSERT INTO `products` (product_id, stock, total_sales_quantity, total_sales_amount) VALUES (?, ?, ?, ?)";
            $stmt = $db_conn->prepare($sql);
            $stmt->bind_param("iiid", $product_id, $newStock, $newTotalSalesQuantity, $newTotalSalesAmount);
            $stmt->execute();
        }

        return true;
    } else {
        return false;
    }
}

function getExistingSales($db_conn, $product_id) {
    $sql = "SELECT total_sales_quantity, total_sales_amount FROM `products` WHERE product_id = ?";
    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $row = $result->fetch_assoc()) {
        return ['total_sales_quantity' => $row['total_sales_quantity'], 'total_sales_amount' => $row['total_sales_amount']];
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

function insertOrder($db_conn, $user_id, $product_id, $quantity, $currentTimestamp) {
    $sql = "INSERT INTO `orders` (user_id, product_id, quantity, order_date) VALUES (?, ?, ?, ?)";
    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("iiis", $user_id, $product_id, $quantity, $currentTimestamp);
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
