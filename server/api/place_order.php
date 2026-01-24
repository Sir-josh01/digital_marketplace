<?php
// This brings in headers, CORS, and the $pdo connection
require_once 'api_init.php'; 

try {
    // 1. Get JSON data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data || !isset($data['cart'])) {
        throw new Exception("Empty order data received.");
    }

    // 2. Start Database Transaction
    $pdo->beginTransaction();

    // 3. Create the main Order
    $stmt = $pdo->prepare("INSERT INTO orders (total_amount, status) VALUES (?, ?)");
    $stmt->execute([
      $data['total'],
      'Confirmed'
      ]);
    $orderId = $pdo->lastInsertId();

    // 4. Create the Items (Linked by the Foreign Key)
    $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_title, price) VALUES (?, ?, ?)");
    
    foreach ($data['cart'] as $item) {
        $itemStmt->execute([
            $orderId, 
            $item['title'], 
            $item['price']
        ]);
    }

    // 5. Success!
    $pdo->commit();
    echo json_encode(["success" => true, "order_id" => $orderId, "message" => "Order placed successfully!"]);

} catch (Exception $e) {
    // Rollback if any part fails
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}