<?php
require_once 'api_init.php';

// 1. Security Check
$headers = getallheaders();
// $providedKey = $headers['X-API-KEY'] ?? '';
$providedKey = $_SERVER['HTTP_X_API_KEY'] ?? '';

if ($providedKey !== ADMIN_API_KEY) {
    http_response_code(403);
    echo json_encode(["success" => false, "error" => "Access Denied"]);
    exit;
}

try {
    // 2. Fetch ALL orders for Admin
    $query = "SELECT * FROM orders ORDER BY created_at DESC";
    $stmt = $pdo->query($query);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $finalOrders = [];
    foreach ($orders as $order) {
        $itemStmt = $pdo->prepare("SELECT product_title, price FROM order_items WHERE order_id = ?");
        $itemStmt->execute([$order['id']]);
        $order['items'] = $itemStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Product summary for the admin table
        $titles = array_column($order['items'], 'product_title');
        $order['product_summary'] = implode(", ", $titles);
        
        $finalOrders[] = $order;
    }

    echo json_encode(["success" => true, "orders" => $finalOrders]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}