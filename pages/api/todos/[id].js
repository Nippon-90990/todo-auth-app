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

    const { id } = req.query;

    // 🔒 Ensure todo belongs to logged-in user
    const todo = await Todo.findOne({
        _id: id,
        userId: session.user.id,
    });

    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }

    // UPDATE TODO (title / completed)
    if (req.method === "PUT") {
        const { title, completed } = req.body;

        if (title !== undefined) todo.title = title;
        if (completed !== undefined) todo.completed = completed;

        await todo.save();
        return res.status(200).json(todo);
    }

    // DELETE TODO
    if (req.method === "DELETE") {
        await todo.deleteOne();
        return res.status(200).json({ message: "Todo deleted" });
    }

    res.status(405).json({ message: "Method not allowed" });
}
