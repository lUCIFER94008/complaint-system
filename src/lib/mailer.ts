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

    const info = await transporter.sendMail({
      from: `"Complaint System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("EMAIL SUCCESS:", info.messageId);
  } catch (error: any) {
    console.error("EMAIL ERROR:", error);
    throw new Error("Email failed");
  }
}