<?php
require_once 'api_init.php';

// Get the data from React
$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "User ID required"]);
    exit;
}

try {
    // Delete all items for this specific user
    $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
    $result = $stmt->execute([$user_id]);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Cart cleared successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to clear cart"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>