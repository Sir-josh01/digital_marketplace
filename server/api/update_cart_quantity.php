<?php
require_once 'api_init.php';
// Ensure no extra spaces or echoes exist before this line
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['product_id'])) {
  try {
    $pid = $data['product_id'];
    $change = (int)$data['change'];

    // 1. Verify if the item exists in the cart table
    $stmt = $pdo->prepare("SELECT quantity FROM cart WHERE product_id = :pid");
    $stmt->execute([':pid' => $pid]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
      $newQty = $row['quantity'] + $change;

      if ($newQty > 0) {
        $update = $pdo->prepare("UPDATE cart SET quantity = :qty WHERE product_id = :pid");
        $update->execute([':qty' => $newQty, ':pid' => $pid]);
        echo json_encode(["success" => true, "message" => "Updated to $newQty"]);
      } else {
        $delete = $pdo->prepare("DELETE FROM cart WHERE product_id = :pid");
        $delete->execute([':pid' => $pid]);
        echo json_encode(["success" => true, "message" => "Removed from cart"]);
      }
    } else {
      // This tells React EXACTLY why it failed
      echo json_encode(["success" => false, "message" => "Product ID $pid not found in cart"]);
    }
  } catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
  }
} else {
  echo json_encode(["success" => false, "message" => "Missing product_id in request"]);
}
