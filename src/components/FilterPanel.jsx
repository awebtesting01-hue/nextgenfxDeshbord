import React, { useState } from "react";
import { FaFilter, FaSearch, FaCalendarAlt } from "react-icons/fa";
import ImgIcon from "../icon/ImgIcon";

const FilterPanel = () => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div className="min-h-[85vh] bg-white rounded-xl p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white rounded-xl px-4 py-2 shadow-sm mb-10">
        {/* Left filters */}
        <div className="flex items-center gap-2">
          <div className="bg-[#3B5AFE] p-2 rounded-full text-white">
            <ImgIcon size={14} />
          </div>

          {/* Team Score Dropdown */}
          <div className="flex items-center gap-1 text-sm bg-[#F4F4F5] rounded-md px-3 py-1 text-gray-800 font-medium">
            <span className="text-gray-400 font-normal">Team Score:</span>
            <select className="bg-transparent outline-none font-semibold">
              <option>Low To High</option>
              <option>High To Low</option>
            </select>
          </div>

          {/* Enabled Dropdown */}
          <select className="text-sm bg-[#F4F4F5] rounded-md px-3 py-1 font-medium text-gray-800 outline-none">
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </div>

        {/* Right filters */}
        <div className="flex items-center gap-2">
          <div
            className="bg-[#F4F4F5] px-3 py-2 rounded-md flex items-center cursor-pointer"
            onClick={() => setShowSearchInput(!showSearchInput)}
          >
            <FaSearch className="text-gray-500 text-sm" />
          </div>

          {showSearchInput && (
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-md text-sm"
            />
          )}

          <select className="text-sm bg-[#F4F4F5] rounded-md px-3 py-1 font-medium text-gray-800 outline-none">
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      {/* Filter Box */}
      <div className="bg-white rounded-2xl shadow-xl w-fit px-6 py-4 space-y-4">
        {/* Top Buttons */}
        <div className="flex gap-3">
          <button className="border border-gray-400 rounded-full px-4 py-1 text-sm font-medium">
            Today
          </button>
          <button className="border border-gray-400 rounded-full px-4 py-1 text-sm font-medium">
            This Week
          </button>
          <button className="border border-gray-400 rounded-full px-4 py-1 text-sm font-medium">
            This Month
          </button>
          <button className="bg-[#FF0000] text-white rounded-full px-4 py-1 text-sm font-medium">
            Clear
          </button>
        </div>

        {/* Date Range Picker */}
        {/* Date Range Picker */}
<div className="flex items-center gap-3">
  {/* From Date */}
  <div className="relative flex items-center border border-gray-300 rounded-full px-3 py-1 text-sm gap-2">
    <span className="font-medium">From:</span>
    <input
      type="date"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      className="bg-transparent outline-none font-semibold text-gray-800 pr-6"
    />
    <FaCalendarAlt className="absolute right-3 text-gray-500 text-sm pointer-events-none" />
  </div>

  {/* To Date */}
  <div className="relative flex items-center border border-gray-300 rounded-full px-3 py-1 text-sm gap-2">
    <span className="font-medium">To:</span>
    <input
      type="date"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      className="bg-transparent outline-none font-semibold text-gray-800 pr-6"
    />
    <FaCalendarAlt className="absolute right-3 text-gray-500 text-sm pointer-events-none" />
  </div>

  {/* Apply Button */}
  <button className="bg-[#3B5AFE] text-white font-semibold px-6 py-1.5 rounded-full text-sm">
    Apply
  </button>
</div>

      </div>
    </div>
  );
};

export default FilterPanel;
