"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { userAgent } from "next/server";
import { useUser } from "@/app/context/userContext";

const Page = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const {user} = useUser()
  const [appointment, setAppointment] = useState({
    date: "",
    time: "",
    symptoms: "",
  });

  const [booking, setBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  const { id } = useParams();
  const router = useRouter();

  // ================= GET DOCTOR =================

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors/doctor/${id}`
      );

      setDoctor(response.data);

    } catch (error) {
      console.error("Doctor details error:", error);

      setMessage(
        error?.response?.data?.message ||
          "Unable to load doctor details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDoctor();
    }
  }, [id]);


  // ================= APPOINTMENT INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ================= BOOK APPOINTMENT =================

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (
      !appointment.date ||
      !appointment.time ||
      !appointment.symptoms.trim()
    ) {
      setBookingMessage(
        "Please select date, time and enter your symptoms."
      );
      return;
    }

    try {
      setBooking(true);
      setBookingMessage("");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/appointment/create`,
        {
          doctorId: doctor.id,
          hospitalId: doctor.hospital?.id,
          date: appointment.date,
          time: appointment.time,
          symptoms: appointment.symptoms,
        },{params: {
      userId: user.id,
      doctorId: doctor.id,
      date: appointment.date,
          time: appointment.time,
          symptoms: appointment.symptoms,
    }}
      );

      setBookingMessage(
        "Appointment booked successfully!"
      );
      alert("Appointment booked")
      setAppointment({
        date: "",
        time: "",
        symptoms: "",
      });
  router.push(`/userAppointments/${user.id}`)
    } catch (error) {
      console.error("Appointment error:", error);

      setBookingMessage(
        error?.response?.data?.message ||
          "Unable to book appointment."
      );

    } finally {
      setBooking(false);
    }
  };


  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="text-[#6B4428] text-lg font-medium">
          Loading doctor details...
        </div>
      </div>
    );
  }


  // ================= ERROR =================

  if (message || !doctor) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-4">
            👨‍⚕️
          </div>

          <h2 className="text-xl font-semibold text-[#3B2920]">
            Doctor Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            {message || "Unable to find this doctor."}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-5 bg-[#6B4428] text-white px-5 py-2.5 rounded-lg hover:bg-[#51321F]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F8F5F0]">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-white border-b border-[#E8DED5]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1 className="text-2xl font-bold text-[#3B2920]">
            MediCare
          </h1>

          <button
            onClick={() => router.back()}
            className="text-sm text-[#6B4428] hover:underline"
          >
            ← Back
          </button>

        </div>
      </nav>


      {/* ================= MAIN ================= */}

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* ================= DOCTOR DETAILS ================= */}

        <section className="bg-white rounded-2xl border border-[#E8DED5] shadow-sm overflow-hidden">

          <div className="p-7">

            <div className="flex flex-col sm:flex-row justify-between gap-6">

              {/* Doctor Information */}

              <div className="flex items-start gap-5">

                {/* Doctor Image */}

                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#E8D8C9] flex-shrink-0">

                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      👨‍⚕️
                    </div>
                  )}

                </div>


                {/* Name */}

                <div>

                  <p className="text-sm text-[#A66A3F] font-medium">
                    Doctor
                  </p>

                  <h2 className="text-3xl font-bold text-[#3B2920] mt-1">
                    Dr. {doctor.name}
                  </h2>

                  <p className="text-[#A66A3F] font-medium mt-2">
                    {doctor.specialization ||
                      "Medical Specialist"}
                  </p>

                </div>

              </div>

            </div>


            {/* ================= DOCTOR DETAILS GRID ================= */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">

              <div className="bg-[#F8F5F0] rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Specialization
                </p>

                <p className="font-medium text-[#3B2920] mt-1">
                  {doctor.specialization ||
                    "Medical Specialist"}
                </p>
              </div>


              <div className="bg-[#F8F5F0] rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Experience
                </p>

                <p className="font-medium text-[#3B2920] mt-1">
                  {doctor.experience
                    ? `${doctor.experience} years`
                    : "Not specified"}
                </p>
              </div>


              <div className="bg-[#F8F5F0] rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Phone
                </p>

                <p className="font-medium text-[#3B2920] mt-1">
                  {doctor.phone || "Not available"}
                </p>
              </div>


              <div className="bg-[#F8F5F0] rounded-xl p-4 sm:col-span-2 lg:col-span-3">
                <p className="text-xs text-gray-500">
                  Email
                </p>

                <p className="font-medium text-[#3B2920] mt-1">
                  {doctor.email || "Not available"}
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* ================= BOOK APPOINTMENT ================= */}

       {/* ================= BOOK APPOINTMENT ================= */}

