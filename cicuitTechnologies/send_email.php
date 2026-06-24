<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type to JSON
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : '';
    $email = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST["phone"]) ? strip_tags(trim($_POST["phone"])) : 'Not provided';
    $company = isset($_POST["company"]) ? strip_tags(trim($_POST["company"])) : 'Not provided';
    $service = isset($_POST["service"]) ? strip_tags(trim($_POST["service"])) : 'Not specified';
    $message = isset($_POST["message"]) ? strip_tags(trim($_POST["message"])) : '';
    $consent = isset($_POST["consent"]) ? true : false;
    
    // Validate required data
    if (empty($name) || empty($email) || empty($message) || !$consent) {
        echo json_encode([
            'success' => false,
            'message' => 'Please fill in all required fields and agree to the terms.'
        ]);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please enter a valid email address.'
        ]);
        exit;
    }
    
    // Recipient email (your email)
    $recipient = "tumukundeivan5@gmail.com";
    $recipient_name = "Circuit Technologies Uganda";
    
    // Alternative recipient for backup
    $alt_recipient = "info@circuittechnologies.ug";
    
    // Email subject
    $subject = "New Contact Form Message: " . $service . " - Circuit Technologies Website";
    
    // Email content
    $email_content = "CONTACT FORM SUBMISSION DETAILS\n";
    $email_content .= "================================\n\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Company: $company\n";
    $email_content .= "Interested Service: $service\n";
    $email_content .= "Consent Given: " . ($consent ? "Yes" : "No") . "\n\n";
    $email_content .= "Message:\n";
    $email_content .= str_replace("\n", "\n", $message) . "\n\n";
    $email_content .= "================================\n";
    $email_content .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
    $email_content .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
    
    // Email headers
    $headers = "From: Circuit Technologies Website <noreply@circuittechnologies.ug>\r\n";
    $headers .= "Reply-To: $name <$email>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Attempt to send email
    $mail_sent = false;
    
    // Try sending to primary recipient
    if (mail($recipient, $subject, $email_content, $headers)) {
        $mail_sent = true;
        
        // Send auto-reply to user
        $auto_subject = "Thank you for contacting Circuit Technologies Uganda";
        $auto_message = "Dear $name,\n\n";
        $auto_message .= "Thank you for contacting Circuit Technologies Uganda Limited.\n\n";
        $auto_message .= "We have received your inquiry regarding \"$service\" and our team will review it shortly.\n\n";
        $auto_message .= "We aim to respond to all inquiries within 24 hours during business days.\n\n";
        $auto_message .= "For urgent matters, please call us at:\n";
        $auto_message .= "+256 777 333 945\n";
        $auto_message .= "+256 702 080 868\n\n";
        $auto_message .= "Best regards,\n";
        $auto_message .= "Circuit Technologies Team\n";
        $auto_message .= "Wakiso district, Entebbe, Uganda\n";
        $auto_message .= "Email: info@circuittechnologies.ug\n";
        $auto_message .= "Website: www.circuittechnologies.ug\n";
        
        $auto_headers = "From: Circuit Technologies Uganda <info@circuittechnologies.ug>\r\n";
        $auto_headers .= "Reply-To: info@circuittechnologies.ug\r\n";
        
        // Send auto-reply
        mail($email, $auto_subject, $auto_message, $auto_headers);
        
        // Also try sending to alternative recipient
        mail($alt_recipient, $subject, $email_content, $headers);
        
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully. We will get back to you soon.'
        ]);
    } else {
        // Log the error for debugging
        error_log("Failed to send email to: $recipient");
        
        // Try alternative method using SMTP settings
        $mail_sent = sendMailSMTP($recipient, $subject, $email_content, $headers);
        
        if ($mail_sent) {
            echo json_encode([
                'success' => true,
                'message' => 'Thank you! Your message has been sent successfully. We will get back to you soon.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Sorry, the email could not be sent. Please try contacting us directly at tumukundeivan5@gmail.com'
            ]);
        }
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Please use the contact form.'
    ]);
}

// Alternative function using SMTP if available
function sendMailSMTP($to, $subject, $message, $headers) {
    // If you have SMTP configured, you can use PHPMailer or similar
    // For now, we'll use a simple fallback
    return mail($to, $subject, $message, $headers);
}

// Alternative: Save to database or file if email fails
function saveContactToFile($data) {
    $filename = 'contacts/' . date('Y-m-d') . '_contacts.txt';
    $entry = date('Y-m-d H:i:s') . " | " . implode(" | ", $data) . "\n";
    file_put_contents($filename, $entry, FILE_APPEND);
}
?>