"use client";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

export const ContextTest = () => {
    const { user } = useAuth();
    useEffect(() => {
        console.log(user);
    });
    return (
        <div>
            {user && (
                <div>
                    <h2 className="text-white">Email: {user?.email}</h2>
                </div>
            )}
        </div>
    );
};
