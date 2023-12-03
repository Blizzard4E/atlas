import Image from "next/image";
import Link from "next/link";

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
                <form action="" className="grid gap-4 w-80">
                    <input
                        type="text"
                        placeholder="Email address..."
                        className="w-full text-lg text-white px-2 py-1 bg-gray-800 rounded-md focus:outline-none focus:outline-emerald-500"
                    />
                    <input
                        type="text"
                        placeholder="Password..."
                        className="w-full text-lg text-white px-2 py-1 bg-gray-800 rounded-md focus:outline-none focus:outline-emerald-500"
                    />
                    <div className="grid place-items-center">
                        <button className="text-lg text-white bg-emerald-500 px-3 py-1 rounded-md">
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
