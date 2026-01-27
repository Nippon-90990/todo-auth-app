import { Resend } from "resend";
import bcrypt from "bcryptjs";
import Otp from "@/models/Otp";
import dbConnect from "@/lib/dbConnect";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    await dbConnect();

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // Delete old OTPs
    await Otp.deleteMany({ email });

    // Save OTP
    await Otp.create({
        email,
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // Send email
    await resend.emails.send({
        from: "Todo App <onboarding@resend.dev>",
        to: email,
        subject: "Your Login OTP",
        html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    res.json({ message: "OTP sent successfully" });
}
