"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "./actions";

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
            let userData = await getSession();
            console.log(userData);
            setUser(userData);
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
