document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------
    // 0. Dynamic Footer Year & Attribution Capture (UTM / gclid / fbclid)
    // ----------------------------------------------------------------
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    const TRACKING_KEYS = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'gclid',
        'fbclid'
    ];

    function captureAttribution() {
        try {
            const params = new URLSearchParams(window.location.search);
            const stored = JSON.parse(sessionStorage.getItem('ae_attribution') || '{}');
            let updated = false;

            TRACKING_KEYS.forEach((key) => {
                const value = params.get(key);
                if (value) {
                    stored[key] = value.slice(0, 200);
                    updated = true;
                }
            });

            if (updated) {
                stored.landing_url = window.location.pathname;
                sessionStorage.setItem('ae_attribution', JSON.stringify(stored));
            }
        } catch (err) {
            // Ignorar si sessionStorage no está disponible
        }
    }

    function getAttribution() {
        try {
            return JSON.parse(sessionStorage.getItem('ae_attribution') || '{}');
        } catch (err) {
            return {};
        }
    }

    function trackEvent(eventName, params = {}) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, {
                transport_type: 'beacon',
                ...params
            });
        }
        if (typeof window.fbq === 'function') {
            window.fbq('trackCustom', eventName, params);
        }
    }

    captureAttribution();

    // ----------------------------------------------------------------
    // 1. WhatsApp Action Buttons & Floating CTA Logic
    // ----------------------------------------------------------------
    const wpButtons = document.querySelectorAll('.wp-cta');
    const phoneNumber = "528442183098";

    wpButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            trackEvent('whatsapp_click', {
                location: 'pricing_card',
                plan: button.dataset.plan || 'unico'
            });
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'Contact', { content_name: 'WhatsApp Plan Unico' });
            }
            const message = "Hola, me interesa iniciar con el servicio de creación y administración de campañas Meta Ads por $4,000 MXN/mes.";
            const wpUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(wpUrl, '_blank', 'noopener,noreferrer');
        });
    });

    const wpFloat = document.getElementById('whatsapp-float');
    if (wpFloat) {
        wpFloat.addEventListener('click', () => {
            trackEvent('whatsapp_click', { location: 'floating_button' });
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'Contact', { content_name: 'WhatsApp Flotante' });
            }
        });
    }

    // ----------------------------------------------------------------
    // 2. Form Validation + Brevo Email Submission
    // ----------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
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

        function showAlert(message, type) {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
            alertDiv.setAttribute('role', 'alert');

            const strong = document.createElement('strong');
            strong.textContent = type === 'danger' ? '¡Atención! ' : '✅ ';
            const textNode = document.createTextNode(message);

            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'btn-close';
            closeBtn.setAttribute('aria-label', 'Cerrar');
            closeBtn.addEventListener('click', () => {
                alertDiv.remove();
            });

            alertDiv.appendChild(strong);
            alertDiv.appendChild(textNode);
            alertDiv.appendChild(closeBtn);
            document.getElementById('formAlerts').appendChild(alertDiv);
        }

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
                submitBtn.textContent = 'SOLICITAR ESTRATEGIA';
            }
        }

        async function sendBrevoEmail(nombre, email, telefono, empresa, attribution) {
            const payload = {
                nombre,
                email,
                telefono,
                empresa,
                attribution
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

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const alertContainer = document.getElementById('formAlerts');
            alertContainer.innerHTML = '';

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

            const nombre      = document.getElementById('nombre').value.trim();
            const email       = document.getElementById('email').value.trim();
            const telefono    = document.getElementById('telefono').value.trim();
            const empresa     = document.getElementById('empresa')?.value.trim() || '';
            const attribution = getAttribution();

            setLoading(true);

            try {
                await sendBrevoEmail(nombre, email, telefono, empresa, attribution);
                trackEvent('form_submit_lead', { method: 'contact_form' });
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
