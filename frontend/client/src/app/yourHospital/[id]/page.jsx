"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHospital } from "../../context/hospitalContext";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { id } = useParams();
    const router =  useRouter()
    const addDoctorPage = (id) => {
        router.push(`/addDoctor/${id}`)
    }
    const hospitalAppointment = (id) => {
        router.push(`/hospitalAppointment/${id}`)
    }
    const fetchHospital = async () => {
        if (!id) return;

        setLoading(true);
        setMessage("");

        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/hospital/details/${id}`
            );

            setHospital(res?.data);
        } catch (error) {
            setMessage(
                error?.response?.data?.message ||
                    "Could not fetch your hospital"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchHospital();
        }
    }, [id]);

    // -----------------------------
    // Loading
    // -----------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#d8c8b8] border-t-[#6f4e37] rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-[#6f4e37] font-medium">
                        Loading hospital details...
                    </p>
                </div>
            </div>
        );
    }

    // -----------------------------
    // No Hospital ID
    // -----------------------------
    if (!id) {
        return (
            <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md">
                    <div className="w-16 h-16 bg-[#eee3d7] rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <span className="text-3xl">🏥</span>
                    </div>

                    <h2 className="text-2xl font-bold text-[#4a3426]">
                        Hospital Not Found
                    </h2>

                    <p className="text-[#8a7665] mt-2">
                        Please login again to access your hospital details.
                    </p>
                </div>
            </div>
        );
    }

    // -----------------------------
    // Error
    // -----------------------------
    if (message) {
        return (
            <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md">
                    <div className="w-16 h-16 bg-[#f1e1dc] rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <span className="text-3xl">!</span>
                    </div>

                    <h2 className="text-2xl font-bold text-[#4a3426]">
                        Something went wrong
                    </h2>

                    <p className="text-[#8a7665] mt-2">
                        {message}
                    </p>

                    <button
                        onClick={fetchHospital}
                        className="mt-6 px-6 py-3 bg-[#6f4e37] text-white rounded-xl font-medium hover:bg-[#5c3f2c] transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f3ee] px-4 sm:px-6 lg:px-10 py-8">

            {/* =====================================
                HEADER
            ====================================== */}
            <div className="max-w-7xl mx-auto mb-8">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>
                        <p className="text-sm font-medium text-[#9a806a] mb-1">
                            HOSPITAL MANAGEMENT
                        </p>

                        <h1 className="text-3xl sm:text-4xl font-bold text-[#4a3426]">
                            Your Hospital
                        </h1>

                        <p className="text-[#8a7665] mt-2">
                            View and manage your hospital information.
                        </p>
                    </div>
<button
    onClick={() => addDoctorPage(id)}
    className="
        bg-[#6f4e37]
        text-white
        px-6
        py-3
        rounded-xl
        font-semibold
        text-sm
        tracking-wide
        shadow-md
        hover:bg-[#5c3f2c]
        hover:shadow-lg
        active:scale-95
        transition-all
        duration-200
    "
>
    + ADD DOCTORS
</button>
<button
    onClick={() => hospitalAppointment(id)}
    className="
        bg-[#6f4e37]
        text-white
        px-6
        py-3
        rounded-xl
        font-semibold
        text-sm
        tracking-wide
        shadow-md
        hover:bg-[#5c3f2c]
        hover:shadow-lg
        active:scale-95
        transition-all
        duration-200
    "
>
    View Appointments
</button>
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-[#eadfd4]">
                        <p className="text-xs text-[#9a806a]">
                            Hospital ID
                        </p>

                        <p className="font-semibold text-[#5b4030]">
                            #{id}
                        </p>
                    </div>

                </div>
            </div>

            {/* =====================================
                MAIN CARD
            ====================================== */}
            <div className="max-w-7xl mx-auto">

                <div className="bg-white rounded-[28px] shadow-[0_10px_40px_rgba(91,64,48,0.08)] border border-[#eadfd4] overflow-hidden">

                    {/* =================================
                        TOP BROWN SECTION
                    ================================= */}
                    <div className="bg-[#6f4e37] px-6 sm:px-10 py-8">

                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                            {/* Hospital Icon */}
                            <div className="w-20 h-20 bg-[#f7f3ee] rounded-2xl flex items-center justify-center shadow-sm">
                                <span className="text-4xl">
                                    🏥
                                </span>
                            </div>

                            <div className="text-white">

                                <h2 className="text-2xl sm:text-3xl font-bold">
                                    {hospital?.name || "Hospital"}
                                </h2>

                                <p className="text-[#eadfd4] mt-1">
                                    {hospital?.email || "No email available"}
                                </p>

                            </div>

                        </div>
                    </div>

                    {/* =================================
                        INFORMATION
                    ================================= */}
                    <div className="p-6 sm:p-10">

                        <h3 className="text-xl font-bold text-[#4a3426] mb-6">
                            Hospital Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                            {/* Name */}
                            <div className="bg-[#faf7f3] rounded-2xl p-5 border border-[#eee4da]">
                                <p className="text-sm text-[#9a806a] mb-2">
                                    Hospital Name
                                </p>

                                <p className="font-semibold text-[#4a3426] text-lg">
                                    {hospital?.name || "Not available"}
                                </p>
                            </div>

                            {/* Email */}
                            <div className="bg-[#faf7f3] rounded-2xl p-5 border border-[#eee4da]">
                                <p className="text-sm text-[#9a806a] mb-2">
                                    Email
                                </p>

                                <p className="font-semibold text-[#4a3426] break-all">
                                    {hospital?.email || "Not available"}
                                </p>
                            </div>

                            {/* Phone */}
                            <div className="bg-[#faf7f3] rounded-2xl p-5 border border-[#eee4da]">
                                <p className="text-sm text-[#9a806a] mb-2">
                                    Phone
                                </p>

                                <p className="font-semibold text-[#4a3426]">
                                    {hospital?.phone || "Not available"}
                                </p>
                            </div>

                            {/* Registration Number */}
                            <div className="bg-[#faf7f3] rounded-2xl p-5 border border-[#eee4da]">
                                <p className="text-sm text-[#9a806a] mb-2">
                                    Registration Number
                                </p>

                                <p className="font-semibold text-[#4a3426]">
                                    {hospital?.registrationNumber ||
                                        "Not available"}
                                </p>
                            </div>

                            {/* Beds */}
                            <div className="bg-[#faf7f3] rounded-2xl p-5 border border-[#eee4da]">
                                <p className="text-sm text-[#9a806a] mb-2">
                                    Total Beds
                                </p>

                                <p className="font-semibold text-[#4a3426] text-lg">
                                    {hospital?.beds ?? "Not available"}
                                </p>
                            </div>

                            {/* Location */}
                            <div className="bg-[#faf7f3] rounded-2xl p-5 border border-[#eee4da]">
                                <p className="text-sm text-[#9a806a] mb-2">
                                    Location
                                </p>

                                <p className="font-semibold text-[#4a3426]">
                                    {hospital?.location ||
                                        "Not available"}
                                </p>
                            </div>

                        </div>

                        {/* =================================
                            ADDRESS
                        ================================= */}
                        <div className="mt-5 bg-[#faf7f3] rounded-2xl p-5 border border-[#eee4da]">

                            <p className="text-sm text-[#9a806a] mb-2">
                                Address
                            </p>

                            <p className="font-semibold text-[#4a3426]">
                                {hospital?.address || "Not available"}
                            </p>

                        </div>

                        {/* =================================
                            FOOTER
                        ================================= */}
                        <div className="mt-8 pt-6 border-t border-[#eee4da] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            <div>
                                <p className="text-sm text-[#9a806a]">
                                    Hospital Account
                                </p>

                                <p className="text-[#5b4030] font-medium">
                                    ID: {id}
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-2 bg-[#eee3d7] text-[#6f4e37] px-4 py-2 rounded-full text-sm font-medium w-fit">
                                <span className="w-2 h-2 bg-[#6f4e37] rounded-full"></span>
                                Active Hospital
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Page;
