<?php
error_reporting(0);
require_once 'api_init.php';
require_once 'send_order_email.php';

$reference = $_GET['reference'] ?? null;

if (!$reference) {
  die(json_encode(["success" => false, "message" => "No reference provided"]));
}

// 2. Verify with Paystack via cURL (The stable way)
$url = "https://api.paystack.co/transaction/verify/" . rawurlencode($reference);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Authorization: Bearer sk_test_96799ba003ecaf67648388cd9714491e05b76986",
  "Cache-Control: no-cache",
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);

  
// 3. Process if success
if ($result['status'] && $result['data']['status'] === 'success') {
  $data = $result['data'];
  $meta = $data['metadata'];
  $user_id = $meta['user_id'];

  $user_email = $data['customer']['email'];
  $amount_paid = $data['amount'] / 100; // Total in Naira
  // Logic: Convert back to USD
  $total_in_usd = $amount_paid / 1550;

  $cart_data = $meta['cart'] ?? $meta['cart_items'] ?? null;
  $cart = is_string($cart_data) ? json_decode($cart_data, true) : $cart_data;

  $address = $meta['address'] ?? $meta['shipping_address'] ?? 'Digital Delivery';
  $phone = $meta['phone'] ?? $meta['phone_number'] ?? 'N/A';

  // if (!$cart) {
  //   echo json_encode(["success" => false, "message" => "Cart data missing from metadata"]);
  //   exit;
  // }

  try {
    // $checkStmt = $pdo->prepare("SELECT id FROM orders WHERE user_id = ? AND total_amount = ? AND created_at > NOW() - INTERVAL 1 MINUTE");

    $pdo->beginTransaction();
    // Save Order
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, shipping_address, phone_number, status) VALUES (?, ?, ?, ?, 'Paid')");
    $stmt->execute([$user_id, $total_in_usd, $address, $phone]);
    $order_id = $pdo->lastInsertId();

    // Save Items
    foreach ($cart as $item) {
      $stmt_item = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
      $p_id = $item['product_id'] ?? $item['id'] ?? $item['cart_id'];
      $qty = $item['quantity'] ?? 1;
      $price = $item['price'];
      $stmt_item->execute([$order_id, $p_id, $qty, $price]);
    }

    // Clear Cart in DB
    $stmt_clear = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
    $stmt_clear->execute([$user_id]);

    $pdo->commit();

     // TRIGGER EMAIL SIGNAL
         // for Email
    // if ($stmt->execute()) {
    //   $order_id = $pdo->lastInsertId();
      
    //   echo json_encode(["success" => true, "message" => "Order saved and email sent"]);
    // }
    sendOrderConfirmation($user_email, $order_id, $amount_paid, $address);

    echo json_encode(["success" => true, "order_id" => $order_id]);
  } catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
  }
} else {
  echo json_encode(["success" => false, "message" => "Payment verification failed"]);
}
