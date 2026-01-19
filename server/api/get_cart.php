<?php
require_once 'api_init.php';

try {
    // SQL JOIN to get product details for each item in the cart
    $sql = "SELECT cart.id as cart_id, products.title, products.price, products.image, cart.quantity 
            FROM cart 
            JOIN products ON cart.product_id = products.id";
            
    $stmt = $pdo->query($sql);
    $cartItems = $stmt->fetchAll();

    echo json_encode($cartItems);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>