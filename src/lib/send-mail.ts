'use server';
import nodemailer from 'nodemailer';

const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
// const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_SERVER_USERNAME,
    pass: process.env.SMTP_SERVER_PASSWORD,
  },
});

export async function sendEmail({
  sendTo,
  subject,
  text,
  html,
}: {
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    await transporter.verify();
  } catch (error) {
    console.error('SMTP Verification Failed:', error);
    return;
  }
  try {
    const info = await transporter.sendMail({
      from: SMTP_SERVER_USERNAME,
      to: sendTo,
      subject,
      text,
      html: html || '',
    });
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    return;
  }
}
