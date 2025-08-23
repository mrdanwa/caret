<?php
// Improved contact form handler with better security and error handling

$recipient = "info@caretcap.es";
$subject = "Mensaje Web";

// Check if email is set and honeypot field is empty (anti-spam)
if (isset($_POST['email']) && (!isset($_POST['url']) || $_POST['url'] == '')) {
  // Sanitize inputs
  $name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
  $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
  $phone = filter_var($_POST['phone'] ?? '', FILTER_SANITIZE_STRING);
  $message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING);
  
  // Validate email
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('HTTP/1.1 400 Bad Request');
    die('Invalid email format');
  }
  
  // Construct email message
  $mess = "Nombre: ".$name."\n";
  $mess .= "Correo: ".$email."\n";
  $mess .= "Teléfono: ".$phone."\n";
  $mess .= "Mensaje: ".$message."\n";
  
  // Set headers with a domain-matching From address (critical for delivery)
  $headers = "From: Contact Form <info@caretcap.es>\r\n";
  $headers .= "Reply-To: ".$email."\r\n";
  $headers .= "X-Mailer: PHP/".phpversion()."\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8";
  
  // Send email
  $sent = mail($recipient, $subject, $mess, $headers);
  
  // Return status to JavaScript
  if ($sent) {
    http_response_code(200);
  } else {
    http_response_code(500);
    die('Email sending failed');
  }
} else {
  // Invalid submission
  header('HTTP/1.1 400 Bad Request');
  die('¡Entrada inválida!');
}
?>