<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$user_id = $data['user_id'];
$products = $data['products'];

date_default_timezone_set('Asia/Manila');
$currentDateTime = new DateTime();
$currentTimestamp = $currentDateTime->format('Y-m-d H:i:s');

mysqli_begin_transaction($db_conn);

try {
    foreach ($products as $product) {
        $product_id = $product['product_id'];
        $quantity = $product['quantity'];

        $orderInserted = insertOrder($db_conn, $user_id, $product_id, $quantity, $currentTimestamp);
        if (!$orderInserted) {
            mysqli_rollback($db_conn);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'Failed to insert order for product_id ' . $product_id]);
            exit;
        }

        $success = updateStockAndSales($db_conn, $product_id, $quantity);
        if (!$success) {
            mysqli_rollback($db_conn);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'Insufficient stock for product_id ' . $product_id]);
            exit;
        }
    }

    foreach ($products as $product) {
        $product_id = $product['product_id'];
        $deleteSuccess = removeFromCart($db_conn, $user_id, $product_id);
        if (!$deleteSuccess) {
            mysqli_rollback($db_conn);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'Failed to remove product_id ' . $product_id . ' from the cart.']);
            exit;
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
