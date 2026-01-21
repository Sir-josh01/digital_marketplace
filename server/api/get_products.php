<?php 
require_once "api_init.php";

try {
 // Fetch all products, newest first
    $stmt = $pdo->query("SELECT * FROM products ORDER BY id DESC");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
 
 echo json_encode($products);

} catch(PDOException $e) {
  echo json_encode(['error' => $e->getMessage()]);
}