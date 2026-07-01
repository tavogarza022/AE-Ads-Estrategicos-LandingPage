document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------
    // Brevo API Configuration
    // (API Key is loaded from config.js — see README)
    // ----------------------------------------------------------------
    const BREVO_API_KEY = window.BREVO_CONFIG?.apiKey || '';
    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
    const RECIPIENT_EMAIL = 'adsestrategicos@gmail.com';
    const RECIPIENT_NAME  = 'AE Ads Estratégicos';

    // ----------------------------------------------------------------
    // 1. WhatsApp Action Buttons Logic
    // ----------------------------------------------------------------
    const wpButtons = document.querySelectorAll('.wp-cta');
    const phoneNumber = "528442183098";

    wpButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const message = "Hola, me interesa iniciar con el servicio de creación y administración de campañas por $4,000 MXN/mes.";
            const wpUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(wpUrl, '_blank');
        });
    });

    // ----------------------------------------------------------------
    // 2. Form Validation + Brevo Email Submission
    // ----------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Validation configuration array
        const formConfig = [
            {
                field: 'nombre',
                required: true,
                minLength: 3,
                errorMessage: 'Por favor, ingresa tu Nombre Completo (mínimo 3 caracteres).'
            },
            {
                field: 'email',
                required: true,
                isEmail: true,
                errorMessage: 'Por favor, ingresa un Correo Electrónico válido.'
            },
            {
                field: 'telefono',
                required: true,
                minLength: 10,
                errorMessage: 'Por favor, ingresa un número de Teléfono/WhatsApp de al menos 10 dígitos.'
            }
        ];

        // Helper: render Bootstrap alerts
        function showAlert(message, type) {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
            alertDiv.setAttribute('role', 'alert');
            alertDiv.innerHTML = `
                <strong>${type === 'danger' ? '¡Atención!' : '✅'}</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            document.getElementById('formAlerts').appendChild(alertDiv);
        }

        // Helper: set button loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        function setLoading(isLoading) {
            if (isLoading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ENVIANDO...
                `;
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'SOLICITAR ESTRATEGIA';
            }
        }

        // Build HTML email body
        function buildEmailHTML(nombre, email, telefono, empresa) {
            return `
                <!DOCTYPE html>
                <html lang="es">
                <body style="margin:0;padding:0;background-color:#0b0b0d;font-family:Montserrat,Arial,sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0b0d;padding:30px 0;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#16161b;border-radius:12px;overflow:hidden;border:1px solid rgba(247,147,30,0.3);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background:linear-gradient(135deg,#1a1a22,#0b0b0d);padding:30px;text-align:center;border-bottom:2px solid #f7931e;">
                                            <h1 style="color:#f7931e;margin:0;font-size:22px;font-weight:700;letter-spacing:2px;">🔥 NUEVO LEAD</h1>
                                            <p style="color:#999;margin:6px 0 0;font-size:13px;">AE Ads Estratégicos — Landing Page</p>
                                        </td>
                                    </tr>
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding:30px;">
                                            <p style="color:#ccc;margin:0 0 20px;font-size:15px;">Recibiste un nuevo prospecto desde la landing page:</p>
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="padding:12px 15px;background:#0b0b0d;border-radius:8px;margin-bottom:10px;border-left:3px solid #f7931e;">
                                                        <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Nombre</p>
                                                        <p style="color:#fff;font-size:16px;font-weight:600;margin:0;">${nombre}</p>
                                                    </td>
                                                </tr>
                                                <tr><td style="height:10px;"></td></tr>
                                                <tr>
                                                    <td style="padding:12px 15px;background:#0b0b0d;border-radius:8px;border-left:3px solid #f7931e;">
                                                        <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Correo Electrónico</p>
                                                        <p style="margin:0;"><a href="mailto:${email}" style="color:#f7931e;font-size:15px;text-decoration:none;">${email}</a></p>
                                                    </td>
                                                </tr>
                                                <tr><td style="height:10px;"></td></tr>
                                                <tr>
                                                    <td style="padding:12px 15px;background:#0b0b0d;border-radius:8px;border-left:3px solid #f7931e;">
                                                        <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Teléfono / WhatsApp</p>
                                                        <p style="margin:0;"><a href="https://wa.me/${telefono.replace(/\D/g,'')}" style="color:#f7931e;font-size:15px;text-decoration:none;">${telefono}</a></p>
                                                    </td>
                                                </tr>
                                                ${empresa ? `
                                                <tr><td style="height:10px;"></td></tr>
                                                <tr>
                                                    <td style="padding:12px 15px;background:#0b0b0d;border-radius:8px;border-left:3px solid #f7931e;">
                                                        <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Empresa / Proyecto</p>
                                                        <p style="color:#fff;font-size:15px;margin:0;">${empresa}</p>
                                                    </td>
                                                </tr>` : ''}
                                            </table>
                                            <!-- CTA -->
                                            <div style="text-align:center;margin-top:28px;">
                                                <a href="https://wa.me/${telefono.replace(/\D/g,'')}"
                                                   style="display:inline-block;background:#f7931e;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:8px;letter-spacing:1px;">
                                                    💬 RESPONDER POR WHATSAPP
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding:15px 30px;background:#0b0b0d;text-align:center;border-top:1px solid rgba(247,147,30,0.15);">
                                            <p style="color:#555;font-size:11px;margin:0;">AE Ads Estratégicos &copy; ${new Date().getFullYear()} — Notificación automática de lead</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `;
        }

        // Send email via Brevo API
        async function sendBrevoEmail(nombre, email, telefono, empresa) {
            const payload = {
                sender: {
                    name: 'AE Ads Estratégicos — Landing',
                    email: RECIPIENT_EMAIL
                },
                to: [
                    { email: RECIPIENT_EMAIL, name: RECIPIENT_NAME }
                ],
                replyTo: { email: email, name: nombre },
                subject: `🔥 Nuevo Lead: ${nombre} — AE Ads Landing Page`,
                htmlContent: buildEmailHTML(nombre, email, telefono, empresa)
            };

            const response = await fetch(BREVO_API_URL, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': BREVO_API_KEY,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al enviar el correo.');
            }

            return await response.json();
        }

        // Form submit handler
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const alertContainer = document.getElementById('formAlerts');
            alertContainer.innerHTML = '';

            // --- Validation ---
            let isValid = true;
            formConfig.forEach(config => {
                const input = document.getElementById(config.field);
                if (!input) return;

                const value = input.value.trim();
                let fieldValid = true;

                if (config.required && value === '') {
                    fieldValid = false;
                } else if (config.minLength && value.length < config.minLength) {
                    fieldValid = false;
                } else if (config.isEmail) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) fieldValid = false;
                }

                if (!fieldValid) {
                    isValid = false;
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    showAlert(config.errorMessage, 'danger');
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            });

            if (!isValid) return;

            // --- Send via Brevo ---
            const nombre   = document.getElementById('nombre').value.trim();
            const email    = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const empresa  = document.getElementById('empresa')?.value.trim() || '';

            setLoading(true);

            try {
                await sendBrevoEmail(nombre, email, telefono, empresa);

                // Success: redirect to gracias.html
                window.location.href = 'gracias.html';

            } catch (error) {
                console.error('Brevo error:', error);
                setLoading(false);
                showAlert(
                    'Hubo un problema al enviar tu solicitud. Por favor, intenta de nuevo o escríbenos por WhatsApp.',
                    'danger'
                );
            }
        });
    }

    // ----------------------------------------------------------------
    // 3. Smooth Scroll for Anchor Links (UX enhancement)
    // ----------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
