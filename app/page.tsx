import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { ContextTest } from "./ContextTest";

export default function Home() {
    return (
        <div className="bg-gray-950 w-full h-[100vh] grid place-items-center">
            <div className="grid gap-8">
                <h1 className="text-5xl font-bold text-white text-center">
                    Home
                </h1>
                <ContextTest />
                <ul className="w-64 flex justify-between">
                    <li>
                        <Link
                            className="text-xl text-white hover:text-emerald-500 p-6"
                            href="/login"
                        >
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="text-xl text-white hover:text-emerald-500 p-6"
                            href="/sign-up"
                        >
                            Sign Up
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