<section className="bg-white rounded-2xl border border-[#E8DED5] shadow-sm mt-7">

  <div className="p-7">

    {/* Heading */}
    <div>
      <p className="text-sm text-[#6B4428] font-semibold tracking-wide">
        APPOINTMENT
      </p>

      <h2 className="text-2xl font-bold text-[#3B2920] mt-1">
        Book an Appointment
      </h2>

      <p className="text-[#5C4638] text-sm mt-2">
        Choose a convenient date and time and tell the doctor
        about your symptoms.
      </p>
    </div>


    {/* Form */}
    <form
      onSubmit={handleBookAppointment}
      className="mt-7"
    >

      {/* ================= DATE + TIME ================= */}

      <div className="grid md:grid-cols-2 gap-5">

        {/* DATE */}

        <div>
          <label className="block text-sm font-semibold text-[#3B2920] mb-2">
            Appointment Date
          </label>

          <input
            type="date"
            name="date"
            value={appointment.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            required
            className="
              w-full
              border border-[#CDBBAA]
              rounded-xl
              px-4 py-3
              text-[#3B2920]
              bg-white
              font-medium
              focus:outline-none
              focus:ring-2
              focus:ring-[#6B4428]
              focus:border-[#6B4428]
            "
          />
        </div>


        {/* TIME */}

        <div>
          <label className="block text-sm font-semibold text-[#3B2920] mb-2">
            Appointment Time
          </label>

          <input
            type="time"
            name="time"
            value={appointment.time}
            onChange={handleChange}
            required
            className="
              w-full
              border border-[#CDBBAA]
              rounded-xl
              px-4 py-3
              text-[#3B2920]
              bg-white
              font-medium
              focus:outline-none
              focus:ring-2
              focus:ring-[#6B4428]
              focus:border-[#6B4428]
            "
          />
        </div>

      </div>


      {/* ================= SYMPTOMS ================= */}

      <div className="mt-5">

        <label className="block text-sm font-semibold text-[#3B2920] mb-2">
          Symptoms
        </label>

        <textarea
          name="symptoms"
          value={appointment.symptoms}
          onChange={handleChange}
          rows={5}
          required
          placeholder="Describe your symptoms or reason for visiting the doctor..."
          className="
            w-full
            border border-[#CDBBAA]
            rounded-xl
            px-4 py-3
            text-[#3B2920]
            placeholder:text-[#806B5D]
            bg-white
            resize-none
            focus:outline-none
            focus:ring-2
            focus:ring-[#6B4428]
            focus:border-[#6B4428]
          "
        />

        <p className="text-xs text-[#6B5548] mt-2">
          Please provide enough information to help the doctor
          understand your reason for the appointment.
        </p>

      </div>


      {/* ================= MESSAGE ================= */}

      {bookingMessage && (
        <div className="mt-5 bg-[#F8F5F0] border border-[#CDBBAA] rounded-xl p-4">

          <p className="text-sm font-medium text-[#3B2920]">
            {bookingMessage}
          </p>

        </div>
      )}


      {/* ================= BOOK BUTTON ================= */}

      <button
        type="submit"
        disabled={booking}
        className="
          w-full
          mt-6
          bg-[#6B4428]
          hover:bg-[#51321F]
          disabled:bg-[#A89484]
          disabled:cursor-not-allowed
          text-white
          py-3.5
          rounded-xl
          font-semibold
          transition
          shadow-sm
        "
      >
        {booking
          ? "Booking Appointment..."
          : "Book Appointment"}
      </button>

    </form>

  </div>

</section>
      </main>


      {/* ================= FOOTER ================= */}

      <footer className="bg-[#3B2920] text-white mt-12">

        <div className="max-w-5xl mx-auto px-6 py-8">

          <div className="flex flex-col sm:flex-row justify-between gap-4">

            <div>
              <h3 className="text-lg font-semibold">
                MediCare
              </h3>

              <p className="text-[#CDBBAA] text-sm mt-1">
                Connecting patients with healthcare closer
                to home.
              </p>
            </div>

            <p className="text-[#CDBBAA] text-sm">
              © 2026 MediCare. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default Page;