import bcrypt from "bcryptjs";
import Otp from "@/models/Otp";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { email, otp } = req.body;
    if (!email || !otp)
        return res.status(400).json({ message: "Missing fields" });

    await dbConnect();

    const record = await Otp.findOne({ email });
    if (!record) return res.status(400).json({ message: "OTP expired" });

    if (record.expiresAt < new Date())
        return res.status(400).json({ message: "OTP expired" });

    const isValid = await bcrypt.compare(otp, record.otpHash);
    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    // Create user if not exists
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ email, name: email.split("@")[0] });
    }

    // Delete OTP after use
    await Otp.deleteMany({ email });

    res.json({ message: "OTP verified", userId: user._id });
}
