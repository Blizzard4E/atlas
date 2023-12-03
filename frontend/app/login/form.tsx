"use client";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions";
import { useAuth } from "../AuthProvider";
import { useState } from "react";

export default function LoginForm() {
    const { user, setUser } = useAuth();
    const [error, setError] = useState(false);
    const router = useRouter();
    return (
        <form
            action={async (formData: FormData) => {
                setError(false);
                let response = await loginAction(formData);
                if (response.status == 200) {
                    if (response.email) {
                        setUser({ email: response.email });
                    }
                    router.push("/");
                } else {
                    setError(true);
                }
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
            {error && <p className="text-red-500">Wrong email or password</p>}
            <div className="grid place-items-center">
                <button className="text-lg text-white bg-emerald-500 px-3 py-1 rounded-md">
                    Login
                </button>
            </div>
        </form>
    );
}
