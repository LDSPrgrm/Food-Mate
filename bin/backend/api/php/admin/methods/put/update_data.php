<?php
require "database_connection.php";

function updateData($db_conn, $sql, $values) {
    $stmt = $db_conn->prepare($sql);
    if (!$stmt) {
        return false;
    }

    // Bind parameters
    $stmt->bind_param("ssdi", ...$values);

    // Execute the statement
    $success = $stmt->execute();

    // Close the statement
    $stmt->close();

    return $success;
}
?>