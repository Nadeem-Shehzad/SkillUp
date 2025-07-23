import nodemailer from 'nodemailer';
import { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } from '../config/env.js';


const transporter = nodemailer.createTransport({
   host: MAIL_HOST,
   port: Number(MAIL_PORT),
   secure: false,
   requireTLS: true,
   auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
   },
});


export const sendEmail = async ({ to, subject, data }) => {
   try {
      const info = await transporter.sendMail({
         from: `"SkillUp" <${MAIL_USER}>`,
         to,
         subject: subject,
         html: data,
      });

      console.log('✅ Email sent:', info.messageId);
   } catch (error) {
      console.error('❌ Failed to send otp email:', error);
   }
}