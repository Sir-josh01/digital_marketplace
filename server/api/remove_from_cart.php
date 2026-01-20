<?php
require_once 'api_init.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['cart_id'])) {
    try {
        $stmt = $pdo->prepare("DELETE FROM cart WHERE id = ?");
        $stmt->execute([$data['cart_id']]);
        
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>