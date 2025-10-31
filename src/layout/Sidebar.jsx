import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdAccountBalance } from "react-icons/md";
import {
  FaTachometerAlt,
  FaSitemap,
  FaUsers,
  FaDollarSign,
  FaWallet,
  FaMoneyCheckAlt,
  FaQuestionCircle,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  { label: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
  { label: "Referral", icon: <FaSitemap />, path: "/referral" },
  { label: "Team", icon: <FaUsers />, path: "/team" },
  { label: "Earnings", icon: <FaDollarSign />, path: "/earnings" },
  { label: "Live Earnings", icon: <FaDollarSign />, path: "/live-earnings" },
  {
    label: "Investment Account",
    icon: <MdAccountBalance />,
    path: "/investment-account",
  },
  {
    label: "Wallet Management",
    icon: <FaWallet />,
    children: [
      { label: "Add Wallet", icon: <FaMoneyCheckAlt />, path: "/wallet/add" },
      {
        label: "Transfer Wallet",
        icon: <FaMoneyCheckAlt />,
        path: "/wallet/transfer",
      },
      {
        label: "Withdrawl Request",
        icon: <FaMoneyCheckAlt />,
        path: "/wallet/withdraw",
      },
      {
        label: "Pending Request",
        icon: <FaMoneyCheckAlt />,
        path: "/wallet/pending",
      },
    ],
  },
  {
    label: "Payout History",
    icon: <FaMoneyCheckAlt />,
    path: "/payout-history",
  },
  {
    label: "Help & Support",
    icon: <FaQuestionCircle />,
    path: "/help-support",
  },
  { label: "Profile Management", icon: <FaUserCog />, path: "/profile" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  const isActive = (path) => location.pathname === path;

  // Auto-open menu if child is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const activeChild = item.children.find((child) => isActive(child.path));
        if (activeChild) {
          setOpenMenus((prev) => ({ ...prev, [item.label]: true }));
        }
      }
    });
  }, [location]);

  const handleLogout = () => {
    // Clear all data from localStorage
    localStorage.clear();

    // Redirect to login page
    navigate("/login");

    // Optional: Show a success message
    alert("You have been logged out successfully");
  };

  return (
    <div className="h-screen w-64 bg-white shadow-md p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="text-3xl p-2 rounded-md font-bold text-center mb-6  bg-[#103b70]">
          <img
            src="https://nextgenefx.com/wp-content/uploads/2025/05/logo2-2.png"
            alt="NextGenEFX Logo"
          />
        </div>
        <ul className="space-y-3">
          {menuItems.map((item, index) => {
            const hasChildren = item.children && item.children.length > 0;
            const isMenuOpen = openMenus[item.label];
            const isParentActive =
              hasChildren &&
              item.children.some((child) => isActive(child.path));

            return (
              <li key={index}>
                {item.path && !hasChildren ? (
                  // Regular menu item
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white "
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-md ">{item.label}</span>
                  </Link>
                ) : (
                  // Parent with submenu
                  <>
                    <div
                      onClick={() =>
                        setOpenMenus((prev) => ({
                          ...prev,
                          [item.label]: !prev[item.label],
                        }))
                      }
                      className={`flex items-center gap-3 px-4 py-2 rounded-md transition duration-200 cursor-pointer ${
                        isParentActive
                          ? "bg-[#4361EE] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>

                    {/* Submenu items */}
                    {isMenuOpen && (
                      <ul className="ml-4 mt-1.5 space-y-2  bg-gray-100 rounded-md p-2">
                        {item.children.map((child, idx) => (
                          <li key={idx}>
                            <Link
                              to={child.path}
                              className={`flex gap-2.5  px-4 py-2 rounded-lg text-sm transition duration-150 ${
                                isActive(child.path)
                                  ? "bg-[#4361EE] text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              <span className="text-lg">{child.icon}</span>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="pt-4 mt-auto border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition duration-200"
        >
          <span className="text-xl">
            <FaSignOutAlt />
          </span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
