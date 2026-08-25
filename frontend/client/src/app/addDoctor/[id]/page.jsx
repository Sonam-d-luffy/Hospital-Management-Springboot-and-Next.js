"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    qualification: "",
    phone: "",
    email: "",
    experience: "",
  });

  // =========================
  // IMAGE HANDLER
  // =========================
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check image type
    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image");
      return;
    }

    // Optional size check - 5MB
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size should be less than 5MB");
      return;
    }

    setImage(file);

    // Create preview
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    setMessage("");
  };

  // =========================
  // FETCH DOCTORS
  // =========================
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}/allDoctors`
      );

      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setMessage("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL FETCH
  // =========================
  useEffect(() => {
    if (id) {
      fetchDoctors();
    }
  }, [id]);

  // =========================
  // FORM HANDLER
  // =========================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // ADD DOCTOR
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage("Please select a doctor image");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("specialization", formData.specialization);
      data.append("qualification", formData.qualification);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("experience", formData.experience);
      data.append("image", image);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors/create/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Doctor added:", res.data);

      setMessage("Doctor added successfully");

      // Reset form
      setFormData({
        name: "",
        specialization: "",
        qualification: "",
        phone: "",
        email: "",
        experience: "",
      });

      setImage(null);
      setPreview("");

      // Refresh doctors
      await fetchDoctors();
    } catch (error) {
      console.error("Error adding doctor:", error);

      if (error.response) {
        console.log("Backend error:", error.response.data);
        setMessage(
          error.response.data?.message || "Failed to add doctor"
        );
      } else {
        setMessage("Failed to add doctor");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE DOCTOR
  // =========================
  const handleDelete = async (doctorId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      setMessage("");

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors/deleteDoctor/${doctorId}`
      );

      setDoctors((prev) =>
        prev.filter((doctor) => doctor.id !== doctorId)
      );

      setMessage("Doctor deleted successfully");
    } catch (error) {
      console.error("Error deleting doctor:", error);
      setMessage("Failed to delete doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] px-6 py-10 text-[#2b1a12]">
      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2b1a12]">
            Doctor Management
          </h1>

          <p className="text-[#4a382f] mt-2">
            Add and manage doctors for this hospital.
          </p>
        </div>

        {/* ================= MESSAGE ================= */}
        {message && (
          <div className="mb-6 bg-white border border-[#cdb9aa] text-[#3d2b22] px-4 py-3 rounded-xl font-medium">
            {message}
          </div>
        )}

        {/* ================= ADD DOCTOR ================= */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">

          <h2 className="text-xl font-bold text-[#2b1a12] mb-6">
            Add New Doctor
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* NAME */}
            <div>
              <label className="block text-sm font-semibold text-[#2b1a12] mb-2">
                Doctor Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. John Doe"
                required
                className="w-full border border-[#b8a69b] bg-white text-[#1f1f1f] placeholder:text-gray-500 rounded-xl px-4 py-3 outline-none focus:border-[#6B4428] focus:ring-1 focus:ring-[#6B4428]"
              />
            </div>

            {/* SPECIALIZATION */}
            <div>
              <label className="block text-sm font-semibold text-[#2b1a12] mb-2">
                Specialization
              </label>

              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Cardiologist"
                required
                className="w-full border border-[#b8a69b] bg-white text-[#1f1f1f] placeholder:text-gray-500 rounded-xl px-4 py-3 outline-none focus:border-[#6B4428] focus:ring-1 focus:ring-[#6B4428]"
              />
            </div>

            {/* QUALIFICATION */}
            <div>
              <label className="block text-sm font-semibold text-[#2b1a12] mb-2">
                Qualification
              </label>

              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="MBBS, MD"
                required
                className="w-full border border-[#b8a69b] bg-white text-[#1f1f1f] placeholder:text-gray-500 rounded-xl px-4 py-3 outline-none focus:border-[#6B4428] focus:ring-1 focus:ring-[#6B4428]"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-semibold text-[#2b1a12] mb-2">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full border border-[#b8a69b] bg-white text-[#1f1f1f] placeholder:text-gray-500 rounded-xl px-4 py-3 outline-none focus:border-[#6B4428] focus:ring-1 focus:ring-[#6B4428]"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-[#2b1a12] mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@example.com"
                className="w-full border border-[#b8a69b] bg-white text-[#1f1f1f] placeholder:text-gray-500 rounded-xl px-4 py-3 outline-none focus:border-[#6B4428] focus:ring-1 focus:ring-[#6B4428]"
              />
            </div>

            {/* EXPERIENCE */}
            <div>
              <label className="block text-sm font-semibold text-[#2b1a12] mb-2">
                Experience (years)
              </label>

              <input
                type="number"
                step="0.5"
                min="0"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="5"
                required
                className="w-full border border-[#b8a69b] bg-white text-[#1f1f1f] placeholder:text-gray-500 rounded-xl px-4 py-3 outline-none focus:border-[#6B4428] focus:ring-1 focus:ring-[#6B4428]"
              />
            </div>

            {/* ================= IMAGE ================= */}
            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-[#2b1a12] mb-2">
                Doctor Image
              </label>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImage}
                className="w-full border border-[#b8a69b] bg-white text-[#1f1f1f] rounded-xl px-4 py-3 outline-none focus:border-[#6B4428] focus:ring-1 focus:ring-[#6B4428]"
              />

              {/* IMAGE PREVIEW */}
              {preview && (
                <div className="mt-4">

                  <p className="text-sm font-semibold text-[#2b1a12] mb-2">
                    Preview
                  </p>

                  <img
                    src={preview}
                    alt="Doctor Preview"
                    className="w-36 h-36 object-cover rounded-xl border border-[#b8a69b]"
                  />

                </div>
              )}

            </div>

            {/* ================= SUBMIT ================= */}
            <div className="md:col-span-2">

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6B4428] hover:bg-[#51321F] text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
              >
                {loading ? "Adding Doctor..." : "Add Doctor"}
              </button>

            </div>

          </form>
        </div>

        {/* ================= DOCTORS ================= */}
        <div>

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl font-bold text-[#2b1a12]">
              Doctors
            </h2>

            <span className="bg-[#e8ddd5] text-[#4b2e1f] px-4 py-2 rounded-full text-sm font-semibold">
              {doctors.length} Doctors
            </span>

          </div>

          {/* LOADING */}
          {loading && doctors.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-8 text-center">

              <p className="text-[#4a382f] font-medium">
                Loading doctors...
              </p>

            </div>

          ) : doctors.length === 0 ? (

            /* EMPTY STATE */
            <div className="bg-white rounded-2xl shadow p-10 text-center">

              <div className="text-5xl mb-4">
                👨‍⚕️
              </div>

              <h3 className="text-xl font-bold text-[#2b1a12]">
                No Doctors Found
              </h3>

              <p className="text-[#4a382f] mt-2">
                Add your first doctor using the form above.
              </p>

            </div>

          ) : (

            /* DOCTOR CARDS */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {doctors.map((doctor) => (

                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#eadfd8]"
                >

                  {/* DOCTOR IMAGE */}
                  <div className="h-48 bg-[#eee5df] flex items-center justify-center">

                    {doctor.image ? (

                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="text-center">

                        <div className="text-5xl mb-2">
                          👨‍⚕️
                        </div>

                        <span className="text-[#6b5a50] text-sm">
                          No Image
                        </span>

                      </div>

                    )}

                  </div>

                  {/* DOCTOR DETAILS */}
                  <div className="p-5">

                    <h3 className="text-xl font-bold text-[#2b1a12]">
                      {doctor.name}
                    </h3>

                    <p className="text-[#6B4428] font-semibold mt-1">
                      {doctor.specialization}
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-[#3d2b22]">

                      <p>
                        <span className="font-bold text-[#2b1a12]">
                          Qualification:
                        </span>{" "}
                        {doctor.qualification || "Not provided"}
                      </p>

                      <p>
                        <span className="font-bold text-[#2b1a12]">
                          Experience:
                        </span>{" "}
                        {doctor.experience} years
                      </p>

                      <p>
                        <span className="font-bold text-[#2b1a12]">
                          Email:
                        </span>{" "}
                        {doctor.email || "Not provided"}
                      </p>

                      <p>
                        <span className="font-bold text-[#2b1a12]">
                          Phone:
                        </span>{" "}
                        {doctor.phone || "Not provided"}
                      </p>

                    </div>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() => handleDelete(doctor.id)}
                      className="w-full mt-5 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition"
                    >
                      Delete Doctor
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default Page;