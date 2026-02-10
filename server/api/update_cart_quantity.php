<?php

require_once 'api_init.php';

// Catch all errors including warnings
// error_reporting(E_ALL);
// ini_set('display_errors', 0);

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['cart_id']) && isset($data['change'])) {
    try {
        $cart_id = $data['cart_id'];
        $change = (int)$data['change'];

        // 1. Fetch current quantity for this specific row
        $stmt = $pdo->prepare("SELECT quantity FROM cart WHERE id = :cid");
        $stmt->execute([':cid' => $cart_id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
          echo json_encode(["success" => false, "message" => "Target ID $cart_id not found in table"]);
            exit;
          }

          if ($row) {
            $newQty = $row['quantity'] + $change;

            if ($newQty > 0) {
                // 2. Update quantity
                $update = $pdo->prepare("UPDATE cart SET quantity = :qty WHERE id = :cid");
                $update->execute([':qty' => $newQty, ':cid' => $cart_id]);
                echo json_encode(["success" => true, "message" => "Updated", "newQty" => $newQty]);
            } else {
                // 3. Delete if quantity drops to 0
                $delete = $pdo->prepare("DELETE FROM cart WHERE id = :cid");
                $delete->execute([':cid' => $cart_id]);
                echo json_encode(["success" => true, "message" => "Removed"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Cart item not found"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error, SQL ERROR:" .$e->getMessage(), "debug_received" => $data]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request parameters, MISSING KEYS", "debug_received" => $data]);
}