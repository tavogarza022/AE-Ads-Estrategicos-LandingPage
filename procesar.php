<?php
/**
 * Procesador del formulario de contacto
 * Redirige a gracias.html si todo es correcto.
 */

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Limpieza y Sanitización
    $nombre = htmlspecialchars(trim($_POST["nombre"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $telefono = htmlspecialchars(trim($_POST["telefono"] ?? ''));
    $empresa = htmlspecialchars(trim($_POST["empresa"] ?? ''));
    
    // 2. Validación en backend
    if (empty($nombre) || empty($email) || empty($telefono) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Redirigir de vuelta a index con un parámetro de error
        header("Location: index.html?status=error");
        exit;
    }

    // 3. Configuración del Correo
    $to = "contacto@tuagencia.com"; // TODO: Reemplazar con el correo real de la agencia AE
    $subject = "🔥 Nuevo Lead: $nombre (Desde Landing Page)";
    
    $message = "Has recibido un nuevo prospecto desde la landing page estructurada.\n\n";
    $message .= "Datos de Contacto:\n";
    $message .= "- Nombre: $nombre\n";
    $message .= "- Email: $email\n";
    $message .= "- Teléfono / WhatsApp: $telefono\n";
    if(!empty($empresa)){
        $message .= "- Empresa / Proyecto: $empresa\n";
    }
    
    // Headers del email
    $headers = "From: noreply@tudominio.com\r\n"; // TODO: Reemplazar
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // 4. Envío de Correo (Simulado / Real)
    // Descomentar la función mail() en servidor de producción:
    // $mailSent = mail($to, $subject, $message, $headers);
    
    $mailSent = true; // Simulación para que pase correctamente en pruebas

    // 5. Redirección final
    if ($mailSent) {
        header("Location: gracias.html");
        exit;
    } else {
        // Manejo de error si falla el servidor de correo
        header("Location: index.html?status=mail_error");
        exit;
    }

} else {
    // Si se accede temporalmente sin ser un POST, regresarlo al inicio
    header("Location: index.html");
    exit;
}
?>
