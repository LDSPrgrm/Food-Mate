<?php
require "database_connection.php";

function handleProductRequests($db_conn, $params) {
    // Check if it is a search request
    if (count($params) > 1 && $params[1] === "product-search") {
        handleProductSearch($db_conn);
    } else {
        // Handle other product-related requests
        // ...
        echo json_encode(["message" => "Invalid product request"]);
    }
}

function handleProductSearch($db_conn) {
    // Assuming the keyword is passed as a parameter in the URL
    $keyword = $_GET["keyword"];

    try {
        $sql = "SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR price LIKE ? OR stock LIKE ?";
        $stmt = $db_conn->prepare($sql);

        $keywordParam = "%" . $keyword . "%";

        $stmt->bind_param("ssss", $keywordParam, $keywordParam, $keywordParam, $keywordParam);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode([]);
        }

        $stmt->close();
    } catch (Exception $e) {
        // Handle errors and send an error response
        $response = "Error searching for products.";
        http_response_code(500); // 500 Internal Server Error
        echo json_encode(["message" => $response]);
    }
}
?>