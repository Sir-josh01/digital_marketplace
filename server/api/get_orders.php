<?php
require_once 'api_init.php';

try {
    // 1. Fetch all orders (latest first)
    $query = "SELECT * FROM orders ORDER BY created_at DESC";
    $stmt = $pdo->query($query);
    $orders = $stmt->fetchAll();

    // 2. For each order, fetch its specific items
    $finalOrders = [];
    foreach ($orders as $order) {
        $itemStmt = $pdo->prepare("SELECT product_title, price FROM order_items WHERE order_id = ?");
        $itemStmt->execute([$order['id']]);
        $items = $itemStmt->fetchAll(PDO::FETCH_COLUMN);

        // Create the "Product Summary" by joining the titles with a comma
        $order['product_summary'] = !empty($items) ? implode(", ", $items) : "No items";

        // Combine order info with its items
        $order['items'] = $items;
        $finalOrders[] = $order;
    }

    echo json_encode(["success" => true, "orders" => $finalOrders]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}