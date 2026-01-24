<?php
require_once 'api_init.php';

$orderId = $_GET['id'] ?? null;

if (!$orderId) {
    echo json_encode(["success" => false, "error" => "No ID provided"]);
    exit;
}

try {
    // Fetch the single order
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();

    if (!$order) throw new Exception("Order not found");

    // Fetch items for this specific order
    $itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
    $itemStmt->execute([$orderId]);
    $items = $itemStmt->fetchAll();

    echo json_encode([
        "success" => true, 
        "order" => $order, 
        "items" => $items
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}