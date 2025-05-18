import { Router } from "express";
import { Guide } from "../models/guide.models.js";
import sendOTP from "../utils/sendEmail.js";
import { hash, compare } from "bcryptjs";

const router = Router();

router.post("/register", async (req, res) => {
  const { guideEmail } = req.body;

  // generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins

  let guide = await Guide.findOne(guideEmail);
  if (guide) {
    guide.otp = hashedOtp;
    guide.otpExpiry = otpExpiry;
    await guide.save();
  } else {
    console.log(guideEmail);
    guide = await Guide.create({ guideEmail, otp: hashedOtp, otpExpiry });
  }

  await sendOTP(guideEmail, otp);
  res.json({ message: "OTP sent to your email" });
});

router.post("/verify", async (req, res) => {
  const { guideEmail, otp } = req.body;

  const guide = await Guide.findOne({ guideEmail });
  if (!guide || !guide.otp || guide.otpExpiry < new Date()) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }

  const isMatch = await compare(otp, guide.otp);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  guide.isVerified = true;
  guide.otp = undefined;
  guide.otpExpiry = undefined;
  await guide.save();

  res.json({ message: "Email verified successfully" });
});

export default router;
