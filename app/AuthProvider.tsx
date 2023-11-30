"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
    email: string;
    // Add more user properties if needed
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>({
        email: "123",
    });

    useEffect(() => {
        async function fetchUserData() {
            const response = await fetch("/api/session", {
                cache: "no-store",
            });
            const data = await response.json();
            setUser({
                email: data.userData.email,
            });
            console.log(data.userData);
        }
        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
