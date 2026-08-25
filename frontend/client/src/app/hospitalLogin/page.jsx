"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useHospital } from "../context/hospitalContext";

const Page = () => {

    const [message, setMessage] = useState("");

    const [formdata, setFormdata] = useState({
        email: "",
        password: ""
    });

    const {loginHospital} = useHospital();
    const handleState = (e) => {
        setFormdata((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const router = useRouter()
   const registerPage = () => {
    router.push('/uploadHospital')
   }

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/hospital/login`;

            const res = await axios.post(url, null , {
                params:{email: formdata.email,
                password: formdata.password}
            });

            setMessage(
                res?.data?.message || "Login successful"
            );
            console.log(res.data)
            loginHospital(res?.data?.id)
            alert('Login successful')
            router.push(`/yourHospital/${res?.data?.id}`)
        } catch (error) {
            setMessage(
                error?.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center px-4">

        <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">

            {/* LEFT BROWN SECTION */}
            <div className="hidden md:flex md:w-[45%] bg-[#5a3a29] text-white relative overflow-hidden">

                <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#704b36] opacity-50" />

                <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-[#3f291d] opacity-60" />

                <div className="relative z-10 flex flex-col justify-center px-12">

                    <p className="uppercase tracking-[5px] text-sm text-[#dfc8b8] mb-5">
                        Welcome
                    </p>

                    <h1 className="text-5xl font-serif font-bold leading-tight">
                        Welcome Back
                    </h1>

                    <p className="mt-6 text-[#e6d9d0] leading-7 max-w-sm">
                        Sign in to continue your journey. We are happy to have you back.
                    </p>

                    <div className="mt-10 w-16 h-[2px] bg-[#d8b9a3]" />

                </div>
            </div>

            {/* RIGHT LOGIN SECTION */}
            <div className="w-full md:w-[55%] flex items-center justify-center px-6 sm:px-12 py-12">

                <div className="w-full max-w-md">

                    {/* HEADER */}
                    <div className="text-center mb-8">

                        <h2 className="text-3xl font-serif font-bold text-[#4a3022]">
                            Login
                        </h2>

                        <p className="mt-2 text-sm text-[#8b7567]">
                            Enter your details to access your account
                        </p>

                    </div>

                    {/* LOGIN FORM */}
                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >

                        {/* EMAIL */}
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

                        {/* PASSWORD */}
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

                        {/* FORGOT PASSWORD */}
                        <div className="flex justify-end">

                            <button
                                type="button"
                                className="text-sm text-[#76503b] hover:text-[#4a3022] transition"
                            >
                                Forgot password?
                            </button>

                        </div>

                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-xl bg-[#5a3a29] text-white font-medium tracking-wide hover:bg-[#472d21] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-[#5a3a29]/20"
                        >
                            Login
                        </button>

                        {/* MESSAGE */}
                        {message && (
                            <p className="text-center text-sm text-[#76503b] font-medium">
                                {message}
                            </p>
                        )}

                    </form>

                    {/* REGISTER LINK */}
                    <div className="mt-8 text-center">

                        <span className="text-sm text-[#8b7567]">
                            Upload your hospital?{" "}
                        </span>

                        <button
                            type="button"
                            onClick={registerPage}
                            className="text-sm font-semibold text-[#5a3a29] hover:text-[#8b5e43] transition"
                        >
                            Register
                        </button>

                    </div>

                </div>
            </div>

        </div>

    </div>
);

};

export default Page;
