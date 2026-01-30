<?php
require_once 'api_init.php';

$response = ["success" => false, "data" => [], "error" => ""];
$uid = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if (!$uid) {
    $response["error"] = "No user ID provided";
    echo json_encode($response);
    exit;
}

try {
    // SQL JOIN to get product details for each item in the cart
    $sql = "SELECT cart.id as cart_id, products.title, products.price, products.image, cart.quantity 
            FROM cart 
            JOIN products ON cart.product_id = products.id WHERE cart.user_id = :uid";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':uid' => $uid]);

    // FETCH_ASSOC prevents duplicate numeric keys, keeping JSON clean
    $response["data"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $response["success"] = true;

} catch (PDOException $e) {
  $response["error"] = $e->getMessage();
}
  echo json_encode($response);
?>