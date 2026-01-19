<?php

$host = "localhost";
$db_name = "marketplace_db";
$user = "root";
$pass = "";


try {
  // create connection to DB
  $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8mb4";
  $pdo = new PDO($dsn, $user, $pass);

  // Set error mode to exception so we can see mistakes
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // set default fetch mode to pick Associative arrays
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}
