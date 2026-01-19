<?php 
require_once "api_init.php";

try {
 $stmt = $pdo->query("SELECT * FROM products");
 $products = $stmt->fetchAll();
 
 echo json_encode($products);

} catch(PDOException $e) {
  echo json_encode(['error' => $e->getMessage()]);
}