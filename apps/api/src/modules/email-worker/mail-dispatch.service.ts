import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EmailAccountDocument } from '../email-accounts/schemas/email-account.schema';

@Injectable()
export class MailDispatchService {
  async sendEmail(payload: {
    account: EmailAccountDocument;
    to: string;
    subject: string;
    html: string;
    attachment?: { filename: string; path: string };
  }) {
    const transporter = nodemailer.createTransport({
      host: payload.account.host,
      port: payload.account.port,
      secure: payload.account.secure,
      auth: {
        user: payload.account.username,
        pass: payload.account.password,
      },
    });

    const result = await transporter.sendMail({
      from: `"${payload.account.fromName}" <${payload.account.fromEmail}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      attachments: payload.attachment ? [payload.attachment] : [],
    });

    return result;
  }
}

