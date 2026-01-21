<?php
require_once 'api_init.php';
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['product_id']) && isset($data['change'])) {
  try {
    $pid = $data['product_id'];
    $change = (int)$data['change']; // +1 or -1

    // 1. Get current quantity
    $sql = "SELECT quantity FROM cart WHERE product_id = :pid";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':pid' => $pid]);
    $row = $stmt->fetch();

    if ($row) {
      $newQty = $row['quantity'] + $change;

      if ($newQty > 0) {
        // Update with new quantity
        $update = $pdo->prepare("UPDATE cart SET quantity = :qty WHERE product_id = :pid");
        $update->execute([':qty' => $newQty, ':pid' => $pid]);
        echo json_encode(["success" => true]);
      } else {
        // If quantity hits 0, delete the item
        $delete = $pdo->prepare("DELETE FROM cart WHERE product_id = :pid");
        $delete->execute([':pid' => $pid]);
        echo json_encode(["success" => true, "removed" => true]);
      }
    }
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
  }
}
