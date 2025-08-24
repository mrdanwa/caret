<?php
// SMTP Configuration
// Copy this file to config_local.php and update with your actual SMTP settings

return [
    'smtp' => [
        'host' => 'smtp.ionos.com', // IONOS SMTP server
        'port' => 465,
        'username' => 'noreply@caretcap.com', // Your SMTP username
        'password' => 'noreply@caretcap.com', // Your SMTP password
        'encryption' => 'ssl', // SSL/TLS
        'from_email' => 'noreply@caretcap.com',
        'from_name' => 'Contact Form'
    ],
    'recipient' => 'dwang@caretcap.com',
    'subject' => 'Mensaje Web'
];
?>
