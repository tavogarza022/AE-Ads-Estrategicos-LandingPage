// Vercel Serverless Function: api/contact.js

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Build HTML email body
function buildEmailHTML(nombre, email, telefono, empresa, attribution) {
    const safeNombre = escapeHTML(nombre);
    const safeEmail = escapeHTML(email);
    const safeTelefono = escapeHTML(telefono);
    const safeEmpresa = escapeHTML(empresa);
    const phoneDigits = String(telefono || '').replace(/\D/g, '');

    const attrEntries = attribution && typeof attribution === 'object'
        ? Object.entries(attribution).filter(([, v]) => typeof v === 'string' && v.trim() !== '')
        : [];

    const attributionBlock = attrEntries.length > 0 ? `
                                        <tr><td style="height:10px;"></td></tr>
                                        <tr>
                                            <td style="padding:12px 15px;background:#0b0b0d;border-radius:8px;border-left:3px solid #f7931e;">
                                                <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Origen / Atribución</p>
                                                ${attrEntries.map(([k, v]) => `<p style="color:#ccc;font-size:12px;margin:2px 0;"><strong>${escapeHTML(k)}:</strong> ${escapeHTML(v)}</p>`).join('')}
                                            </td>
                                        </tr>` : '';

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
                                                <p style="color:#fff;font-size:16px;font-weight:600;margin:0;">${safeNombre}</p>
                                            </td>
                                        </tr>
                                        <tr><td style="height:10px;"></td></tr>
                                        <tr>
                                            <td style="padding:12px 15px;background:#0b0b0d;border-radius:8px;border-left:3px solid #f7931e;">
                                                <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Correo Electrónico</p>
                                                <p style="margin:0;"><a href="mailto:${safeEmail}" style="color:#f7931e;font-size:15px;text-decoration:none;">${safeEmail}</a></p>
                                            </td>
                                        </tr>
                                        <tr><td style="height:10px;"></td></tr>
                                        <tr>
                                            <td style="padding:12px 15px;background:#0b0b0d;border-radius:8px;border-left:3px solid #f7931e;">
                                                <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Teléfono / WhatsApp</p>
                                                <p style="margin:0;"><a href="https://wa.me/${phoneDigits}" style="color:#f7931e;font-size:15px;text-decoration:none;">${safeTelefono}</a></p>
                                            </td>
                                        </tr>
                                        ${safeEmpresa ? `
                                        <tr><td style="height:10px;"></td></tr>
                                        <tr>
                                            <td style="padding:12px 15px;background:#0b0b0d;border-radius:8px;border-left:3px solid #f7931e;">
                                                <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Empresa / Proyecto</p>
                                                <p style="color:#fff;font-size:15px;margin:0;">${safeEmpresa}</p>
                                            </td>
                                        </tr>` : ''}
                                        ${attributionBlock}
                                    </table>
                                    <!-- CTA -->
                                    <div style="text-align:center;margin-top:28px;">
                                        <a href="https://wa.me/${phoneDigits}"
                                           style="display:inline-block;background:#b85800;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:8px;letter-spacing:1px;">
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

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { nombre, email, telefono, empresa, attribution } = req.body || {};

    if (!nombre || !email || !telefono) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    if (!BREVO_API_KEY) {
        console.error('Missing BREVO_API_KEY environment variable');
        return res.status(500).json({ message: 'Error de configuración del servidor' });
    }

    const payload = {
        sender: {
            name: 'Ads Estratégicos',
            email: 'info@adsestrategicos.com'
        },
        to: [
            { email: 'aeadsestrategicos@gmail.com', name: 'AE Ads Estratégicos' },
            { email: 'tavo_garza04@hotmail.com', name: 'Tavo Garza' }
        ],
        replyTo: { email: email, name: nombre },
        subject: `🔥 Nuevo Lead: ${nombre} — AE Ads Landing Page`,
        htmlContent: buildEmailHTML(nombre, email, telefono, empresa, attribution)
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
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
            console.error('Brevo API Error:', errorData);
            return res.status(response.status).json({ message: 'Error al enviar el correo desde Brevo', error: errorData });
        }

        const data = await response.json();
        return res.status(200).json({ message: 'Correo enviado con éxito', data });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};
