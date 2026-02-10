<?php
require_once 'api_init.php';
header('Content-Type: application/json');

$api_key = $_SERVER['HTTP_X_API_KEY'] ?? '';
if ($api_key !== 'your_actual_key_here') { // Match your .env VITE_ADMIN_API_KEY
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

try {
    // 1. Get Total Revenue
    $revenue = $pdo->query("SELECT SUM(total_amount) as total FROM orders WHERE status = 'Paid'")->fetch();

    // 2. Get Total Orders
    $orderCount = $pdo->query("SELECT COUNT(id) as total FROM orders")->fetch();

    // Most popular product
    $popular = $pdo->query("
        SELECT product_title, COUNT(*) as count 
        FROM order_items 
        GROUP BY product_title 
        ORDER BY count DESC 
        LIMIT 1
    ")->fetch();

    // 3. Get Low Stock Alert (Products with less than 5 items left)
    // Adjust 'size' to your stock column name if different
    $lowStock = $pdo->query("SELECT title, size FROM products WHERE size < 5")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "stats" => [
            "total_revenue" => number_format($revenue['total'], 2),
            "total_orders" => $orderCount['total'] ?? 0,
            "top_product" => $popular['product_title'] ?? 'N/A',
            "low_stock_items" => $lowStock
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}