<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $path = $_SERVER['REQUEST_URI'];

    switch ($path) {
        case '/':
            createContext("src/frontend/admin/html/index.html", "text/html");
            break;
        case '/dashboard':
            createContext("src/frontend/admin/html/index.html", "text/html");
            break;
        case '/css-main':
            createContext("src/frontend/admin/css/style.css", "text/css");
            break;
        case '/js-main':
            createContext("src/frontend/admin/js/script.js", "text/javascript");
            break;

        case '/products':
            createContext("products.php", "text/html");
            break;
        case '/product-content':
            createContext("src/frontend/admin/html/products.html", "text/html");
            break;
        case '/product-search':
            createContext("productSearch.php", "text/html");
            break;
        case '/js-product':
            createContext("src/frontend/admin/js/phpProduct.js", "text/javascript");
            break;   
    }
}

function createContext($path, $headerValue)
{
    try {
        header("Content-Type: $headerValue");
        echo (strpos($path, ".php") === false) ? file_get_contents($path) : require $path;
    } catch (Exception $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo $e->getMessage();
    }
}