"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userContext";

const Page = () => {
  const router = useRouter();

  const { user, loading: userLoading } = useUser();

  const [hospitals, setHospitals] = useState([]);
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // user = saved user location
  // address = manually searched address
  const [searchMode, setSearchMode] = useState("user");

  // --------------------------------------------------
  // FETCH USING USER'S SAVED LOCATION
  // --------------------------------------------------
 
  
  const fetchHospitalsByUser = async (pageNumber = 0) => {
    if (!user?.id) {
      console.log("User ID not available");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      console.log("User:", user);
      console.log("User ID:", user.id);
      console.log("User address:", user.address);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/hospital/nearby/${user.id}`,
        {
          params: {
            page: pageNumber,
            size: 6,
          },
        }
      );

      console.log("Hospital response:", response.data);

      // Spring Page response
      setHospitals(response.data.hospitals || []);
setPage(response.data.currentPage || 0);
setTotalPages(response.data.totalPages || 0);

    } catch (error) {
      console.error("User location hospital error:", error);

      setHospitals([]);
      setTotalPages(0);

      setMessage(
        error?.response?.data?.message ||
          "Unable to find hospitals near your location."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FETCH USING MANUALLY ENTERED ADDRESS
  // --------------------------------------------------

  const fetchHospitalsByAddress = async (
    address,
    pageNumber = 0
  ) => {
    if (!address?.trim()) return;

    try {
      setLoading(true);
      setMessage("");

      console.log("Searching address:", address);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/hospital/nearby`,
        {
          params: {
            address: address.trim(),
            page: pageNumber,
            size: 6,
          },
        }
      );

      console.log("Address hospital response:", response.data);

    setHospitals(response.data.hospitals || []);
setPage(response.data.currentPage || 0);
setTotalPages(response.data.totalPages || 0);

    } catch (error) {
      console.error("Address hospital error:", error);

      setHospitals([]);
      setTotalPages(0);

      setMessage(
        error?.response?.data?.message ||
          "Unable to find hospitals near this address."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // DEFAULT FETCH
  // --------------------------------------------------

  useEffect(() => {
    if (!userLoading && user?.id) {
      setSearchMode("user");
      fetchHospitalsByUser(0);
    }
  }, [user, userLoading]);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const handleSearch = (e) => {
    e.preventDefault();

    const address = input.trim();

    if (!address) {
      setMessage("Please enter an address.");
      return;
    }

    setSearchMode("address");
    setPage(0);

    fetchHospitalsByAddress(address, 0);
  };

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) {
      return;
    }

    if (searchMode === "user") {
      fetchHospitalsByUser(newPage);
    } else {
      fetchHospitalsByAddress(input.trim(), newPage);
    }
  };

  // --------------------------------------------------
  // BACK TO USER LOCATION
  // --------------------------------------------------

  const handleUseMyLocation = () => {
    setInput("");
    setSearchMode("user");
    setPage(0);
    setMessage("");

    fetchHospitalsByUser(0);
  };

  // --------------------------------------------------
  // LOADING USER
  // --------------------------------------------------

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#D8C8BA] border-t-[#6B4428] rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-[#6B4428]">
            Getting your location...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#3B2920]">

      {/* ================= NAVBAR ================= */}

      <nav className="h-20 bg-white border-b border-[#E7DED5] flex items-center justify-between px-6 md:px-12">

        <div className="text-2xl font-bold text-[#6B4428]">
          MediCare
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">

          <button className="text-[#6B4428] font-medium">
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
          {user.name}
        </button>

      </nav>


      {/* ================= HERO ================= */}

      <section className="bg-[#6B4428] text-white px-6 md:px-20 py-16">

        <div className="max-w-6xl mx-auto">

          <p className="text-[#E8D7C7] uppercase tracking-widest text-sm mb-3">
            Healthcare near you
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold max-w-2xl leading-tight">
            Find the right hospital near you
          </h1>

          <p className="text-[#E8D7C7] mt-4 max-w-xl">
            Find hospitals within 50 km of your location or search
            hospitals near another address.
          </p>


          {/* USER LOCATION */}

          {user?.address && searchMode === "user" && (
            <div className="mt-6 flex items-center gap-3">

              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                📍
              </div>

              <div>
                <p className="text-xs text-[#E8D7C7]">
                  Your current location
                </p>

                <p className="font-medium">
                  {user.address}
                </p>
              </div>

            </div>
          )}


          {/* ================= SEARCH ================= */}

          <form
            onSubmit={handleSearch}
            className="mt-8 bg-white rounded-2xl p-2 flex flex-col md:flex-row max-w-3xl shadow-xl"
          >

            <div className="flex-1 flex items-center px-4">

              <span className="text-xl mr-3">
                📍
              </span>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search hospitals near another address..."
                className="w-full py-3 outline-none text-[#3B2920] placeholder-gray-400"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#A66A3F] hover:bg-[#8E5733] text-white px-8 py-3 rounded-xl font-medium transition disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>

          </form>


          {/* SEARCH MODE */}

          <div className="mt-5 flex items-center gap-3 text-sm">

            {searchMode === "user" ? (

              <span className="text-[#E8D7C7]">
                🟢 Showing hospitals near your location
              </span>

            ) : (

              <>
                <span className="text-[#E8D7C7]">
                  📍 Showing hospitals near "{input}"
                </span>

                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="text-white underline hover:text-[#E8D7C7]"
                >
                  Use my location
                </button>
              </>

            )}

          </div>

        </div>

      </section>


      {/* ================= HOSPITALS ================= */}

      <main className="max-w-6xl mx-auto px-6 md:px-8 py-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">

          <div>

            <p className="text-[#A66A3F] font-medium tracking-wide">
              NEARBY HOSPITALS
            </p>

            <h2 className="text-3xl font-semibold mt-1">

              {searchMode === "user"
                ? "Hospitals near you"
                : "Hospitals near searched address"}

            </h2>

          </div>

          {hospitals?.length > 0 && (
            <p className="text-gray-500 mt-3 md:mt-0">
              {hospitals.length} hospitals on this page
            </p>
          )}

        </div>


        {/* ================= MESSAGE ================= */}

        {message && (

          <div className="bg-white border border-[#E8D8CC] rounded-xl p-5 mb-8 text-[#8B4D32]">
            {message}
          </div>

        )}


        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {[1, 2, 3, 4, 5, 6].map((item) => (

              <div
                key={item}
                className="bg-white rounded-2xl overflow-hidden animate-pulse border border-[#E8DED5]"
              >

                <div className="h-48 bg-[#E8DED5]" />

                <div className="p-5 space-y-4">

                  <div className="h-5 bg-[#E8DED5] rounded" />

                  <div className="h-4 bg-[#E8DED5] rounded w-2/3" />

                  <div className="h-4 bg-[#E8DED5] rounded w-1/2" />

                  <div className="h-10 bg-[#E8DED5] rounded-xl" />

                </div>

              </div>

            ))}

          </div>


        ) : hospitals?.length > 0 ? (

          /* ================= HOSPITAL CARDS ================= */

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {hospitals.map((hospital) => (

              <div
                key={hospital.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8DED5] hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >

                {/* IMAGE */}

                <div className="relative h-48 bg-[#EDE4DC]">

                  <img
                    src={hospital.image}
                    alt={hospital.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full text-sm font-medium text-[#6B4428] shadow">
                    Within 50 km
                  </div>

                </div>


                {/* CONTENT */}

                <div className="p-5">

                  <h3 className="text-xl font-semibold text-[#3B2920]">
                    {hospital.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    📍 {hospital.address}
                  </p>


                  {/* DETAILS */}

                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <div className="bg-[#F8F5F0] rounded-xl p-3">

                      <p className="text-xs text-gray-500">
                        Available beds
                      </p>

                      <p className="font-semibold text-[#6B4428] mt-1">
                        🛏 {hospital.beds}
                      </p>

                    </div>


                    <div className="bg-[#F8F5F0] rounded-xl p-3">

                      <p className="text-xs text-gray-500">
                        Phone
                      </p>

                      <p className="font-semibold text-[#6B4428] mt-1 truncate">
                        {hospital.phone || "Not available"}
                      </p>

                    </div>

                  </div>


                  {/* BUTTON */}

                  <button
                    onClick={() => router.push(`/hospitalDetails/${hospital.id}`)}
                    className="w-full mt-5 bg-[#6B4428] hover:bg-[#51321F] text-white py-3 rounded-xl font-medium transition"
                  >
                    View Hospital →
                  </button>

                </div>

              </div>

            ))}

          </div>


        ) : (

          /* ================= NO HOSPITALS ================= */

          <div className="bg-white rounded-2xl border border-[#E8DED5] py-20 text-center">

            <div className="text-5xl mb-5">
              🏥
            </div>

            <h3 className="text-xl font-semibold">
              No hospitals found
            </h3>

            <p className="text-gray-500 mt-2">
              No hospitals were found within 50 km.
            </p>

            {searchMode === "address" && (

              <button
                onClick={handleUseMyLocation}
                className="mt-5 px-5 py-2.5 bg-[#6B4428] text-white rounded-xl"
              >
                Search near my location
              </button>

            )}

          </div>

        )}


        {/* ================= PAGINATION ================= */}

        {totalPages > 1 && (

          <div className="flex justify-center items-center gap-4 mt-10">

            <button
              disabled={page === 0 || loading}
              onClick={() => handlePageChange(page - 1)}
              className="px-5 py-2.5 border border-[#D8C8BA] rounded-xl disabled:opacity-40 hover:bg-white transition"
            >
              ← Previous
            </button>

            <span className="text-gray-600">
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={
                page === totalPages - 1 || loading
              }
              onClick={() => handlePageChange(page + 1)}
              className="px-5 py-2.5 bg-[#6B4428] text-white rounded-xl disabled:opacity-40"
            >
              Next →
            </button>

          </div>

        )}

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

export default Page;