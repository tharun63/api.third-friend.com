import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';

interface EmailData {
  email: string;
  subject: string;
  resetURL: string;
}

class EmailServiceProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
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

  public async sendEmail(
    emailData: EmailData,
    ccList: string[] = []
  ): Promise<void> {
    try {
      const emailRecepient = emailData.email;
      const emailSubject = emailData.subject;

      const toEmails = [emailRecepient];
      const ccEmails = ccList;

      const mailOptions: nodemailer.SendMailOptions = {
        from: 'noreply@labsquire.com',
        to: toEmails,
        cc: ccEmails,
        subject: emailSubject,
        text: `You are receiving this email because you (or someone else) have requested a password reset.\n\nPlease click on the following link, or paste it into your browser to complete the process:\n\n${emailData.resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // TODO:: Error Log
      console.error(error);
    }
  }

  sendForgotPasswordDetailsEmail(emailData) {
    this.sendEmail(emailData);
  }
}

export default new EmailServiceProvider();
