"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailServiceProvider {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'Gmail', // Replace with your email provider
            auth: {
                user: 'Tharunrao063@gmail.com',
                pass: 'nilw bhtw dmdi amxv',
            },
            tls: {
                rejectUnauthorized: false, // This allows self-signed certificates
            },
        });
        this.sendEmail = this.sendEmail.bind(this);
    }
    async sendEmail(emailData, ccList = []) {
        try {
            const emailRecepient = emailData.email;
            const emailSubject = emailData.subject;
            const toEmails = [emailRecepient];
            const ccEmails = ccList;
            const mailOptions = {
                from: 'noreply@labsquire.com',
                to: toEmails,
                cc: ccEmails,
                subject: emailSubject,
                text: `You are receiving this email because you (or someone else) have requested a password reset.\n\nPlease click on the following link, or paste it into your browser to complete the process:\n\n${emailData.resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            // TODO:: Error Log
            console.error(error);
        }
    }
    sendForgotPasswordDetailsEmail(emailData) {
        this.sendEmail(emailData);
    }
}
exports.default = new EmailServiceProvider();
//# sourceMappingURL=emailServiceProvider.js.map