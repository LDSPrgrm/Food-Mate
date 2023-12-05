<?php
$server->createContext("/product-search", function ($request) {
    $keyword = substr($request->getUri()->getQuery(), 2);
    try {
        $dbConnection = new PDO("mysql:host=localhost;dbname=foodmate_db", "root", "admin");
        $sql = "SELECT * FROM product WHERE name LIKE ? OR description LIKE ? OR price LIKE ? OR stock LIKE ?";
        $preparedStatement = $dbConnection->prepare($sql);

        $preparedStatement->bindValue(1, "%" . $keyword . "%");
        $preparedStatement->bindValue(2, "%" . $keyword . "%");
        $preparedStatement->bindValue(3, "%" . $keyword . "%");
        $preparedStatement->bindValue(4, "%" . $keyword . "%");

        $preparedStatement->execute(); // Corrected this line

        $jsonArray = [];
        while ($row = $preparedStatement->fetch(PDO::FETCH_ASSOC)) {
            $jsonObject = [
                "product_id" => $row["product_id"],
                "name" => $row["name"],
                "description" => $row["description"],
                "price" => $row["price"],
                "stock" => $row["stock"],
                "status_id" => $row["status_id"]
            ];
            $jsonArray[] = $jsonObject;
        }

        $json = json_encode($jsonArray);
        header("Content-Type: application/json");
        header("Content-Length: " . strlen($json));
        echo $json;

        $preparedStatement->closeCursor();
        $dbConnection = null;
    } catch (PDOException $pdoException) {
        echo $pdoException->getMessage();
    }
});
?>
