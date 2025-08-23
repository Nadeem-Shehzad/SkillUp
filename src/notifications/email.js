import nodemailer from 'nodemailer';
import { logger } from "@skillup/common-utils";

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

      logger.info('✅ Email sent:', info.messageId);
   } catch (error) {
      logger.info('❌ Failed to send otp email:', error);
   }
}