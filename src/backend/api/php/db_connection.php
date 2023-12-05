<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$db_conn = mysqli_connect("localhost", "root", "admin", "foodmate_db", 3301);

// Check connection
if($db_conn === false) {
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
?>