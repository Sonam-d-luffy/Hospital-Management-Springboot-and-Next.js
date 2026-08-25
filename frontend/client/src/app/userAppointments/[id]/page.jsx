"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchAppointments = async (pageNumber = 0) => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointment/getAppointmentUser/${id}`,
        {
          params: {
            page: pageNumber,
            size: 6,
          },
        }
      );

      setAppointments(response.data.appointments || []);
      setPage(response.data.currentPage || 0);
      setTotalPages(response.data.totalPages || 0);
      setHasNext(response.data.hasNext || false);
      setHasPrevious(response.data.hasPrevious || false);

    } catch (error) {
      console.error("Appointment fetch error:", error);

      setMessage(
        error?.response?.data?.message ||
          "Unable to load your appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAppointments(0);
    }
  }, [id]);


  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <p className="text-[#3B2920] font-medium">
          Loading your appointments...
        </p>
      </div>
    );
  }


  // ================= PAGE =================

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
            className="text-sm font-medium text-[#6B4428] hover:underline"
          >
            ← Back
          </button>

        </div>
      </nav>


      {/* ================= MAIN ================= */}

      <main className="max-w-6xl mx-auto px-6 py-10">

        <div>
          <p className="text-sm font-semibold text-[#6B4428]">
            MY HEALTHCARE
          </p>

          <h2 className="text-3xl font-bold text-[#3B2920] mt-1">
            My Appointments
          </h2>

          <p className="text-[#5C4638] mt-2">
            View and manage your scheduled doctor appointments.
          </p>
        </div>


        {/* ================= ERROR ================= */}

        {message && (
          <div className="mt-6 bg-white border border-red-200 rounded-xl p-5">
            <p className="text-red-700 font-medium">
              {message}
            </p>
          </div>
        )}


        {/* ================= NO APPOINTMENTS ================= */}

        {!message && appointments.length === 0 && (
          <div className="mt-8 bg-white border border-[#E8DED5] rounded-2xl p-10 text-center">

            <div className="text-5xl">
              📅
            </div>

            <h3 className="text-xl font-semibold text-[#3B2920] mt-4">
              No Appointments
            </h3>

            <p className="text-[#5C4638] mt-2">
              You haven't booked any appointments yet.
            </p>

            <button
              onClick={() => router.push("/hospitals")}
              className="mt-5 bg-[#6B4428] hover:bg-[#51321F] text-white px-6 py-3 rounded-xl font-medium"
            >
              Find a Doctor
            </button>

          </div>
        )}


        {/* ================= APPOINTMENTS ================= */}

        {appointments.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">

            {appointments.map((appointment) => (

              <div
                key={appointment.id}
                className="bg-white border border-[#E8DED5] rounded-2xl p-5 hover:shadow-md transition"
              >

                {/* Doctor */}

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-medium text-[#6B4428]">
                      DOCTOR
                    </p>

                    <h3 className="text-lg font-semibold text-[#3B2920] mt-1">
                      Dr. {appointment.doctor?.name || "Doctor"}
                    </h3>

                    <p className="text-sm text-[#6B4428] mt-1">
                      {appointment.doctor?.specialization ||
                        "Medical Specialist"}
                    </p>
                  </div>

                  {/* Doctor Image */}

                  <div className="w-14 h-14 rounded-full overflow-hidden bg-[#E8D8C9]">

                    {appointment.doctor?.image ? (
                      <img
                        src={appointment.doctor.image}
                        alt={appointment.doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        👨‍⚕️
                      </div>
                    )}

                  </div>

                </div>


                {/* Divider */}

                <div className="border-t border-[#E8DED5] my-5" />


                {/* Appointment Details */}

                <div className="space-y-3">

                  <div className="flex justify-between">

                    <span className="text-sm text-[#6B5548]">
                      Date
                    </span>

                    <span className="text-sm font-semibold text-[#3B2920]">
                      {appointment.date || "N/A"}
                    </span>

                  </div>


                  <div className="flex justify-between">

                    <span className="text-sm text-[#6B5548]">
                      Time
                    </span>

                    <span className="text-sm font-semibold text-[#3B2920]">
                      {appointment.time || "N/A"}
                    </span>

                  </div>


                  <div className="flex justify-between items-center">

                    <span className="text-sm text-[#6B5548]">
                      Status
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : appointment.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appointment.status || "PENDING"}
                    </span>

                  </div>

                </div>


                {/* Symptoms */}

                <div className="mt-5 bg-[#F8F5F0] rounded-xl p-4">

                  <p className="text-xs font-semibold text-[#6B4428]">
                    SYMPTOMS
                  </p>

                  <p className="text-sm text-[#3B2920] mt-1">
                    {appointment.symptoms || "No symptoms provided."}
                  </p>

                </div>


                {/* Hospital */}

                {appointment.hospital && (
                  <div className="mt-4">

                    <p className="text-xs text-[#6B5548]">
                      HOSPITAL
                    </p>

                    <p className="text-sm font-semibold text-[#3B2920] mt-1">
                      {appointment.hospital.name}
                    </p>

                  </div>
                )}

              </div>

            ))}

          </div>
        )}


        {/* ================= PAGINATION ================= */}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">

            <button
              disabled={!hasPrevious}
              onClick={() => fetchAppointments(page - 1)}
              className="px-5 py-2.5 rounded-lg border border-[#CDBBAA] text-[#3B2920] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition"
            >
              ← Previous
            </button>

            <span className="text-sm font-medium text-[#3B2920]">
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={!hasNext}
              onClick={() => fetchAppointments(page + 1)}
              className="px-5 py-2.5 rounded-lg border border-[#CDBBAA] text-[#3B2920] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition"
            >
              Next →
            </button>

          </div>
        )}

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="bg-[#3B2920] text-white mt-12">

        <div className="max-w-6xl mx-auto px-6 py-8">

          <div className="flex flex-col md:flex-row justify-between gap-4">

            <div>
              <h3 className="text-lg font-semibold">
                MediCare
              </h3>

              <p className="text-[#CDBBAA] text-sm mt-1">
                Connecting patients with healthcare closer to home.
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