<?php
require_once 'api_init.php';

$data = json_decode(file_get_contents("php://input"), true);
$password = $data['password'] ?? '';

// In a real app, you'd use password_verify with a hashed password
$admin_password = "your_secure_password_here"; 

if ($password === $admin_password) {
    echo json_encode(["success" => true, "message" => "Login successful"]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Invalid credentials"]);
}
?>