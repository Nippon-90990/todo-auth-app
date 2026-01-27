import dbConnect from "@/lib/mongodb";

export default async function handler(req, res) {
    try {
        await dbConnect();
        res.status(200).json({ message: "MongoDB Connected Successfully" });
    } catch (error) {
        res.status(500).json({ error: "DB Connection Failed" });
    }
}
