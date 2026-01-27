<?php 
require_once "api_init.php";

try {
 // Fetch all products, newest first
    $stmt = $pdo->query("SELECT * FROM products ORDER BY id DESC");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
 
 echo json_encode($products);
 echo json_encode([
        "success" => true,
        "products" => $products
    ]);

} catch(PDOException $e) {
    echo json_encode([
        "success" => false, 
        "products" => [], // Return empty array so React doesn't crash
        "error" => $e->getMessage()
    ]);
}