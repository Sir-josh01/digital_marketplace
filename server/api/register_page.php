<?php
require_once 'api_init.php';

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['full_name'] ?? '';
$email = $data['email'] ?? '';
$pass = $data['password'] ?? '';

if (empty($name) || empty($email) || empty($pass)) {
    echo json_encode(["success" => false, "error" => "All fields are required"]);
    exit;
}

// 1. Hash the password for safety
$hashed_password = password_hash($pass, PASSWORD_BCRYPT);

try {
    // 2. Insert into database
    $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $hashed_password]);

    echo json_encode(["success" => true, "message" => "Account created successfully!"]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Error code for duplicate entry
        echo json_encode(["success" => false, "error" => "Email already exists"]);
    } else {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>