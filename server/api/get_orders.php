<?php
error_reporting(0);
require_once 'api_init.php';

header('Content-Type: application/json');

$user_id = $_GET['user_id'] ?? null; // Get the user ID from the URL

// // Log the incoming request to the server error log
// error_log("GET_ORDERS SIGNAL: Fetching for User ID: " . $user_id);

if (!$user_id) {
  echo json_encode(["success" => false, "error" => "User ID required"]);
  exit;
}

try {
  // 1. Fetch all orders (latest first)
  $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
  $stmt->execute([$user_id]);
  $orders = $stmt->fetchAll();

  // error_log("GET_ORDERS SIGNAL: Found " . count($orders) . " raw orders");

  // 2. For each order, fetch its specific items
  $finalOrders = [];
  foreach ($orders as $order) {

    if (is_array($order['product_summary'])) {
      $order['product_summary'] = implode(', ', $order['product_summary']);
    }

    $itemStmt = $pdo->prepare("
      SELECT oi.price, p.title as product_title 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
      ");
    $itemStmt->execute([$order['id']]);
    $items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

    // Create the "Product Summary" by joining the titles with a comma
    $titles = array_column($items, 'product_title');

    $order['items'] = $items;

    $order['product_summary'] = !empty($titles) ? implode(", ", $titles) : "No items";

    // Combine order info with its items
    $finalOrders[] = $order;
  }

  echo json_encode(["success" => true, "orders" => $finalOrders]);
} catch (Exception $e) {
  error_log("GET_ORDERS SIGNAL ERROR: " . $e->getMessage());
  http_response_code(500);
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
