/**
 * standalone script to test Gmail SMTP connection using environment variables from .env.local
 */
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Load .env.local manually since this is a standalone node script
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local not found at', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) envVars[key.trim()] = value.trim();
});

const user = envVars.EMAIL_USER;
const pass = envVars.EMAIL_PASS;

if (!user || user.includes('your_email') || !pass || pass.includes('your_app_password')) {
  console.error('\n[ERROR] Invalid credentials in .env.local');
  console.error('Current EMAIL_USER:', user);
  console.error('Current EMAIL_PASS:', pass ? '********' : 'undefined');
  console.error('\nPlease update .env.local with your real Gmail credentials first.\n');
  process.exit(1);
}

console.log('--- Mailer Configuration ---');
console.log('User:', user);
console.log('Pass:', '********');
console.log('----------------------------\n');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass },
});

const mailOptions = {
  from: user,
  to: user, // Send a test mail to yourself
  subject: 'Complaint System - Connection Test',
  text: 'If you receive this email, your mailing configuration is working correctly!',
};

console.log('Attempting to send test email to:', user, '...');

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('\n[SEND FAILED]');
    console.error('Error message:', error.message);
    if (error.code === 'EAUTH') {
      console.error('\nAuthentication Failed: Check your username and App Password.');
      console.error('Ensure you are using a 16-character Google App Password if 2FA is active.');
    }
    return;
  }
  console.log('\n[SUCCESS]');
  console.log('Email sent successfully!');
  console.log('Message ID:', info.messageId);
  console.log('Check your inbox at:', user);
});
