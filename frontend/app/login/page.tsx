import Link from "next/link";
import LoginForm from "./form";

export default function Login() {
    return (
        <div className="bg-gray-950 w-full h-[100vh] grid place-items-center">
            <div className="grid gap-8">
                <h1 className="text-5xl font-bold text-white text-center">
                    Login
                </h1>
                <ul className="w-80 flex justify-between">
                    <li>
                        <Link
                            className="block text-xl text-white hover:text-emerald-500 p-6"
                            href="/"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="block text-xl text-white hover:text-emerald-500 p-6"
                            href="/sign-up"
                        >
                            Sign Up
                        </Link>
                    </li>
                </ul>
                <div className="grid place-items-center">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
