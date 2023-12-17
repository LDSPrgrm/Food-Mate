<?php
require "db_connection.php";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$username = '1';

$sql = "SELECT DISTINCT order_date FROM `orders` JOIN `users` ON users.user_id = orders.user_id WHERE username = '$username';";
$result = mysqli_query($db_conn, $sql);

if ($result) {
    // Check if there are rows in the result
    if (mysqli_num_rows($result) > 0) {
        // Fetch all rows
        $order_dates = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $order_dates[] = $row['order_date'];

            // Execute the second query for each order_date
            $order_date = $row['order_date'];
            $secondQuery = "SELECT * FROM `orders` JOIN `users` ON users.user_id = orders.user_id WHERE username = '$username' AND order_date = '$order_date';";
            $secondResult = mysqli_query($db_conn, $secondQuery);

            if ($secondResult) {
                // Process the results of the second query as needed
                while ($secondRow = mysqli_fetch_assoc($secondResult)) {
                    // Do something with the data from the second query
                }
            } else {
                // Handle errors for the second query
                echo json_encode(['success' => false, 'error' => mysqli_error($db_conn)]);
            }
        }

        header('Content-Type: application/json');
        echo json_encode(['order_dates' => $order_dates]);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'No data found']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => mysqli_error($db_conn)]);
}

$db_conn->close();
?>
