"use client";

import { createContext, useContext, useEffect, useState } from "react";

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
    const [hospitalId, setHospitalId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedHospitalId = localStorage.getItem("hospitalId");

        if (storedHospitalId) {
            setHospitalId(storedHospitalId);
        }

        setLoading(false);
    }, []);

    const loginHospital = (id) => {
        localStorage.setItem("hospitalId", id);
        setHospitalId(id);
    };

    const logout = () => {
        localStorage.removeItem("hospitalId");
        setHospitalId(null);
    };

    return (
        <HospitalContext.Provider
            value={{
                hospitalId,
                loginHospital,
                logout,
                loading,
                isLoggedIn: !!hospitalId,
            }}
        >
            {children}
        </HospitalContext.Provider>
    );
};

export const useHospital = () => {
    const context = useContext(HospitalContext);

    if (!context) {
        throw new Error(
            "useHospital must be used inside HospitalProvider"
        );
    }

    return context;
};