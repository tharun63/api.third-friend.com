"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const app_1 = __importDefault(require("../../../config/app"));
class EmailServiceProvider {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: app_1.default.email.email_service,
            auth: {
                user: app_1.default.email.user, // Environment variables for credentials
                pass: app_1.default.email.pass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    // General method to send emails with optional attachments
    async sendEmail(emailData, ccList = [], attachments) {
        try {
            const mailOptions = {
                to: emailData.email,
                cc: ccList,
                subject: emailData.subject,
                text: emailData.body, // Using dynamic email body
                attachments, // Attachments if provided
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error(error);
        }
    }
    // Method to send password reset email
    async sendForgotPasswordEmail(emailData) {
        const body = `You are receiving this email because you (or someone else) requested a password reset.
      Please click on the following link, or paste it into your browser to complete the process:
      ${emailData.resetURL}
      If you did not request this, please ignore this email.`;
        await this.sendEmail(Object.assign(Object.assign({}, emailData), { body }));
    }
    // Method to send invoice email
    async sendInvoiceEmail(email, session) {
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
    async generateInvoice(session) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default();
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.fontSize(25).text('Invoice', { align: 'center' });
            doc.text(`Session ID: ${session.id}`);
            doc.text(`Amount Paid: ${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}`);
            doc.end();
        });
    }
}
exports.default = new EmailServiceProvider();
//# sourceMappingURL=emailServiceProvider.js.map