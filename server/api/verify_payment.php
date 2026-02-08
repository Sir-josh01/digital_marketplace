<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); 
ini_set('log_errors', 1);

require_once 'api_init.php';

header('Content-Type: application/json');

$reference = $_GET['reference'] ?? null;
if (!$reference) {
    echo json_encode(["success" => false, "message" => "No reference"]);
    exit;
}

// 1. Paystack Verification
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

if ($result && isset($result['data']) && $result['data']['status'] === 'success') {
    $data = $result['data'];
    $meta = $data['metadata'] ?? [];
    
    $user_id = $meta['user_id'] ?? null;
    $amount_naira = $data['amount'] / 100;
    $total_usd = $amount_naira / 1550; // Your conversion rate

    $address = $meta['address'] ?? 'Digital Delivery';
    $phone = $meta['phone'] ?? 'N/A';
    $notes = $meta['notes'] ?? 'None';

    try {
        $pdo->beginTransaction();

        // 2. Insert into 'orders' table (Matched to your columns)
        $stmt = $pdo->prepare("INSERT INTO orders (total_amount, shipping_address, phone_number, notes, status, user_id, paystack_ref) VALUES (?, ?, ?, ?, 'Paid', ?, ?)");
        $stmt->execute([$total_usd, $address, $phone, $notes, $user_id, $reference]);
        $order_id = $pdo->lastInsertId();

        // 3. Get items from 'cart' JOINED with 'products' to get the 'title'
        // Your order_items table requires 'product_title'
        $stmt_get_cart = $pdo->prepare("
            SELECT c.product_id, c.quantity, p.title as product_title, p.price 
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?
        ");
        $stmt_get_cart->execute([$user_id]);
        $cart_items = $stmt_get_cart->fetchAll(PDO::FETCH_ASSOC);

        if (empty($cart_items)) {
            throw new Exception("Cart is empty in database for user $user_id");
        }

        // 4. Insert into 'order_items' (Matched to your columns)
        $stmt_item = $pdo->prepare("INSERT INTO order_items (product_id, order_id, product_title, price, quantity) VALUES (?, ?, ?, ?, ?)");
        // Prepare the stock deduction statement
        $stmt_update_stock = $pdo->prepare("UPDATE products SET size = size - ? WHERE id = ?");

        // A. Record the item in the order
        foreach ($cart_items as $item) {
            $stmt_item->execute([
                $item['product_id'], 
                $order_id, 
                $item['product_title'], 
                $item['price'], 
                $item['quantity']
            ]);

            // B. DEDUCT STOCK
            $stmt_update_stock->execute([
                $item['quantity'], 
                $item['product_id']
            ]);
        }

        // 5. Clear 'cart'
        $stmt_clear = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
        $stmt_clear->execute([$user_id]);

        $pdo->commit();

        try {
            if (file_exists('send_order_email.php')) {
                require_once 'send_order_email.php';
                if (function_exists('sendOrderEmail') && !empty($user_email)) {
                    // We use amount_naira or total_usd depending on what you want the user to see
                    sendOrderEmail($user_email, $order_id, $total_usd);
                }
            }
        } catch (Exception $e) {
            // We log it, but we DON'T echo it. The user already paid and cart is cleared.
            error_log("Email notification failed: " . $e->getMessage());
        }

        echo json_encode(["success" => true, "order_id" => $order_id]);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        error_log("❌ DB Error: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Paystack verification failed"]);
}