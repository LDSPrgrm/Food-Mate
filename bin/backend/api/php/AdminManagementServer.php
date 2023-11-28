<?php
$HOST = "127.0.0.1";
$USER = "root";
$PASSWORD = "admin";
$DATABASE = "ecommerce";
$PORT = 3301;

// Handling HTTP requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $path = $_SERVER['REQUEST_URI'];

    switch ($path) {
        case '/':
            contextCreation("src/frontend/admin/html/index.html", "text/html");
            break;
        case '/products':
            contextCreations("src/backend/api/php/products.php", "application/json");
            break;
        case '/product-content':
            contextCreation("src/frontend/admin/html/products.html", "text/html");
            break;
        case '/css-main':
            contextCreation("src/frontend/admin/css/style.css", "text/css");
            break;
        case '/js-main':
            contextCreation("src/frontend/admin/js/script.js", "text/javascript");
            break;
        case '/js-product':
            contextCreation("src/frontend/admin/js/product.js", "text/javascript");
            break;
    }
}

function contextCreation($path, $headerValue)
{
    try {
        header("Content-Type: $headerValue");
        echo file_get_contents($path);
    } catch (\Exception $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo $e->getMessage();
    }
}

function contextCreations($path, $headerValue)
{
    header("Content-Type: $headerValue");
    include $path;
}
