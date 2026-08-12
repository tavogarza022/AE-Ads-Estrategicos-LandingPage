document.addEventListener('DOMContentLoaded', () => {

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

        // Send email via Vercel Backend
        async function sendBrevoEmail(nombre, email, telefono, empresa) {
            const payload = {
                nombre,
                email,
                telefono,
                empresa
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
