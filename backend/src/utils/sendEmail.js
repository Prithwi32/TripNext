import { createTransport } from "nodemailer";
import "dotenv/config";

// Create email transporter
const createEmailTransporter = () => {
  return createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Generate the verification OTP email template
const generateVerificationTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
      }
      .header {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        padding: 30px 20px;
        text-align: center;
        border-radius: 12px 12px 0 0;
      }
      .header h1 {
        color: white;
        margin: 0;
        font-size: 26px;
        font-weight: 600;
      }
      .header p {
        color: rgba(255, 255, 255, 0.9);
        margin: 10px 0 0;
        font-size: 16px;
      }
      .content {
        padding: 30px 20px;
        background-color: #ffffff;
        border-left: 1px solid #e5e7eb;
        border-right: 1px solid #e5e7eb;
      }
      .otp-container {
        background-color: #f3f4f6;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        margin: 20px 0;
      }
      .otp {
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #4f46e5;
        margin: 10px 0;
      }
      .info {
        margin: 20px 0;
        color: #4b5563;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #6b7280;
        font-size: 14px;
        background-color: #f9fafb;
        border-radius: 0 0 12px 12px;
        border: 1px solid #e5e7eb;
        border-top: none;
      }
      .button {
        display: inline-block;
        background-color: #4f46e5;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 600;
        margin-top: 15px;
      }
      .logo {
        font-size: 28px;
        font-weight: bold;
        color: white;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .logo-icon {
        margin-right: 10px;
        font-size: 24px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">
          <span class="logo-icon">✈️</span> TripNext
        </div>
        <h1>Verify Your Email Address</h1>
        <p>Thank you for choosing TripNext for your travel adventures!</p>
      </div>
      
      <div class="content">
        <p>Hello there,</p>
        
        <p>To complete your registration and start exploring amazing destinations, please verify your email address by entering the OTP below on our website:</p>
        
        <div class="otp-container">
          <p>Your One-Time Password is:</p>
          <div class="otp">${otp}</div>
          <p>This code will expire in 10 minutes.</p>
        </div>
        
        <div class="info">
          <p>If you did not create an account with TripNext, please ignore this email.</p>
        </div>
        
        <p>Excited to have you on board!</p>
        <p>The TripNext Team</p>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} TripNext. All rights reserved.</p>
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Generate the password reset OTP email template
const generatePasswordResetTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
      }
      .header {
        background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
        padding: 30px 20px;
        text-align: center;
        border-radius: 12px 12px 0 0;
      }
      .header h1 {
        color: white;
        margin: 0;
        font-size: 26px;
        font-weight: 600;
      }
      .header p {
        color: rgba(255, 255, 255, 0.9);
        margin: 10px 0 0;
        font-size: 16px;
      }
      .content {
        padding: 30px 20px;
        background-color: #ffffff;
        border-left: 1px solid #e5e7eb;
        border-right: 1px solid #e5e7eb;
      }
      .otp-container {
        background-color: #fef2f2;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        margin: 20px 0;
        border: 1px solid #fee2e2;
      }
      .otp {
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #e11d48;
        margin: 10px 0;
      }
      .info {
        margin: 20px 0;
        color: #4b5563;
      }
      .security-note {
        background-color: #f8fafc;
        border-left: 4px solid #6366f1;
        padding: 15px;
        margin: 20px 0;
        font-size: 14px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #6b7280;
        font-size: 14px;
        background-color: #f9fafb;
        border-radius: 0 0 12px 12px;
        border: 1px solid #e5e7eb;
        border-top: none;
      }
      .button {
        display: inline-block;
        background-color: #e11d48;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 600;
        margin-top: 15px;
      }
      .logo {
        font-size: 28px;
        font-weight: bold;
        color: white;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .logo-icon {
        margin-right: 10px;
        font-size: 24px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">
          <span class="logo-icon">✈️</span> TripNext
        </div>
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password</p>
      </div>
      
      <div class="content">
        <p>Hello,</p>
        
        <p>We received a request to reset the password for your TripNext account. To proceed with the password reset, please enter the OTP below on our website:</p>
        
        <div class="otp-container">
          <p>Your Password Reset Code is:</p>
          <div class="otp">${otp}</div>
          <p>This code will expire in 10 minutes.</p>
        </div>
        
        <div class="security-note">
          <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact our support team immediately as your account may be at risk.
        </div>
        
        <div class="info">
          <p>For security reasons, this OTP will expire in 10 minutes. If you need a new code, you can request another password reset on our website.</p>
        </div>
        
        <p>Safe travels!</p>
        <p>The TripNext Team</p>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} TripNext. All rights reserved.</p>
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Main function to send verification OTP
const sendOTP = async (email, otp, type = "verification") => {
  const transporter = createEmailTransporter();

  const template =
    type === "verification"
      ? generateVerificationTemplate(otp)
      : generatePasswordResetTemplate(otp);

  const subject =
    type === "verification"
      ? "Verify your TripNext account - One-Time Password"
      : "Reset your TripNext password - One-Time Password";

  const mailOptions = {
    from: `"TripNext" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    text: `Your OTP ${
      type === "verification"
        ? "for email verification"
        : "to reset your password"
    } is: ${otp}`,
    html: template,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTP;
