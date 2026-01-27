import dbConnect from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "GET") {
        const todos = await Todo.find({ userId: session.user.id }).sort({
            createdAt: -1,
        });

        return res.status(200).json(todos);
    }

    if (req.method === "POST") {
        const { title } = req.body;

        const todo = await Todo.create({
            title,
            userId: session.user.id,
        });

        return res.status(201).json(todo);
    }

    res.status(405).json({ message: "Method not allowed" });
}
