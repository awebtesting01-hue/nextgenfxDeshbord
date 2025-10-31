import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { FiMenu } from "react-icons/fi";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white w-64 shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-white shadow md:block hidden">
          <Topbar />
        </div>

        {/* Mobile Topbar */}
        <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white shadow z-20">
          <button onClick={() => setOpen(!open)}>
            <FiMenu className="text-2xl" />
          </button>
          <span className="text-lg font-semibold">Dashboard</span>
        </div>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-4 min-h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
