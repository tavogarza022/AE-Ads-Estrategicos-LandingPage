document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------
    // 1. WhatsApp Action Buttons Logic
    // ----------------------------------------------------------------
    const wpButtons = document.querySelectorAll('.wp-cta');
    const phoneNumber = "5215555555555"; // Modify with actual WhatsApp number

    wpButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const message = "Hola, me interesa iniciar con el servicio de creación y administración de campañas por $4,000 MXN/mes.";
            const wpUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(wpUrl, '_blank');
        });
    });

    // ----------------------------------------------------------------
    // 2. Form Validation Logic via Array Configuration
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

        contactForm.addEventListener('submit', (e) => {
            let isValid = true;
            const alertContainer = document.getElementById('formAlerts');
            alertContainer.innerHTML = ''; // Clear previous alerts

            formConfig.forEach(config => {
                const input = document.getElementById(config.field);
                if (!input) return; // Skip if field doesn't exist
                
                const value = input.value.trim();
                let fieldValid = true;

                // Validation rules
                if (config.required && value === '') {
                    fieldValid = false;
                } else if (config.minLength && value.length < config.minLength) {
                    fieldValid = false;
                } else if (config.isEmail) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        fieldValid = false;
                    }
                }

                // Apply UI feedback
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

            // Prevent default form submission if invalid
            if (!isValid) {
                e.preventDefault(); 
            }
        });

        // Helper function to render Bootstrap alerts
        function showAlert(message, type) {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
            alertDiv.setAttribute('role', 'alert');
            alertDiv.innerHTML = `
                <strong>¡Atención!</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            document.getElementById('formAlerts').appendChild(alertDiv);
        }
    }

    // ----------------------------------------------------------------
    // 3. Smooth Scroll for Anchor Links (UX enhancement)
    // ----------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if(target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
