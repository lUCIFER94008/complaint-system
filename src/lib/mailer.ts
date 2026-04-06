import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    console.log("Sending email to:", to);

    const res = await transporter.sendMail({
      from: `"Complaint System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("EMAIL SENT:", res);
  } catch (err: any) {
    console.error("EMAIL ERROR:", err.message);
    throw err;
  }
}