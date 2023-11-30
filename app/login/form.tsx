"use client";

import { useRouter } from "next/navigation";
import { loginAction } from "../actions";
import { useAuth } from "../AuthProvider";

export default function LoginForm() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    return (
        <form
            action={async (formData: FormData) => {
                let userData = await loginAction(formData);
                console.log(userData);
                setUser(userData);
                router.push("/");
            }}
            className="grid gap-4 w-80"
        >
            <input
                name="email"
                type="text"
                placeholder="Email address..."
                className="w-full text-lg text-white px-2 py-1 bg-gray-800 rounded-md focus:outline-none focus:outline-emerald-500"
            />
            <input
                name="password"
                type="text"
                placeholder="Password..."
                className="w-full text-lg text-white px-2 py-1 bg-gray-800 rounded-md focus:outline-none focus:outline-emerald-500"
            />
            <div className="grid place-items-center">
                <button className="text-lg text-white bg-emerald-500 px-3 py-1 rounded-md">
                    Login
                </button>
            </div>
        </form>
    );
}
