<?php
require_once 'api_init.php';

// Get JSON data from React (Axios)
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['product_id'])) {
    try {
        $pid = $data['product_id'];

        $checkSql = "SELECT id, quantity FROM cart WHERE product_id = :pid";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->execute([':pid' => $pid]);
        $existingItem = $checkStmt->fetch();

        if ($existingItem) {
            // 2. If it exists, UPDATE the quantity (+1)
            $newQty = $existingItem['quantity'] + 1;
            $updateSql = "UPDATE cart SET quantity = :qty WHERE product_id = :pid";
            $updateStmt = $pdo->prepare($updateSql);
            $updateStmt->execute([
                ':qty' => $newQty,
                ':pid' => $pid
            ]);
            echo json_encode(["success" => true, "message" => "Quantity updated", "status" => "incremented"]);
        } else {
            // 3. If it's new, INSERT it with quantity 1
            $insertSql = "INSERT INTO cart (product_id, quantity) VALUES (:pid, 1)";
            $insertStmt = $pdo->prepare($insertSql);
            $insertStmt->execute([':pid' => $pid]);
            echo json_encode(["success" => true, "message" => "Added to cart", "status" => "new_item"]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No product ID provided"]);
}