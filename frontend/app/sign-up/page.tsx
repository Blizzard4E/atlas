import Link from "next/link";
import SignUpForm from "./form";

export default function Login() {
    return (
        <div className="bg-gray-950 w-full h-[100vh] grid place-items-center">
            <div className="grid gap-8">
                <h1 className="text-5xl font-bold text-white text-center">
                    Sign Up
                </h1>
                <ul className="w-96 flex justify-between">
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
                            href="/login"
                        >
                            Login
                        </Link>
                    </li>
                </ul>
                <div className="grid place-items-center">
                    <SignUpForm />
                </div>
            </div>
        </div>
    );
}
