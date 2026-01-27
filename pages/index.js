import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10rem] left-[-10rem] w-[50rem] h-[50rem] bg-purple-400 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-[-10rem] right-[-10rem] w-[50rem] h-[50rem] bg-blue-300 rounded-full blur-3xl opacity-30" />
      </div>
      <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Stay focused. Get things done.
        </h1>

        <p className="text-gray-500 mb-6">
          A simple and secure todo app to manage your daily tasks.
        </p>

        <ul className="text-sm text-gray-600 mb-6 space-y-2">
          <li>✔ Secure login with Google or GitHub</li>
          <li>✔ Your tasks are private</li>
          <li>✔ Clean and distraction-free design</li>
        </ul>

        <button
          onClick={() => signIn()}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Continue with Google / GitHub
        </button>

        <p className="text-xs text-gray-400 mt-6">
          Built with Next.js, MongoDB & NextAuth
        </p>
      </div>
    </main>
  );
}
