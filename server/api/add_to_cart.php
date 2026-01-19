<?php
require_once 'api_init.php';

// This will Get the data from React (Axios sends JSON);
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['product_id'])) {
  try {
    $sql = "INSERT INTO cart (product_id, quantity) VALUES (:pid, :qty)";
    $stmt = $pdo->prepare($sql);
    // Bind values safely
    $stmt->execute([
      ':pid' => $data['product_id'],
      ':qty' => 1
    ]);

    echo json_encode(["message" => "Added to cart successfully"]);
  }  catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => $e->getMessage()]);
    }
}