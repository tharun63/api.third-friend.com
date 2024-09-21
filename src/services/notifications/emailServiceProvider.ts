import nodemailer, { Transporter } from 'nodemailer';
import PDFDocument from 'pdfkit';
import config from "../../../config/app";

interface EmailData {
  email: string;
  subject: string;
  body?: string;       // Dynamic email content
  resetURL?: string;    // Used for password reset emails
}

class EmailServiceProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.email.email_service, 
      auth: {
        user: config.email.user, // Environment variables for credentials
        pass: config.email.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // General method to send emails with optional attachments
  private async sendEmail(
    emailData: EmailData,
    ccList: string[] = [],
    attachments?: { filename: string; content: Buffer; contentType: string }[]
  ): Promise<void> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        to: emailData.email,
        cc: ccList,
        subject: emailData.subject,
        text: emailData.body, // Using dynamic email body
        attachments, // Attachments if provided
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
    }
  }

  // Method to send password reset email
  public async sendForgotPasswordEmail(emailData: EmailData): Promise<void> {
    const body = `You are receiving this email because you (or someone else) requested a password reset.
      Please click on the following link, or paste it into your browser to complete the process:
      ${emailData.resetURL}
      If you did not request this, please ignore this email.`;

    await this.sendEmail({ ...emailData, body });
  }

  // Method to send invoice email
  public async sendInvoiceEmail(email: string, session: any): Promise<void> {
    const pdfBuffer = await this.generateInvoice(session);
    const body = `Dear Customer, please find your invoice attached.
      Invoice ID: ${session.id}
      Amount Paid: ${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}`;

    const attachments = [
      {
        filename: 'invoice.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ];

    await this.sendEmail({ email, subject: 'Your Invoice', body }, [], attachments);
  }

  // Helper function to generate invoice PDF
  private async generateInvoice(session: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(25).text('Invoice', { align: 'center' });
      doc.text(`Session ID: ${session.id}`);
      doc.text(`Amount Paid: ${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}`);
      
      doc.end();
    });
  }
}

export default new EmailServiceProvider();
