<?php

// Load PHPMailer classes manually
require_once 'PHPMailer-6.8.0/src/Exception.php';
require_once 'PHPMailer-6.8.0/src/PHPMailer.php';
require_once 'PHPMailer-6.8.0/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load configuration
$config_file = file_exists('config_local.php') ? 'config_local.php' : 'config.php';
$config = require $config_file;

// Extract configuration
$recipient = $config['recipient'];
$subject = $config['subject'];
$smtp_config = $config['smtp'];

// Check if email is set and honeypot field is empty (anti-spam)
if (isset($_POST['email']) && (!isset($_POST['url']) || $_POST['url'] == '')) {
  try {
    // Sanitize inputs
    $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      throw new Exception('Invalid email address');
    }

    // Create PHPMailer instance
    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host = $smtp_config['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $smtp_config['username'];
    $mail->Password = $smtp_config['password'];
    $mail->SMTPSecure = $smtp_config['encryption'] === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $smtp_config['port'];
    $mail->CharSet = 'UTF-8';

    // Recipients
    $mail->setFrom($smtp_config['from_email'], $smtp_config['from_name']);
    $mail->addAddress($recipient);
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(false); // Set to true if you want HTML email
    $mail->Subject = $subject;
    
    // Construct email message
    $emailBody = "Nombre: " . $name . "\n";
    $emailBody .= "Correo: " . $email . "\n";
    $emailBody .= "Teléfono: " . $phone . "\n";
    $emailBody .= "Mensaje: " . $message . "\n";
    
    $mail->Body = $emailBody;

    // Send email
    $mail->send();
    
    // Return success status to JavaScript
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Email sent successfully']);
    
  } catch (Exception $e) {
    // Return error status to JavaScript
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Email sending failed: ' . $mail->ErrorInfo]);
  }
} else {
  // Invalid submission
  http_response_code(400);
  echo json_encode(['status' => 'error', 'message' => '¡Entrada inválida!']);
}
?>