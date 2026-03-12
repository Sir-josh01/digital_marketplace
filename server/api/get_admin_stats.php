<?php

// Handle preflight request
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-API-KEY, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
    exit;
}

require_once 'api_init.php';
// header('Content-Type: application/json');

$api_key = $_SERVER['HTTP_X_API_KEY'] ?? '';
if ($api_key !== 'Pastorlikeme01') { 
    // http_response_code(403);
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
        SELECT product_title, SUM(quantity) as total_sold 
        FROM order_items 
        GROUP BY product_title 
        ORDER BY total_sold DESC
        LIMIT 1
    ")->fetch();

    // 3. Get Low Stock Alert (Products with less than 5 items left)
    $lowStock = $pdo->query("SELECT title, stock_quantity FROM products WHERE stock_quantity < 5")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "stats" => [
            "total_revenue" => number_format((float)($revenue['total'] ?? 0), 2),
            "total_orders" => (int)($orderCount['total'] ?? 0),
            "top_product" => $popular['product_title'] ?? 'N/A',
            "low_stock_items" => $lowStock
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}