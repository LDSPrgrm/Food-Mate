<?php
require "src\backend\api\php\admin\database_connection.php";
function getData($db_conn, $sql) {
    $result = $db_conn->query($sql);
    if ($result->num_rows > 0) {
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        return $data;
    } else {
        return [];
    }
}
?>