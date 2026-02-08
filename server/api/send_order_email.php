<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function sendOrderEmail($userEmail, $orderId, $totalAmount) {
    $mail = new PHPMailer(true);

    try {
        // --- Server Settings ---
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com'; // Use your provider
        $mail->SMTPAuth   = true;
        $mail->Username   = 'docsmile01@gmail.com'; 
        $mail->Password   = 'uvwx xuew jcsv jnjm'; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // --- Recipients ---
        $mail->setFrom('no-reply@yourstore.com', 'Digital Store');
        $mail->addAddress($userEmail); 

        // --- Content ---
        $mail->isHTML(true);
        $mail->Subject = "Order Confirmed: #$orderId";
        $mail->Body    = "
            <div style='font-family: Arial, sans-serif; color: #333;'>
                <h2 style='color: #4CAF50;'>Payment Successful!</h2>
                <p>Hi, your order <strong>#$orderId</strong> has been confirmed.</p>
                <p><strong>Total Paid:</strong> $$totalAmount</p>
                <hr />
                <a href='http://localhost:5173/track/$orderId' 
                   style='background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                   Track Your Order
                </a>
            </div>";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email failed: " . $mail->ErrorInfo);
        return false;
    }
}