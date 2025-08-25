<?php

$recipient = "dwang@caretcap.com";
$subject = "Mensaje del formulario web";
$api_key = "6Ld0uLErAAAAAD29OwkywJ8kVn1Ce5E8tedasdf_"; // Replace with your actual API key

// Function to verify reCAPTCHA token
function verifyRecaptcha($token, $api_key) {
  $url = "https://recaptchaenterprise.googleapis.com/v1/projects/caret-capital/assessments?key=" . $api_key;
  
  $data = [
    "event" => [
      "token" => $token,
      "expectedAction" => "submit",
      "siteKey" => "6Ld0uLErAAAAAL4_WwbY6yoPAHxMREIxCNFvrYRY"
    ]
  ];
  
  $options = [
    'http' => [
      'header' => "Content-type: application/json\r\n",
      'method' => 'POST',
      'content' => json_encode($data)
    ]
  ];
  
  $context = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  
  if ($result === FALSE) {
    return false;
  }
  
  $response = json_decode($result, true);
  
  // Check if the assessment was successful and the score is high enough
  if (isset($response['tokenProperties']['valid']) && $response['tokenProperties']['valid'] === true) {
    if (isset($response['riskAnalysis']['score']) && $response['riskAnalysis']['score'] > 0.5) {
      return true;
    }
  }
  
  return false;
}

// Check if email is set and honeypot field is empty (anti-spam)
if (isset($_POST['email']) && (!isset($_POST['url']) || $_POST['url'] == '')) {
  // Verify reCAPTCHA token
  if (!isset($_POST['recaptcha_token']) || !verifyRecaptcha($_POST['recaptcha_token'], $api_key)) {
    header('HTTP/1.1 400 Bad Request');
    die('reCAPTCHA verification failed');
  }
  
  // Sanitize inputs
  $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
  $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
  $phone = htmlspecialchars(trim($_POST['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
  $message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

  // Construct HTML email message
  $mess = '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo mensaje del formulario web</title>
    <style>
        body {
            font-family: "Open Sans", sans-serif;
            line-height: 1.45;
            color: #1f1f1f;
            background-color: #fafafa;
            margin: 0;
            padding: 20px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }
        .header {
            background-color: #004225;
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-family: "Times New Roman", serif;
            font-size: 2.36859rem;
            font-weight: 700;
            line-height: 1;
        }
        .content {
            padding: 40px 30px 20px 30px;
        }
        .field-group {
            margin-bottom: 25px;
            padding: 20px;
            background-color: #fafafa;
            border-left: 4px solid #004225;
            border-radius: 3px;
        }
        .field-label {
            font-weight: 700;
            color: #004225;
            font-size: 0.75019rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            display: block;
            font-family: "Montserrat", sans-serif;
        }
        .field-value {
            font-size: 1rem;
            color: #1f1f1f;
            word-wrap: break-word;
            font-family: "Open Sans", sans-serif;
        }
        .field-value a {
            color: #004225;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s ease-in-out;
        }
        .field-value a:hover {
            color: #192233;
        }
        .footer {
            background-color: #fafafa;
            padding: 30px;
            text-align: center;
            font-size: 0.75019rem;
            color: #6a6a6a;
            border-top: 1px solid #e1e1e1;
            font-family: "Times New Roman", serif;
        }
        .logo-text {
            font-family: "Times New Roman", serif;
            font-weight: 700;
            color: #004225;
            font-size: 1.333rem;
            margin-bottom: 10px;
        }
        .company-tagline {
            color: #6a6a6a;
            font-style: italic;
            margin-bottom: 0;
        }
        .capital-c {
            font-size: 1.6rem;
            font-weight: 900;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nuevo Mensaje</h1>
        </div>
        
        <div class="content">
            <div class="field-group">
                <span class="field-label">Nombre</span>
                <div class="field-value">' . (!empty($name) ? $name : '<em>No proporcionado</em>') . '</div>
            </div>
            
            <div class="field-group">
                <span class="field-label">Correo Electrónico</span>
                <div class="field-value"><a href="mailto:' . $email . '">' . $email . '</a></div>
            </div>
            
            <div class="field-group">
                <span class="field-label">Teléfono</span>
                <div class="field-value">' . (!empty($phone) ? '<a href="tel:' . $phone . '">' . $phone . '</a>' : '<em>No proporcionado</em>') . '</div>
            </div>
            
            <div class="field-group">
                <span class="field-label">Mensaje</span>
                <div class="field-value">' . (!empty($message) ? nl2br($message) : '<em>No hay mensaje</em>') . '</div>
            </div>
        </div>
        
        <div class="footer">
            <div class="logo-text"><span class="capital-c">C</span>ARET <span class="capital-c">C</span>APITAL</div>
            <p class="company-tagline">Inversión inmobiliaria activa accesible, inteligente y de confianza</p>
        </div>
    </div>
</body>
</html>';
  
  // Set headers for HTML email
  $headers = "MIME-Version: 1.0\r\n";
  $headers .= "Content-type: text/html; charset=UTF-8\r\n";
  $headers .= "X-Mailer: PHP/".phpversion()."\r\n";
  $headers .= "From: Mensaje Web <sh-836392268@eu.hosting-webspace.io>\r\n";
  
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