<?php
require_once 'api_init.php';

$data = json_decode(file_get_contents("php://input"), true);
$amount = $data['amount'] * 100; // Providers usually work in Kobo/Cents

$url = "https://api.paystack.co/transaction/initialize"; // Example provider

$fields = [
  'email' => $data['email'],
  'amount' => $amount,
  'callback_url' => "http://localhost:5173/payment-success",
  'metadata' => ["order_id" => $data['order_id']]
];

// Send this to the provider using CURL...
// After receiving a response:
echo json_encode([
    "success" => true, 
    "authorization_url" => $response_from_provider['data']['authorization_url']
]);