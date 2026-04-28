import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendVerificationEmail(to: string, code: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"CyberLMS" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Platformaga kirish uchun tasdiqlash kodi',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2b7bc4;">Xush kelibsiz!</h2>
            <p>Siz CyberLMS kiberxavfsizlik platformasida ro'yxatdan o'tdingiz.</p>
            <p>Akkauntingizni faollashtirish uchun quyidagi 6 xonali tasdiqlash kodini kiriting:</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h1 style="margin: 0; letter-spacing: 5px; color: #333;">${code}</h1>
            </div>
            <p>Ushbu kod 15 daqiqa davomida yaroqli.</p>
            <p>Agar siz bu so'rovni yubormagan bo'lsangiz, ushbu xatni e'tiborsiz qoldiring.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #888; text-align: center;">© ${new Date().getFullYear()} CyberLMS. Barcha huquqlar himoyalangan.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Verification email sent to ${to}`);
      return true;
    } catch (error) {
      logger.error('Error sending verification email:', error);
      return false;
    }
  }
}

export const mailService = new MailService();
