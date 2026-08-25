"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const HospitalDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [doctors , setDoctors] = useState([]);

  const fetchHospital = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/hospital/details/${id}`
      );


      setHospital(response.data);

    } catch (error) {
      console.error("Hospital details error:", error);

      setMessage(
        error?.response?.data?.message ||
          "Unable to load hospital details."
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchDoctors = async() => {
    try{
          setLoading(true);
      setMessage("");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}/allDoctors`
      );


      setDoctors(response.data);
    }catch (error) {
      console.error("Hospital details error:", error);

      setMessage(
        error?.response?.data?.message ||
          "Unable to load doctors."
      );
    } finally {
      setLoading(false);
    }
  } 
  useEffect(() => {
    if (id) {
      fetchHospital();
      fetchDoctors();
    }
  }, [id]);

  // ---------------- LOADING ----------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0]">

        <nav className="h-20 bg-white border-b border-[#E7DED5] flex items-center px-6 md:px-12">
          <div className="text-2xl font-bold text-[#6B4428]">
            MediCare
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-12">

          <div className="animate-pulse">

            <div className="h-[350px] bg-[#E5DAD0] rounded-3xl" />

            <div className="mt-8 space-y-4">

              <div className="h-8 bg-[#E5DAD0] rounded w-1/3" />

              <div className="h-5 bg-[#E5DAD0] rounded w-2/3" />

              <div className="h-5 bg-[#E5DAD0] rounded w-1/2" />

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ---------------- ERROR ----------------

  if (!hospital) {
    return (
      <div className="min-h-screen bg-[#F8F5F0]">

        <nav className="h-20 bg-white border-b border-[#E7DED5] flex items-center px-6 md:px-12">

          <div className="text-2xl font-bold text-[#6B4428]">
            MediCare
          </div>

        </nav>

        <div className="max-w-3xl mx-auto px-6 py-24 text-center">

          <div className="text-6xl mb-6">
            🏥
          </div>

          <h1 className="text-2xl font-semibold text-[#3B2920]">
            Hospital not found
          </h1>

          <p className="text-gray-500 mt-3">
            {message || "The hospital you're looking for does not exist."}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-7 bg-[#6B4428] hover:bg-[#51321F] text-white px-6 py-3 rounded-xl"
          >
            ← Back to hospitals
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#3B2920]">

      {/* ================= NAVBAR ================= */}

      <nav className="h-20 bg-white border-b border-[#E7DED5] flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">

        <button
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-[#6B4428]"
        >
          MediCare
        </button>

        <div className="hidden md:flex items-center gap-8 text-sm">

          <button
            onClick={() => router.push("/hospitalNearYou")}
            className="text-[#6B4428] font-medium"
          >
            Find Hospitals
          </button>

          <button className="text-gray-600 hover:text-[#6B4428]">
            Appointments
          </button>

          <button className="text-gray-600 hover:text-[#6B4428]">
            My Profile
          </button>

        </div>

        <button
          className="bg-[#6B4428] text-white px-5 py-2.5 rounded-full"
        >
          Profile
        </button>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="max-w-6xl mx-auto px-6 md:px-8 py-10">

        {/* BACK */}

        <button
          onClick={() => router.back()}
          className="text-[#6B4428] font-medium mb-6 hover:underline"
        >
          ← Back to hospitals
        </button>


        {/* ================= HERO CARD ================= */}

        <section className="bg-white rounded-3xl overflow-hidden border border-[#E8DED5] shadow-sm">

          {/* IMAGE */}

          <div className="relative h-[300px] md:h-[420px] bg-[#EDE4DC]">

            <img
              src={hospital.image}
              alt={hospital.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">

              <span className="inline-block bg-white text-[#6B4428] text-sm font-medium px-4 py-2 rounded-full mb-3">
                Healthcare Facility
              </span>

              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {hospital.name}
              </h1>

              <p className="text-white/90 mt-3 flex items-start gap-2 max-w-2xl">
                <span>📍</span>
                {hospital.address}
              </p>

            </div>

          </div>


          {/* ================= BASIC INFO ================= */}

          <div className="p-6 md:p-10">

            <div className="grid md:grid-cols-3 gap-5">

              {/* BEDS */}

              <div className="bg-[#F8F5F0] rounded-2xl p-5">

                <div className="w-11 h-11 bg-[#E8D8C9] rounded-xl flex items-center justify-center text-xl">
                  🛏
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Available Beds
                </p>

                <p className="text-2xl font-bold text-[#6B4428] mt-1">
                  {hospital.beds}
                </p>

              </div>


              {/* PHONE */}

              <div className="bg-[#F8F5F0] rounded-2xl p-5">

                <div className="w-11 h-11 bg-[#E8D8C9] rounded-xl flex items-center justify-center text-xl">
                  📞
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Contact
                </p>

                <p className="font-semibold text-[#6B4428] mt-1 break-all">
                  {hospital.phone || "Not available"}
                </p>

              </div>


              {/* EMAIL */}

              <div className="bg-[#F8F5F0] rounded-2xl p-5">

                <div className="w-11 h-11 bg-[#E8D8C9] rounded-xl flex items-center justify-center text-xl">
                  ✉
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Email
                </p>

                <p className="font-semibold text-[#6B4428] mt-1 break-all">
                  {hospital.email || "Not available"}
                </p>

              </div>

            </div>


            {/* ================= INFORMATION ================= */}

            <div className="grid lg:grid-cols-3 gap-8 mt-10">

              {/* ABOUT */}

              <div className="lg:col-span-2">

                <h2 className="text-2xl font-semibold text-[#3B2920]">
                  About this hospital
                </h2>

                <p className="text-gray-600 leading-7 mt-4">
                  {hospital.name} is a healthcare facility located at{" "}
                  <span className="font-medium text-[#6B4428]">
                    {hospital.address}
                  </span>
                  . Patients can contact the hospital directly for
                  information about available services, beds and
                  appointments.
                </p>


                {/* ADDRESS */}

                <div className="mt-8">

                  <h3 className="text-lg font-semibold">
                    Location
                  </h3>

                  <div className="mt-3 bg-[#F8F5F0] rounded-2xl p-5">

                    <div className="flex gap-4">

                      <div className="w-11 h-11 bg-[#E8D8C9] rounded-xl flex items-center justify-center">
                        📍
                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Hospital Address
                        </p>

                        <p className="font-medium text-[#3B2920] mt-1">
                          {hospital.address}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* ACTIONS */}

              <div>

                <div className="bg-[#6B4428] text-white rounded-2xl p-6">

                  <p className="text-[#E8D7C7] text-sm">
                    Need medical assistance?
                  </p>

                  <h3 className="text-2xl font-semibold mt-2">
                    Contact the hospital
                  </h3>

                  <p className="text-[#E8D7C7] text-sm mt-3 leading-6">
                    Get in touch with the hospital for appointments,
                    emergency information or other healthcare services.
                  </p>

                  {hospital.phone && (

                    <a
                      href={`tel:${hospital.phone}`}
                      className="block text-center mt-6 bg-white text-[#6B4428] hover:bg-[#F8F5F0] py-3 rounded-xl font-semibold transition"
                    >
                      📞 Call Hospital
                    </a>

                  )}

                  {hospital.email && (

                    <a
                      href={`mailto:${hospital.email}`}
                      className="block text-center mt-3 border border-white/40 hover:bg-white/10 py-3 rounded-xl font-medium transition"
                    >
                      ✉ Email Hospital
                    </a>

                  )}

                </div>

              </div>

            </div>


            {/* ================= DOCTORS ================= */}

            <div className="mt-12">

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-[#A66A3F] text-sm font-medium">
                    MEDICAL STAFF
                  </p>

                  <h2 className="text-2xl font-semibold mt-1">
                    Doctors
                  </h2>

                </div>

                <span className="text-gray-500 text-sm">
                  {hospital.doctors?.length || 0} doctors
                </span>

              </div>

{doctors?.length > 0 ? (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

    {doctors.map((doctor) => (
      <div
        key={doctor.id}
        className="border border-[#E8DED5] rounded-xl p-4 bg-white hover:shadow-md transition"
      >

        {/* Doctor Info */}
        <div className="flex items-center gap-3">

          {/* Doctor Image */}
          <div className="w-14 h-14 rounded-full overflow-hidden bg-[#E8D8C9] flex-shrink-0">
            {doctor.image ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                👨‍⚕️
              </div>
            )}
          </div>

          {/* Name + Specialization */}
          <div className="min-w-0">
            <h3 className="font-semibold text-[#3B2920] truncate">
              {doctor.name}
            </h3>

            <p className="text-sm text-[#A66A3F] mt-1">
              {doctor.specialization || "Medical Specialist"}
            </p>
          </div>

        </div>

        {/* Book Appointment Button */}
        <button
          onClick={() => router.push(`/doctorDetails/${doctor.id}`)}
          className="w-full mt-4 bg-[#6B4428] hover:bg-[#51321F] text-white py-2.5 rounded-lg text-sm font-medium transition"
        >
          View details
        </button>

      </div>
    ))}

  </div>
) : (
  <div className="mt-5 bg-[#F8F5F0] rounded-2xl p-8 text-center">

    <div className="text-4xl">
      👨‍⚕️
    </div>

    <p className="text-gray-500 mt-3">
      Doctor information is currently unavailable.
    </p>

  </div>
)}

            </div>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="bg-[#3B2920] text-white mt-16">

        <div className="max-w-6xl mx-auto px-6 py-10">

          <div className="flex flex-col md:flex-row justify-between gap-6">

            <div>

              <h3 className="text-xl font-semibold">
                MediCare
              </h3>

              <p className="text-[#CDBBAA] mt-2 text-sm">
                Connecting patients with healthcare closer to home.
              </p>

            </div>

            <div className="text-sm text-[#CDBBAA]">
              © 2026 MediCare. All rights reserved.
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default HospitalDetails;