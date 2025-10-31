import { FaArrowLeft, FaSun, FaMoon } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Use a flat version of all menu paths including children
const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Referral", path: "/referral" },
  { label: "Team", path: "/team" },
  { label: "Earnings", path: "/earnings" },
  { label: "Add Wallet", path: "/wallet/add" },
  { label: "Transfer Wallet", path: "/wallet/transfer" },
  { label: "Withdrawl Request", path: "/wallet/withdraw" },
  { label: "Wallet Management", path: "/wallet" }, // fallback/default
  { label: "Payout History", path: "/payout-history" },
  { label: "Help & Support", path: "/help-support" },
  { label: "Profile Management", path: "/profile" },
];

const Topbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const [profile, setProfile] = useState(null);

  // Load profile from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setProfile(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    }
  }, []);

  // Match exact or prefix of the path to find best match
  const currentPage =
    menuItems.find((item) => location.pathname.startsWith(item.path))?.label ||
    "Dashboard";

  console.log({ profile });

  return (
    <div className="w-full px-6 py-4 flex justify-between items-center bg-white shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <FaArrowLeft className="text-lg text-gray-600" />
        <h1 className="text-xl font-semibold text-gray-800">{currentPage}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-2">
          <img
            src="https://i.pravatar.cc/32"
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="hidden sm:block font-medium text-gray-800">
            {profile?.display_name || "User"}
          </span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`relative flex items-center w-12 h-6 rounded-full transition duration-300 focus:outline-none ${
            darkMode ? "bg-gray-600" : "bg-yellow-400"
          }`}
        >
          <span
            className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              darkMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
          <span className="absolute left-1.5 text-xs text-white">
            {darkMode ? <FaMoon /> : <FaSun />}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Topbar;
