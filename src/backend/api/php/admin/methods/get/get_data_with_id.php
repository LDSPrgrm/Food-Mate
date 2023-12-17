<?php
require "database_connection.php";
function getDataWithId($db_conn, $sql, $productId) {
    $stmt = $db_conn->prepare($sql);
    if (!$stmt) {
        return [];
    }

    // Bind parameters
    $stmt->bind_param("i", $productId);

    // Execute the statement
    $stmt->execute();

    // Get result set
    $result = $stmt->get_result();

    // Fetch data
    $data = $result->fetch_assoc();

    // Close the statement
    $stmt->close();

    return $data ? [$data] : [];
}
?>
?>