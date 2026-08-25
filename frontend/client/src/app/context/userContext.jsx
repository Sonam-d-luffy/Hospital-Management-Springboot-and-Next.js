"use client";

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Invalid stored user:", error);
                localStorage.removeItem("user");
            }
        }

        setLoading(false);
    }, []);

    // Login / store user
    const loginUser = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // Logout
    const logoutUser = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                loginUser,
                logoutUser,
                loading,
                isLoggedIn: !!user,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error(
            "useUser must be used inside UserProvider"
        );
    }

    return context;
};