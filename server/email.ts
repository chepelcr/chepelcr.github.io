import nodemailer from 'nodemailer';

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Create transporter based on available environment variables
function createTransporter() {
  // Option 1: Gmail SMTP (most common)
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }
  
  // Option 2: Generic SMTP
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
  
  // Option 3: Development mode - log emails to console
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
}

export async function sendContactEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    
    // Email to José Pablo (the website owner)
    const mailOptions = {
      from: `"Portfolio Contact Form" <noreply@jcampos.dev>`,
      to: 'chepelcr@outlook.com', // José Pablo's email
      replyTo: data.email,
      subject: `Contacto desde Portfolio: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #84cc16;">Nuevo mensaje desde tu portfolio</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Asunto:</strong> ${data.subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #84cc16; margin: 20px 0;">
            <h3>Mensaje:</h3>
            <p style="line-height: 1.6;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
            <p>Este mensaje fue enviado desde tu portfolio web.</p>
            <p>Puedes responder directamente a este email para contactar a ${data.name}.</p>
          </div>
        </div>
      `,
      text: `
Nuevo mensaje desde tu portfolio

Nombre: ${data.name}
Email: ${data.email}
Asunto: ${data.subject}

Mensaje:
${data.message}

---
Este mensaje fue enviado desde tu portfolio web.
Puedes responder directamente a este email para contactar a ${data.name}.
      `.trim()
    };

    const info = await transporter.sendMail(mailOptions);
    
    // If using development transporter, log the email
    if (info.message) {
      console.log('📧 Email would be sent:');
      console.log('---');
      console.log(info.message.toString());
      console.log('---');
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}