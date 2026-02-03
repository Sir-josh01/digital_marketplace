<?php
// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json");
require_once 'api_init.php';

if ($result['status'] && $result['data']['status'] === 'success') {
    $meta = $result['data']['metadata'];
    $user_id = $meta['user_id'];
    $total = $result['data']['amount'] / 100;
    $cart = json_decode($meta['cart_items'], true);

    try {
        // 1. Insert Order using $pdo
        $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'Paid')");
        $stmt->execute([$user_id, $total]);
        $order_id = $pdo->lastInsertId();

        $pdo->getAttribute(PDO::ATTR_SERVER_INFO);

        // 2. Insert Items
        foreach ($cart as $item) {
            $stmt_item = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            $qty = $item['quantity'] ?? 1;
            $stmt_item->execute([$order_id, $item['id'], $qty, $item['price']]);
        }

        // 3. Clear Cart
        $stmt_clear = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
        $stmt_clear->execute([$user_id]);

        echo json_encode(["success" => true, "order_id" => $order_id]);

    } catch (PDOException $e) {
      if ($e->errorInfo[1] == 2006) {
        // The server went away, try to reconnect once
        require 'api_init.php'; 
    }
        echo json_encode(["success" => false, "message" => "Database Error: " . $e->getMessage()]);
    }
}