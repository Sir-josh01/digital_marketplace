<?php
require_once 'api_init.php';

$response = ["success" => false, "data" => [], "error" => ""];
try {
    // SQL JOIN to get product details for each item in the cart
    $sql = "SELECT cart.id as cart_id, products.title, products.price, products.image, cart.quantity 
            FROM cart 
            JOIN products ON cart.product_id = products.id";
            
    $stmt = $pdo->query($sql);

    // FETCH_ASSOC prevents duplicate numeric keys, keeping JSON clean
    $response["data"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $response["success"] = true;
    // $cartItems = $stmt->fetchAll();

    // echo json_encode($cartItems);
} catch (PDOException $e) {
  $response["error"] = $e->getMessage();
    // echo json_encode(["error" => $e->getMessage()]);
}
  echo json_encode($response);
?>