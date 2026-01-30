<?php
require_once 'api_init.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "error" => "Please fill all fields"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, full_name, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify hashed password
    if ($user && password_verify($password, $user['password'])) {
        // Don't send the hashed password back to React!
        unset($user['password']); 
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "error" => "Invalid email or password"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error"]);
}
?>