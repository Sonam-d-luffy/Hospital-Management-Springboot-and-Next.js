"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    registrationNumber: "",
    beds: "",
    phone: ""
  });

  const [otp, setOtp] = useState("");
  const [image, setImage] = useState();
  const [message, setMessage] = useState("");

  const [otpStep, setOtpStep] = useState(false);

  const router = useRouter();

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFormdata = (e) => {
    setFormdata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setMessage("");

  //   try {
  //     const url = `${process.env.NEXT_PUBLIC_API_URL}/hospital/login`;

  //     const res = await axios.post(url, null, {
  //       params: {
  //         email: formdata.email,
  //         password: formdata.password
  //       }
  //     });

  //     setMessage(
  //       res?.data?.message || "Login successful"
  //     );

  //     router.push("/");
  //   } catch (error) {
  //     setMessage(
  //       error?.response?.data?.message ||
  //       "Something went wrong"
  //     );
  //   }
  // };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url =
        `${process.env.NEXT_PUBLIC_API_URL}/otp/send`;

      const res = await axios.post(url, null, {
        params: {
          email: formdata.email
        }
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

      const res = await axios.post(url, null, {
        params: {
          email: formdata.email,
          otp: otp
        }
      });

      setMessage(
        res?.data?.message ||
        "Email verified successfully"
      );

      const registerUrl =
        `${process.env.NEXT_PUBLIC_API_URL}/hospital/create`;
        const data = new FormData()
data.append("name", formdata.name); 
data.append("email", formdata.email);
 data.append("password", formdata.password); 
 data.append("address", formdata.address); 
 data.append( "registrationNumber", formdata.registrationNumber );
  data.append("beds", formdata.beds);
   data.append("phone", formdata.phone); 
   data.append("image", image); 
      await axios.post(registerUrl ,data);

      setMessage(
        "Registration successful. You can now login."
      );

      setOtpStep(false);


      setOtp("");

      setFormdata({
        name: "",
        email: formdata.email,
        address: "",
        password: "",
        registrationNumber: "",
        beds: ""
      });

      alert("Hospital uploaded successfully");

      router.push("/");

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

      const res = await axios.post(url,null, {
       params:{ email: formdata.email}
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
    <main className="min-h-screen bg-[#f5f1eb] text-[#3b2a1f] px-4 py-8 md:px-8">

      {/* Main Container */}
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[#ded2c5] bg-[#fffdf9] shadow-[0_20px_70px_rgba(74,48,31,0.10)]">

        {/* ================= OTP SECTION ================= */}
        {otpStep && (
          <section className="relative overflow-hidden border-b border-[#ded2c5] bg-[#faf7f2]">

            {/* Soft background shapes */}
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#e8d9c9] opacity-40" />
            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#eee4d9] opacity-50" />

            <div className="relative grid min-h-[380px] grid-cols-1 items-center gap-10 px-7 py-12 md:grid-cols-2 md:px-16">

              {/* Left */}
              <div className="max-w-md">

                <div className="mb-6 inline-flex items-center rounded-full bg-[#eadbc9] px-4 py-2 text-xs font-semibold tracking-[0.15em] text-[#714522]">
                  STEP 2 OF 2
                </div>

                <h1 className="font-serif text-4xl leading-tight text-[#3e2b20] md:text-5xl">
                  Verify your email
                </h1>

                <p className="mt-5 text-[15px] leading-7 text-[#76675d]">
                  We have sent a verification code to your email
                  address. Enter the code to complete your
                  registration.
                </p>

                <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8ddd0]">
                  <svg
                    className="h-6 w-6 text-[#70431f]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                      d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <p className="mt-5 text-sm leading-6 text-[#76675d]">
                  Check your inbox and enter the code on the
                  right to continue.
                </p>
              </div>

              {/* OTP Card */}
              <div className="rounded-2xl border border-[#e4d9cd] bg-white p-7 shadow-[0_12px_35px_rgba(74,48,31,0.07)] md:p-9">

                <p className="text-sm font-medium text-[#8a7667]">
                  Verification code
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-[#3e2b20]">
                  Enter OTP
                </h2>

                <p className="mt-2 text-sm text-[#8a7a70]">
                  Code sent to{" "}
                  <span className="font-medium text-[#67401f]">
                    {formdata.email}
                  </span>
                </p>

                <form onSubmit={handleVerifyOtp}>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="••••••"
                    className="mt-7 w-full rounded-xl border border-[#d9c9b9] bg-[#fdfbf8] px-5 py-4 text-center text-2xl font-semibold tracking-[0.5em] text-[#4b3020] outline-none transition focus:border-[#81532e] focus:ring-4 focus:ring-[#eadbca]"
                  />

                  <button
                    type="submit"
                    className="mt-5 w-full rounded-xl bg-[#71421f] py-3.5 text-sm font-semibold text-white transition hover:bg-[#5c351a] active:scale-[0.99]"
                  >
                    Verify OTP
                  </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#e5dbd1]" />
                  <span className="text-xs text-[#a08e81]">
                    or
                  </span>
                  <div className="h-px flex-1 bg-[#e5dbd1]" />
                </div>

                <div className="text-center text-sm text-[#807166]">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-semibold text-[#70421f] hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ================= REGISTRATION SECTION ================= */}
        {!otpStep && (
          <section className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr]">

            {/* Form */}
            <div className="px-6 py-10 md:px-12 md:py-14">

              <div className="mb-9">

                <div className="mb-4 inline-flex items-center rounded-full bg-[#eadbc9] px-4 py-2 text-xs font-semibold tracking-[0.15em] text-[#714522]">
                  STEP 1 OF 2
                </div>

                <h1 className="font-serif text-4xl text-[#3e2b20] md:text-5xl">
                  Register your hospital
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#827269]">
                  Provide the details below to create your
                  hospital account and get started.
                </p>
              </div>

              <form
                onSubmit={handleSendOtp}
                className="space-y-5"
              >

                {/* Row 1 */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#514137]">
                      Hospital Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formdata.name}
                      onChange={handleFormdata}
                      placeholder="Enter hospital name"
                      required
                      className="w-full rounded-xl border border-[#ded2c7] bg-[#fffdfa] px-4 py-3.5 text-sm text-[#3f3027] outline-none transition placeholder:text-[#b0a298] focus:border-[#82532f] focus:ring-4 focus:ring-[#eee1d4]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#514137]">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formdata.email}
                      onChange={handleFormdata}
                      placeholder="hospital@example.com"
                      required
                      className="w-full rounded-xl border border-[#ded2c7] bg-[#fffdfa] px-4 py-3.5 text-sm text-[#3f3027] outline-none transition placeholder:text-[#b0a298] focus:border-[#82532f] focus:ring-4 focus:ring-[#eee1d4]"
                    />
                  </div>

                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#514137]">
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={formdata.password}
                      onChange={handleFormdata}
                      placeholder="Create a password"
                      required
                      className="w-full rounded-xl border border-[#ded2c7] bg-[#fffdfa] px-4 py-3.5 text-sm text-[#3f3027] outline-none transition placeholder:text-[#b0a298] focus:border-[#82532f] focus:ring-4 focus:ring-[#eee1d4]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#514137]">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formdata.phone}
                      onChange={handleFormdata}
                      placeholder="Enter phone number"
                      required
                      className="w-full rounded-xl border border-[#ded2c7] bg-[#fffdfa] px-4 py-3.5 text-sm text-[#3f3027] outline-none transition placeholder:text-[#b0a298] focus:border-[#82532f] focus:ring-4 focus:ring-[#eee1d4]"
                    />
                  </div>

                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#514137]">
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={formdata.address}
                    onChange={handleFormdata}
                    placeholder="Enter hospital address"
                    required
                    className="w-full rounded-xl border border-[#ded2c7] bg-[#fffdfa] px-4 py-3.5 text-sm text-[#3f3027] outline-none transition placeholder:text-[#b0a298] focus:border-[#82532f] focus:ring-4 focus:ring-[#eee1d4]"
                  />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#514137]">
                      Registration Number
                    </label>

                    <input
                      type="text"
                      name="registrationNumber"
                      value={formdata.registrationNumber}
                      onChange={handleFormdata}
                      placeholder="Enter registration number"
                      required
                      className="w-full rounded-xl border border-[#ded2c7] bg-[#fffdfa] px-4 py-3.5 text-sm text-[#3f3027] outline-none transition placeholder:text-[#b0a298] focus:border-[#82532f] focus:ring-4 focus:ring-[#eee1d4]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#514137]">
                      Number of Beds
                    </label>

                    <input
                      type="number"
                      name="beds"
                      value={formdata.beds}
                      onChange={handleFormdata}
                      placeholder="Enter number of beds"
                      required
                      className="w-full rounded-xl border border-[#ded2c7] bg-[#fffdfa] px-4 py-3.5 text-sm text-[#3f3027] outline-none transition placeholder:text-[#b0a298] focus:border-[#82532f] focus:ring-4 focus:ring-[#eee1d4]"
                    />
                  </div>

                </div>

                {/* Image */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#514137]">
                    Hospital Image
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-[#cdbba9] bg-[#fcfaf7] px-4 py-3.5 transition hover:border-[#82532f] hover:bg-[#f9f4ee]">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eadfd3] text-[#70421f]">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.7"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[#514137]">
                          {image
                            ? image.name
                            : "Choose an image"}
                        </p>

                        <p className="text-xs text-[#a09186]">
                          PNG, JPG or JPEG
                        </p>
                      </div>

                    </div>

                    <span className="rounded-lg border border-[#cbb9a7] px-3 py-2 text-xs font-semibold text-[#70421f]">
                      Browse
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="hidden"
                    />

                  </label>
                </div>

                {/* Message */}
                {message && (
                  <div className="rounded-xl border border-[#e3d5c8] bg-[#faf5ef] px-4 py-3 text-sm text-[#70421f]">
                    {typeof message === "string"
                      ? message
                      : "Something went wrong"}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="group mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-[#71421f] py-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(113,66,31,0.18)] transition hover:bg-[#5c351a] hover:shadow-[0_10px_25px_rgba(113,66,31,0.24)] active:scale-[0.99]"
                >
                  Send OTP

                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M5 12h14m-6-6l6 6-6 6"
                    />
                  </svg>
                </button>

              </form>
            </div>

            {/* Right Visual Panel */}
            <div className="relative hidden min-h-[700px] overflow-hidden bg-[#6d4225] lg:block">

              {/* Decorative background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.18),transparent_40%)]" />

              <div className="relative flex h-full flex-col justify-between p-10">

                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">

                    <svg
                      className="h-6 w-6 text-[#f7eee5]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 21s8-4.5 8-10V5l-8-3-8 3v6c0 5.5 8 10 8 10z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 12l2 2 4-4"
                      />
                    </svg>

                  </div>
                </div>

                <div className="max-w-sm">

                  <p className="font-serif text-3xl leading-snug text-[#fffaf4]">
                    Better care begins with
                    better healthcare.
                  </p>

                  <div className="my-6 h-px w-12 bg-[#e8d8c7]" />

                  <p className="text-sm leading-7 text-[#e4d3c2]">
                    Join a growing network of healthcare
                    providers working towards simpler,
                    more connected patient care.
                  </p>

                </div>

                <div className="text-xs tracking-[0.18em] text-[#cdb9a5]">
                  HEALTHCARE • TRUST • CARE
                </div>

              </div>
            </div>

          </section>
        )}

      </div>

      {/* Bottom */}
      <p className="mt-6 text-center text-xs text-[#948277]">
        By continuing, you agree to provide accurate
        hospital information.
      </p>

    </main>
  );
};

export default Page;
