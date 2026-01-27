import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getUser(req, res) {
    const session = await getServerSession(req, res, authOptions);
    return session?.user || null;
}
