"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";

const Bg = () => {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="relative min-h-[200vh] overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 h-full w-full object-cover"
      >
        <source src="/hospital-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/45" />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Initial Navbar */}
      <nav
        className={`absolute top-0 left-0 z-30 flex w-full items-center justify-between px-8 py-6 md:px-12
          transition-all duration-500
          ${
            scrolled
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          }
        `}
      >

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Hospital Management System"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Menu Icon */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex flex-col gap-1.5 cursor-pointer"
        >
          <span className="block h-[2px] w-7 bg-white" />
          <span className="block h-[2px] w-7 bg-white" />
          <span className="block h-[2px] w-7 bg-white" />
        </button>

      </nav>

      {/* Scrolled Navbar */}
      <nav
        className={`fixed top-0 left-0 z-50 flex w-full items-center justify-between
          bg-[#8B6F47] px-8 py-4 md:px-12
          transition-all duration-500
          ${
            scrolled
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-full opacity-0"
          }
        `}
      >

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Hospital Management System"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Menu Icon */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex flex-col gap-1.5 cursor-pointer"
        >
          <span className="block h-[2px] w-7 bg-white" />
          <span className="block h-[2px] w-7 bg-white" />
          <span className="block h-[2px] w-7 bg-white" />
        </button>

      </nav>

      {/* Foreground Content */}
      <div className="relative z-10 min-h-screen">

        {/* Hero Section */}
        <section className="flex min-h-screen items-center px-8 md:px-16">

          <div className="max-w-2xl">

            {/* Main Heading */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
              Caring for Life,
              <br />

              <span className="text-[#C5A47E]">
                Healing with Excellence.
              </span>
            </h1>

            {/* Quote */}
            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/90 md:text-xl">
              "Healthcare is not just about treating illness,
              it's about caring for people and creating a healthier tomorrow."
            </p>

            {/* Get Started */}
            <Link
              href="/login"
              className="mt-8 inline-block border border-[#C5A47E] bg-[#C5A47E] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition duration-300 hover:border-white hover:bg-white hover:text-[#8B6F47]"
            >
              Get Started
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
};

export default Bg;
