"use-client"

import { useRouter } from "next/navigation";
import { useUser } from "../context/userContext";

const Sidebar = ({ isOpen, onClose }) => {
    const router = useRouter();
    const {user} = useUser()
    const loginPage = () => {
        router.push('/login')
    }
    const uploadHospitalPage = () => {
      router.push('/uploadHospital')
    }
    const hospitalLoginPage = () => {
      router.push('/hospitalLogin')
    }
    const hospitalNearYouPage = () => {
      router.push('/hospitalNearYou')
    }
    
  return (
    <>
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-500 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 flex h-screen w-80 flex-col
          bg-[#8B6F47]/90 text-white shadow-2xl backdrop-blur-md
          transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 px-8 py-7">

          <div>
            <h2 className="text-xl font-bold tracking-wide">
              HOSPITAL MANAGEMENT
            </h2>

            <p className="mt-1 text-sm text-white/60">
              Your Healthcare Dashboard
            </p>
          </div>

          {/* Close button */}
          <button

            onClick={onClose}
            aria-label="Close menu"
            className="text-3xl font-light text-white transition hover:text-white/60 cursor-pointer"
          >
            ×
          </button>

        </div>

        {/* Menu */}
        <nav className="flex flex-1 flex-col px-5 py-8">
            <button onClick={loginPage} className="group flex items-center px-4 py-4 text-left text-sm font-semibold tracking-wide transition hover:bg-white/10 cursor-pointer">
            <span className="mr-4 h-2 w-2 bg-white/70 group-hover:bg-white " />
            LOGIN
          </button>

          <button onClick={hospitalLoginPage} className="group flex items-center px-4 py-4 text-left text-sm font-semibold tracking-wide transition hover:bg-white/10 cursor-pointer">
            <span className="mr-4 h-2 w-2 bg-white/70 group-hover:bg-white" />
            YOUR HOSPITAL ADMIN
          </button>

          <button onClick={hospitalNearYouPage} className="group flex items-center px-4 py-4 text-left text-sm font-semibold tracking-wide transition hover:bg-white/10 cursor-pointer">
            <span className="mr-4 h-2 w-2 bg-white/70 group-hover:bg-white" />
            NEARBY HOSPITAL
          </button>

          <button className="group flex items-center px-4 py-4 text-left text-sm font-semibold tracking-wide transition hover:bg-white/10 cursor-pointer">
            <span className="mr-4 h-2 w-2 bg-white/70 group-hover:bg-white" />
            ADD ANOTHER ADDRESS
          </button>

          <button onClick={() => router.push(`/userAppointments/${user.id}`)} className="group flex items-center px-4 py-4 text-left text-sm font-semibold tracking-wide transition hover:bg-white/10 cursor-pointer">
            <span className="mr-4 h-2 w-2 bg-white/70 group-hover:bg-white" />
            YOUR APPOINTMENTS
          </button>

          <button onClick={uploadHospitalPage} className="group flex items-center px-4 py-4 text-left text-sm font-semibold tracking-wide transition hover:bg-white/10 cursor-pointer">
            <span className="mr-4 h-2 w-2 bg-white/70 group-hover:bg-white" />
            UPLOAD HOSPITAL
          </button>

        </nav>

        {/* Bottom */}
        <div className="border-t border-white/20 px-8 py-6">
          <p className="text-xs tracking-wider text-white/50">
            HEALTHCARE MANAGEMENT SYSTEM
          </p>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
