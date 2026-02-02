<?php
require_once 'api_init.php';
$configFile = __DIR__ . '/../config/admin-doc.php';
// require_once 'config/admin-doc.php'; 
if (!file_exists($configFile)) {
    echo json_encode(["success" => false, "error" => "Config file missing at: " . $configFile]);
    exit;
}
require_once $configFile;

$data = json_decode(file_get_contents("php://input"), true);
$password = $data['password'] ?? '';

if (password_verify($password, ADMIN_HASH)) {
    echo json_encode(["success" => true, "message" => "Login successful"]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Invalid credentials"]);
}
?>