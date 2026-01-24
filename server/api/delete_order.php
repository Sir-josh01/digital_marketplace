
<?php
require_once 'api_init.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['order_id'])) {
    echo json_encode(["success" => false, "error" => "No ID provided"]);
    exit;
}

try {
    // Delete the order (Note: order_items will be deleted if you have ON DELETE CASCADE)
    $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
    $stmt->execute([$data['order_id']]);

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}