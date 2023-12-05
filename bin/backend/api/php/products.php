<?php

try{
    require "src\backend\api\php\db_connection.php";

    $sql = "SELECT * FROM product";
    $stmt = $db_conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $jsonArray = [];
    while ($row = $result->fetch_assoc()) {
        $jsonObject = [
            'product_id' => $row['product_id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'price' => $row['price'],
            'stock' => $row['stock']
        ];
        $jsonArray[] = $jsonObject;
    }

    $json = json_encode($jsonArray);
    header('Content-Type: application/json');
    echo $json;
} catch(mysqli_sql_exception $e) {
    die($e);
}

?>