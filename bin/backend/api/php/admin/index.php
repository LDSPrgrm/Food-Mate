<?php
require "database_connection.php";

// Set the content type for JSON

// Define the HTTP method
$method = $_SERVER["REQUEST_METHOD"];

// Extract the request parameters
$params = explode("/", $_GET["q"]);

// Resource name
$resource = $params[0];

// Handle different HTTP methods
switch ($method) {
    case "GET":
        // Handle GET request
        require "src\backend\api\php\admin\methods\get\get_data.php";
        if ($resource === "index") {
            includeFile("text/html", "index.html");
        } else if ($resource === "css-main") {
            includeFile("text/css", "src/backend/api/php/admin/src/css/style.css");
        } else if ($resource === "product-create") {
            includeFile("text/html", "src/backend/api/php/admin/src/html/product_create.html");
        } else if ($resource === "product-content") {
            includeFile("text/html", "src/backend/api/php/admin/src/html/products.html");
        } else if ($resource === "js-main") {
            includeFile("text/javascript", "src/backend/api/php/admin/src/js/script.js");
        } else if ($resource === "js-user") {
            includeFile("text/javascript", "src/backend/api/php/admin/src/js/user.js");
        } else if ($resource === "js-product") {
            includeFile("text/javascript", "src/backend/api/php/admin/src/js/product.js");
        } else if ($resource === "users") {
            $sql = "SELECT * FROM users";
            $userData = getData($db_conn, $sql);
            echo json_encode($userData);
        } else if ($resource === "products") {
            $sql = "SELECT * FROM products";
            $userData = getData($db_conn, $sql);
            echo json_encode($userData);
        } else {
            // Handle other resources or specific resource IDs
            echo json_encode(["message" => "Invalid resource"]);
        }
        break;
    case "POST":
        // Handle POST request
        if ($resource === "product-add") {
            require "src\backend\api\php\admin\methods\post\product_insert.php";
            handleProductInsertion($db_conn);
        } else {
            echo json_encode(["message" => "Invalid resource for POST request"]);
        }
        break;
    case "PUT":
        // Handle PUT request
        require "src\backend\api\php\admin\methods\put\update_data.php";
        if ($resource === "product-update") {
            require "src\backend\api\php\admin\methods\put\product_update.php";
            handleProductUpdate($db_conn, $params);
        } else if ($resource === "product-update-save") {
            require "src\backend\api\php\admin\methods\put\product_update_save.php";
            handleProductUpdateSave($db_conn);
        } else {
            echo json_encode(["message" => "Invalid resource for PUT request"]);
        }
        break;
    case "DELETE":
        // Handle DELETE request
        require "src\backend\api\php\admin\methods\delete\delete_data.php";
        if ($resource === "product-delete") {
            require "src\backend\api\php\admin\methods\delete\product_delete.php";
            handleProductDeletion($db_conn, $params);
        } else {
            echo json_encode(["message" => "Invalid resource for DELETE request"]);
        }
        break;
    default:
        // Invalid method
        include "index.html"; // Serve the HTML file for other cases
        break;
}

// Close the database connection
$db_conn->close();
function includeFile($contentType, $filePath) {
    header("Content-Type: $contentType");
    include $filePath;
}

?>

