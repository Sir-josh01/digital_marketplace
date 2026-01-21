<?php

require_once 'api_init.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['title'], $data['price'])) {
  try {
    $sql = "INSERT INTO products (title, price, vendor, image,description,  category, format, size, lastUpdate) VALUES (:title, :price, :vendor, :image, :description, :category, :format, :size, :lastUpdate)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':title' => $data['title'],
      ':price' => $data['price'],
      ':vendor' => $data['vendor'] ?? "Unknown",
      ':description' => $data['description'] ?? "",
      ':image' => $data['image'] ?? "",
      ':category' => $data['category'] ?? "General",
      ':format' => $data['format'] ?? "ZIP",
      ':size' => $data['size'] ?? "0MB",
      ':lastUpdate' => date('M Y'),
    ]);
    
    echo json_encode(["message" => "Product created!", "id" => $pdo->lastInsertId()]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
  }
} else {
    // This will tell you if the fields were missing
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields: title or price"]);
}
