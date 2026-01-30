<?php
require_once 'api_init.php'; 

try {
    // 1. Get JSON data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data || !isset($data['cart']) || !isset($data['user_id'])) {
        throw new Exception("Incomplete order data. User ID and Cart required.");
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)");
    $stmt->execute([
      $data['user_id'],
      $data['total'],
      'Confirmed'
      ]);
    $orderId = $pdo->lastInsertId();

    $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_title, price) VALUES (?, ?, ?)");
    
    foreach ($data['cart'] as $item) {
        $itemStmt->execute([
            $orderId, 
            $item['title'], 
            $item['price']
        ]);
    }

    $clearStmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
    $clearStmt->execute([$data['user_id']]);

    $pdo->commit();
    echo json_encode(["success" => true, "order_id" => $orderId, "message" => "Order placed successfully!"]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}