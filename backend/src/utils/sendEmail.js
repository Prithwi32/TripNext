import { createTransport } from "nodemailer";
import "dotenv/config";

const sendOTP = async (email, otp) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email - OTP",
    text: `Your OTP for email verification is: ${otp}`,
    html: `<b>Your OTP for Email Verification is: ${otp}</b>`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTP;
