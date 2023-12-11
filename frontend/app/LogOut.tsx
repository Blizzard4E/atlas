"use client";
import { useRouter } from "next/navigation";
import { logOut, loginAction } from "./actions";
import { useAuth } from "./AuthProvider";
import { useState } from "react";

export default function LogOut() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    return (
        <form
            action={async (f) => {
                let response = await logOut();
                if (response.status == 200) {
                    setUser(null);
                }
            }}
            className="text-xl text-white hover:text-red-500 cursor-pointer"
        >
            <button className="p-6">Logout</button>
        </form>
    );
}
