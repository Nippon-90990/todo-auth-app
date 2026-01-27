import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");

    // 🔒 Protect route
    useEffect(() => {
        if (status === "unauthenticated") router.push("/");
    }, [status, router]);

    // Fetch todos
    async function fetchTodos() {
        try {
            setFetching(true);
            const res = await fetch("/api/todos");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setTodos(data);
        } catch {
            setError("Failed to load tasks");
        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        if (session) fetchTodos();
    }, [session]);

    // Add todo
    async function addTodo(e) {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });

        setTitle("");
        setLoading(false);
        fetchTodos();
    }

    // Toggle todo
    async function toggleTodo(todo) {
        await fetch(`/api/todos/${todo._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !todo.completed }),
        });
        fetchTodos();
    }

    // Delete todo
    async function deleteTodo(id) {
        if (!confirm("Delete this task?")) return;
        await fetch(`/api/todos/${id}`, { method: "DELETE" });
        fetchTodos();
    }

    const completedCount = useMemo(
        () => todos.filter((t) => t.completed).length,
        [todos]
    );

    if (status === "loading") return <p className="p-6">Loading…</p>;
    if (!session) return <p className="p-6">Signing out…</p>;

    return (
        <main>
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-10rem] left-[-10rem] w-[50rem] h-[50rem] bg-purple-400 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-[-10rem] right-[-10rem] w-[50rem] h-[50rem] bg-blue-300 rounded-full blur-3xl opacity-30" />
            </div>
            <div className="max-w-5xl mx-auto pt-14">

                {/* Page heading */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-semibold text-gray-800">
                        Your personal task manager
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Manage your tasks securely and stay productive
                    </p>
                </div>

                {/* Card */}
                <div className="flex justify-center">
                    <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">

                        {/* Header */}
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    👋 Welcome, {session.user.name}
                                </h1>
                                <p className="text-sm text-green-600 px-2 mt-1">✔ Email verified</p>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="text-sm text-red-500 cursor-pointer"
                            >
                                Sign out
                            </button>
                        </div>

                        {/* Add todo */}
                        <form onSubmit={addTodo} className="flex gap-2 mb-4">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What needs to be done?"
                                className="flex-1 rounded-lg border px-4 py-2 focus:ring-2 focus:ring-black"
                            />
                            <button
                                disabled={loading}
                                className="bg-black text-white px-4 rounded-lg cursor-pointer"
                            >
                                {loading ? "Adding…" : "Add"}
                            </button>
                        </form>

                        {/* States */}
                        {fetching && (
                            <p className="text-center text-sm text-gray-500">
                                Loading tasks…
                            </p>
                        )}
                        {error && (
                            <p className="text-center text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        {/* Todo list */}
                        <ul className="space-y-2">
                            {todos.map((todo) => (
                                <li
                                    key={todo._id}
                                    className={`flex items-center justify-between border rounded-lg px-3 py-2 transition ${todo.completed ? "bg-gray-50 text-gray-400" : ""
                                        }`}
                                >
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleTodo(todo)}
                                        />
                                        <span
                                            className={`block text-sm leading-relaxed ${todo.completed ? "line-through text-gray-400" : ""
                                                } max-h-24 overflow-y-auto break-words`}
                                        >
                                            {todo.title}
                                        </span>

                                    </label>

                                    <button
                                        onClick={() => deleteTodo(todo._id)}
                                        className="text-sm text-red-500 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Stats */}
                        <div className="mt-4 text-sm text-gray-500 flex justify-between">
                            <span>{todos.length} tasks</span>
                            <span>{completedCount} completed</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-16">
                    Todo App • Built with Next.js & MongoDB
                </p>
            </div>
        </main>
    );
}
