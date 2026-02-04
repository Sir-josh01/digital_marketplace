<?php
require_once 'api_init.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];

$user_id = $data['user_id'];
$cart = $data['cart'];
// GRAB THESE FROM THE DATA SENT BY REACT:
$address = $data['address'] ?? 'No Address';
$phone = $data['phone'] ?? 'No Phone';

// --- CURRENCY RECONCILIATION ---
$exchange_rate = 1550; // Current rate
$amount_in_naira = $data['amount'] * $exchange_rate;
$amount_in_kobo = $amount_in_naira * 100;

$url = "https://api.paystack.co/transaction/initialize";



$fields = [
  'email' => $email,
  'amount' => $amount_in_kobo,
  'callback_url' => "http://localhost:5173/history", // Where to go after success
  'metadata' => json_encode([
    'user_id' => $data['user_id'],
    'cart_items' => json_encode($data['cart']),
    "address" => $address,
    "phone" => $phone,
  ])
];

$fields_string = http_build_query($fields);

// Open connection
$ch = curl_init();
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, true);
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
curl_setopt($ch,CURLOPT_HTTPHEADER, array(
  "Authorization: Bearer sk_test_96799ba003ecaf67648388cd9714491e05b76986", 
  "Cache-Control: no-cache",
));
curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 

// Execute post
$result = curl_exec($ch);
echo $result; // Send Paystack's response back to React