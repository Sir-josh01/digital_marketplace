<?php

require_once 'api_init.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['title'], $data['price'])) {
  try {
    $sql = "INSERT INTO products (title, price, vendor,description, image, format, size, lastUpdate) VALUES (:title, :price, :vendor, :des, :img, :form, :size, :upd)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':title' => $data['title'],
      ':price' => $data['price'],
      ':vendor' => $data['vendor'] ?? "Unknown",
      ':des' => $data['description'] ?? "",
      ':img' => $data['image'] ?? "",
      ':form' => $data['format'] ?? 'PDF',
      ':size' => $data['size'] ?? '5MB',
      ':upd' => date('M Y')
    ]);
    echo json_encode(["message" => "Product created!", "id" => $pdo->lastInsertId()]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
  }
}
