<?php
require_once 'api_init.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$amount = $data['amount'] * 100; // Paystack expects Kobo (N1 = 100 kobo)

// 1. Create a pending order in your DB first (recommended)
// $order_id = createOrderInDB($data); 

$url = "https://api.paystack.co/transaction/initialize";

$fields = [
  'email' => $email,
  'amount' => $amount,
  'callback_url' => "http://localhost:5173/history", // Where to go after success
  'metadata' => [
    'user_id' => $data['user_id'],
    'cart_items' => json_encode($data['cart'])
  ]
];

$fields_string = http_build_query($fields);

// Open connection
$ch = curl_init();
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, true);
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
curl_setopt($ch,CURLOPT_HTTPHEADER, array(
  "Authorization: Bearer sk_test_96799ba003ecaf67648388cd9714491e05b76986", // Replace with your real key
  "Cache-Control: no-cache",
));
curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 

// Execute post
$result = curl_exec($ch);
echo $result; // Send Paystack's response back to React