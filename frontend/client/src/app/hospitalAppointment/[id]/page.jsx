"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // =========================
  // FETCH APPOINTMENTS
  // =========================
  const fetchAppointments = async (pageNumber = 0) => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointment/getAppointmentHospital/${id}`,
        {
          params: {
            page: pageNumber,
            size: 6,
          },
        }
      );

      console.log("Appointment response:", res.data);

      setAppointments(res.data.appointments || []);
      setPage(res.data.currentPage || 0);
      setTotalPages(res.data.totalPages || 0);

    } catch (error) {
      console.error("Error fetching appointments:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL FETCH
  // =========================
  useEffect(() => {
    if (id) {
      fetchAppointments(0);
    }
  }, [id]);

  // =========================
  // CHANGE STATUS
  // =========================
  const handleStatusChange = async (
    appointmentId,
    status
  ) => {
    const action =
      status === "CONFIRMED"
        ? "approve"
        : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this appointment?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(appointmentId);
      setMessage("");

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/appointment/update/${appointmentId}/status`,
        null,
        {
          params: {
            status: status,
          },
        }
      );

      // Update UI immediately
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: status,
              }
            : appointment
        )
      );

      if (status === "CONFIRMED") {
        setMessage(
          "Appointment approved successfully"
        );
      } else if (status === "CANCELLED") {
        setMessage(
          "Appointment rejected successfully"
        );
      }

    } catch (error) {
      console.error(
        "Error updating appointment:",
        error
      );

      console.log(
        "Backend error:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to update appointment"
      );

    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // PAGINATION
  // =========================
  const handlePageChange = (newPage) => {
    if (
      newPage < 0 ||
      newPage >= totalPages ||
      loading
    ) {
      return;
    }

    fetchAppointments(newPage);
  };

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700 border-green-300";

      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-300";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700 border-blue-300";

      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] px-6 py-10 text-[#2b1a12]">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-[#2b1a12]">
            Appointment Management
          </h1>

          <p className="text-[#5a463b] mt-2">
            View and manage appointment requests for your hospital.
          </p>

        </div>

        {/* ================= MESSAGE ================= */}

        {message && (
          <div className="mb-6 bg-white border border-[#d5c4b8] rounded-xl px-5 py-4 text-[#3d2b22] font-medium">
            {message}
          </div>
        )}

        {/* ================= STATISTICS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          {/* TOTAL */}

          <div className="bg-white rounded-2xl shadow-sm border border-[#eadfd8] p-5">

            <p className="text-sm text-[#6b5a50]">
              Total
            </p>

            <h2 className="text-3xl font-bold text-[#2b1a12] mt-2">
              {appointments.length}
            </h2>

          </div>

          {/* PENDING */}

          <div className="bg-white rounded-2xl shadow-sm border border-[#eadfd8] p-5">

            <p className="text-sm text-[#6b5a50]">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {
                appointments.filter(
                  (appointment) =>
                    appointment.status === "PENDING"
                ).length
              }
            </h2>

          </div>

          {/* CONFIRMED */}

          <div className="bg-white rounded-2xl shadow-sm border border-[#eadfd8] p-5">

            <p className="text-sm text-[#6b5a50]">
              Confirmed
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {
                appointments.filter(
                  (appointment) =>
                    appointment.status === "CONFIRMED"
                ).length
              }
            </h2>

          </div>

          {/* CANCELLED */}

          <div className="bg-white rounded-2xl shadow-sm border border-[#eadfd8] p-5">

            <p className="text-sm text-[#6b5a50]">
              Cancelled
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {
                appointments.filter(
                  (appointment) =>
                    appointment.status === "CANCELLED"
                ).length
              }
            </h2>

          </div>

        </div>

        {/* ================= APPOINTMENTS ================= */}

        <div className="bg-white rounded-2xl shadow-md border border-[#eadfd8] overflow-hidden">

          {/* SECTION HEADER */}

          <div className="px-6 py-5 border-b border-[#eadfd8]">

            <h2 className="text-xl font-bold text-[#2b1a12]">
              Appointment Requests
            </h2>

          </div>

          {/* ================= LOADING ================= */}

          {loading ? (

            <div className="py-16 text-center">

              <div className="text-4xl mb-4">
                ⏳
              </div>

              <p className="text-[#5a463b] font-medium">
                Loading appointments...
              </p>

            </div>

          ) : appointments.length === 0 ? (

            /* ================= EMPTY ================= */

            <div className="py-16 text-center">

              <div className="text-5xl mb-4">
                📅
              </div>

              <h3 className="text-xl font-bold text-[#2b1a12]">
                No Appointments
              </h3>

              <p className="text-[#6b5a50] mt-2">
                There are currently no appointment requests.
              </p>

            </div>

          ) : (

            /* ================= APPOINTMENT LIST ================= */

            <div className="divide-y divide-[#eadfd8]">

              {appointments.map((appointment) => (

                <div
                  key={appointment.id}
                  className="p-6 hover:bg-[#fcfaf8] transition"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* ================= DETAILS ================= */}

                    <div className="flex-1">

                      {/* ID + STATUS */}

                      <div className="flex flex-wrap items-center gap-3 mb-5">

                        <h3 className="text-xl font-bold text-[#2b1a12]">
                          Appointment #{appointment.id}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(
                            appointment.status
                          )}`}
                        >
                          {appointment.status || "PENDING"}
                        </span>

                      </div>

                      {/* DETAILS GRID */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* PATIENT */}

                        <div>

                          <p className="text-xs text-[#806e63] uppercase font-semibold">
                            Patient
                          </p>

                          <p className="text-[#2b1a12] font-semibold mt-1">

                            {appointment.patient?.name ||
                              appointment.patientName ||
                              "Not provided"}

                          </p>

                        </div>

                        {/* DOCTOR */}

                        <div>

                          <p className="text-xs text-[#806e63] uppercase font-semibold">
                            Doctor
                          </p>

                          <p className="text-[#2b1a12] font-semibold mt-1">

                            {appointment.doctor?.name ||
                              appointment.doctorName ||
                              "Not provided"}

                          </p>

                        </div>

                        {/* DATE */}

                        <div>

                          <p className="text-xs text-[#806e63] uppercase font-semibold">
                            Appointment Date
                          </p>

                          <p className="text-[#3d2b22] mt-1">

                            {appointment.date ||
                              appointment.appointmentDate ||
                              "Not provided"}

                          </p>

                        </div>

                        {/* TIME */}

                        <div>

                          <p className="text-xs text-[#806e63] uppercase font-semibold">
                            Appointment Time
                          </p>

                          <p className="text-[#3d2b22] mt-1">

                            {appointment.time ||
                              appointment.appointmentTime ||
                              "Not provided"}

                          </p>

                        </div>

                        {/* PHONE */}

                        {appointment.patient?.phone && (

                          <div>

                            <p className="text-xs text-[#806e63] uppercase font-semibold">
                              Patient Phone
                            </p>

                            <p className="text-[#3d2b22] mt-1">
                              {appointment.patient.phone}
                            </p>

                          </div>

                        )}

                        {/* EMAIL */}

                        {appointment.patient?.email && (

                          <div>

                            <p className="text-xs text-[#806e63] uppercase font-semibold">
                              Patient Email
                            </p>

                            <p className="text-[#3d2b22] mt-1">
                              {appointment.patient.email}
                            </p>

                          </div>

                        )}

                      </div>

                    </div>

                    {/* ================= ACTIONS ================= */}

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-40">

                      {/* PENDING */}

                      {appointment.status === "PENDING" ||
                      !appointment.status ? (

                        <>

                          {/* APPROVE */}

                          <button
                            type="button"
                            disabled={
                              updatingId === appointment.id
                            }
                            onClick={() =>
                              handleStatusChange(
                                appointment.id,
                                "CONFIRMED"
                              )
                            }
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >

                            {updatingId === appointment.id
                              ? "Updating..."
                              : "✓ Approve"}

                          </button>

                          {/* REJECT */}

                          <button
                            type="button"
                            disabled={
                              updatingId === appointment.id
                            }
                            onClick={() =>
                              handleStatusChange(
                                appointment.id,
                                "CANCELLED"
                              )
                            }
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >

                            {updatingId === appointment.id
                              ? "Updating..."
                              : "✕ Reject"}

                          </button>

                        </>

                      ) : appointment.status === "CONFIRMED" ? (

                        /* CONFIRMED */

                        <div className="w-full text-center bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl font-bold">

                          ✓ Approved

                        </div>

                      ) : appointment.status === "CANCELLED" ? (

                        /* CANCELLED */

                        <div className="w-full text-center bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl font-bold">

                          ✕ Rejected

                        </div>

                      ) : appointment.status === "COMPLETED" ? (

                        /* COMPLETED */

                        <div className="w-full text-center bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-xl font-bold">

                          ✓ Completed

                        </div>

                      ) : null}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ================= PAGINATION ================= */}

        {totalPages > 1 && (

          <div className="flex items-center justify-center gap-4 mt-8">

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={page === 0 || loading}
              onClick={() =>
                handlePageChange(page - 1)
              }
              className="px-5 py-2.5 bg-white border border-[#cdb9aa] text-[#4b2e1f] rounded-xl font-semibold hover:bg-[#f0e8e3] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {/* PAGE */}

            <div className="px-5 py-2.5 bg-[#6B4428] text-white rounded-xl font-semibold">

              Page {page + 1} of {totalPages}

            </div>

            {/* NEXT */}

            <button
              type="button"
              disabled={
                page === totalPages - 1 ||
                loading
              }
              onClick={() =>
                handlePageChange(page + 1)
              }
              className="px-5 py-2.5 bg-white border border-[#cdb9aa] text-[#4b2e1f] rounded-xl font-semibold hover:bg-[#f0e8e3] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default Page;