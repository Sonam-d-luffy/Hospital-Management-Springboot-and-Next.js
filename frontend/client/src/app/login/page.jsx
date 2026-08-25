"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "../context/userContext";
import { userAgent } from "next/server";

const Page = () => {
    const [login, setLogin] = useState(true);
    const [otpStep, setOtpStep] = useState(false);
    const {loginUser} = useUser()
    const [message, setMessage] = useState("");
    const [otp, setOtp] = useState("");

    const [formdata, setFormdata] = useState({
        name: "",
        email: "",
        address: "",
        password: ""
    });

    const handleState = (e) => {
        setFormdata((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const router = useRouter()
   

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/users/login`;

            const res = await axios.post(url, null , {
                params:{email: formdata.email,
                password: formdata.password}
            });
            loginUser(res?.data)
            setMessage(
                res?.data?.message || "Login successful"
            );
            router.push('/')
        } catch (error) {
            setMessage(
                error?.response?.data?.message ||
                "Something went wrong"
            );
        }
    };


    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const url =
                `${process.env.NEXT_PUBLIC_API_URL}/otp/send`;

            const res = await axios.post(url,null, {
                params : {email: formdata.email}
            });

            setMessage(
                res?.data?.message ||
                "OTP sent successfully"
            );

            setOtpStep(true);

        } catch (error) {
             console.log("OTP ERROR:", error);
    console.log("STATUS:", error?.response?.status);
    console.log("DATA:", error?.response?.data);
    console.log("URL:", error?.config?.url);
            setMessage(
                error?.response?.data?.message ||
                "Unable to send OTP"
            );
        }
    };



    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const url =
                `${process.env.NEXT_PUBLIC_API_URL}/otp/verify`;

            const res = await axios.post(url,null, {
                params: {email: formdata.email,
                otp: otp}
            });

            setMessage(
                res?.data?.message ||
                "Email verified successfully"
            );

            const registerUrl =
                `${process.env.NEXT_PUBLIC_API_URL}/users/register`;

            await axios.post(registerUrl, formdata);

            setMessage("Registration successful. You can now login.");

            setOtpStep(false);

            setLogin(true);

            setOtp("");

            setFormdata({
                name: "",
                email: formdata.email,
                address: "",
                password: ""
            });

        } catch (error) {
            setMessage(
                error?.response?.data?.message ||
                "Invalid or expired OTP"
            );
        }
    };


    const handleResendOtp = async () => {
        setMessage("");

        try {
            const url =
                `${process.env.NEXT_PUBLIC_API_URL}/otp/resend`;

            const res = await axios.post(url, {
                email: formdata.email
            });

            setMessage(
                res?.data?.message ||
                "OTP sent again"
            );

        } catch (error) {
            setMessage(
                error?.response?.data?.message ||
                "Unable to resend OTP"
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center px-4">

            {/* =========================================
                MAIN CARD
            ========================================== */}

            <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">

                {/* =========================================
                    LEFT BROWN SECTION
                ========================================== */}

                <div className="hidden md:flex md:w-[45%] bg-[#5a3a29] text-white relative overflow-hidden">

                    <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#704b36] opacity-50" />

                    <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-[#3f291d] opacity-60" />

                    <div className="relative z-10 flex flex-col justify-center px-12">

                        <p className="uppercase tracking-[5px] text-sm text-[#dfc8b8] mb-5">
                            Welcome
                        </p>

                        <h1 className="text-5xl font-serif font-bold leading-tight">
                            {login ? "Welcome Back" : "Join Us"}
                        </h1>

                        <p className="mt-6 text-[#e6d9d0] leading-7 max-w-sm">
                            {login
                                ? "Sign in to continue your journey. We are happy to have you back."
                                : "Create your account and become a part of our growing community."
                            }
                        </p>

                        <div className="mt-10 w-16 h-[2px] bg-[#d8b9a3]" />

                    </div>
                </div>

                {/* =========================================
                    RIGHT SECTION
                ========================================== */}

                <div className="w-full md:w-[55%] flex items-center justify-center px-6 sm:px-12 py-12">

                    <div className="w-full max-w-md">

                        {/* =====================================
                            OTP STEP
                        ===================================== */}

                        {otpStep ? (

                            <div className="animate-[fadeIn_0.3s_ease-in-out]">

                                <div className="text-center mb-8">

                                    <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-[#f4ebe4] flex items-center justify-center">

                                        <span className="text-2xl text-[#5a3a29]">
                                            ✉
                                        </span>

                                    </div>

                                    <h2 className="text-3xl font-serif font-bold text-[#4a3022]">
                                        Verify Email
                                    </h2>

                                    <p className="mt-3 text-sm text-[#8b7567] leading-6">
                                        We have sent a verification code to
                                    </p>

                                    <p className="font-semibold text-[#5a3a29] mt-1">
                                        {formdata.email}
                                    </p>

                                </div>

                                <form
                                    onSubmit={handleVerifyOtp}
                                    className="space-y-5"
                                >

                                    <div>

                                        <label className="block text-sm font-medium text-[#5a4032] mb-2">
                                            Enter OTP
                                        </label>

                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 6)
                                                )
                                            }
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                            required
                                            className="w-full px-4 py-3.5 rounded-xl border border-[#dfd2c8] bg-[#fcfaf8] text-[#3d2a20] text-center tracking-[8px] text-lg font-semibold outline-none transition focus:border-[#76503b] focus:ring-2 focus:ring-[#76503b]/10"
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3.5 rounded-xl bg-[#5a3a29] text-white font-medium tracking-wide hover:bg-[#472d21] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-[#5a3a29]/20"
                                    >
                                        Verify OTP
                                    </button>

                                </form>

                                {/* Resend */}

                                <div className="text-center mt-6">

                                    <span className="text-sm text-[#8b7567]">
                                        Didn't receive the code?
                                    </span>

                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="ml-2 text-sm font-semibold text-[#5a3a29] hover:text-[#8b5e43] transition"
                                    >
                                        Resend OTP
                                    </button>

                                </div>

                                {/* Back */}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtpStep(false);
                                        setOtp("");
                                        setMessage("");
                                    }}
                                    className="block mx-auto mt-6 text-sm text-[#8b7567] hover:text-[#4a3022] transition"
                                >
                                    ← Back to registration
                                </button>

                                {message && (
                                    <p className="text-center text-sm text-[#76503b] font-medium mt-6">
                                        {message}
                                    </p>
                                )}

                            </div>

                        ) : (

                            /* =====================================
                               LOGIN / REGISTER FORM
                            ===================================== */

                            <>

                                {/* Header */}

                                <div className="text-center mb-8">

                                    <h2 className="text-3xl font-serif font-bold text-[#4a3022]">
                                        {login
                                            ? "Login"
                                            : "Create Account"
                                        }
                                    </h2>

                                    <p className="mt-2 text-sm text-[#8b7567]">
                                        {login
                                            ? "Enter your details to access your account"
                                            : "Fill in your details to get started"
                                        }
                                    </p>

                                </div>

                                {/* Form */}

                                <form
                                    onSubmit={
                                        login
                                            ? handleLogin
                                            : handleSendOtp
                                    }
                                    className="space-y-5"
                                >

                                    {/* Name */}

                                    {!login && (
                                        <>
                                            <div>

                                                <label className="block text-sm font-medium text-[#5a4032] mb-2">
                                                    Full Name
                                                </label>

                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formdata.name}
                                                    onChange={handleState}
                                                    placeholder="Enter your name"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-[#dfd2c8] bg-[#fcfaf8] text-[#3d2a20] outline-none transition focus:border-[#76503b] focus:ring-2 focus:ring-[#76503b]/10"
                                                />

                                            </div>

                                            <div>

                                                <label className="block text-sm font-medium text-[#5a4032] mb-2">
                                                    Address
                                                </label>

                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formdata.address}
                                                    onChange={handleState}
                                                    placeholder="Enter your address"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-[#dfd2c8] bg-[#fcfaf8] text-[#3d2a20] outline-none transition focus:border-[#76503b] focus:ring-2 focus:ring-[#76503b]/10"
                                                />

                                            </div>
                                        </>
                                    )}

                                    {/* Email */}

                                    <div>

                                        <label className="block text-sm font-medium text-[#5a4032] mb-2">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formdata.email}
                                            onChange={handleState}
                                            placeholder="you@example.com"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-[#dfd2c8] bg-[#fcfaf8] text-[#3d2a20] outline-none transition focus:border-[#76503b] focus:ring-2 focus:ring-[#76503b]/10"
                                        />

                                    </div>

                                    {/* Password */}

                                    <div>

                                        <label className="block text-sm font-medium text-[#5a4032] mb-2">
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            value={formdata.password}
                                            onChange={handleState}
                                            placeholder="••••••••"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-[#dfd2c8] bg-[#fcfaf8] text-[#3d2a20] outline-none transition focus:border-[#76503b] focus:ring-2 focus:ring-[#76503b]/10"
                                        />

                                    </div>

                                    {/* Forgot Password */}

                                    {login && (
                                        <div className="flex justify-end">

                                            <button
                                                type="button"
                                                className="text-sm text-[#76503b] hover:text-[#4a3022] transition"
                                            >
                                                Forgot password?
                                            </button>

                                        </div>
                                    )}

                                    {/* Submit */}

                                    <button
                                        type="submit"
                                        className="w-full py-3.5 rounded-xl bg-[#5a3a29] text-white font-medium tracking-wide hover:bg-[#472d21] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-[#5a3a29]/20"
                                    >
                                        {login
                                            ? "Login"
                                            : "Send OTP"
                                        }
                                    </button>

                                    {/* Message */}

                                    {message && (
                                        <p className="text-center text-sm text-[#76503b] font-medium">
                                            {message}
                                        </p>
                                    )}

                                </form>

                                {/* Toggle */}

                                <div className="mt-8 text-center">

                                    <span className="text-sm text-[#8b7567]">
                                        {login
                                            ? "Don't have an account? "
                                            : "Already have an account? "
                                        }
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLogin(!login);
                                            setMessage("");
                                        }}
                                        className="text-sm font-semibold text-[#5a3a29] hover:text-[#8b5e43] transition"
                                    >
                                        {login
                                            ? "Register"
                                            : "Login"
                                        }
                                    </button>

                                </div>

                            </>
                        )}

                    </div>
                </div>

            </div>

        </div>
    );
};

export default Page;
