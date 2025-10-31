import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaCalendarAlt,
  FaSearch,
  FaUsers,
} from "react-icons/fa";
import { teamApi } from "../api/userApi";

const Team = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("Level 1");
  const [currentMainUserLevel, setCurrentMainUserLevel] =
    useState("All Levels");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [teamData, setTeamData] = useState([]);

 
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!user?._id) return; // exit if user ID not found

      try {
        const res = await teamApi.getTeamDetails(user._id);
        if (res && res.data && res.data.team) {
          setTeamData(res.data.team); // store API data in state
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchTeamData();
  }, []);

  // Sample data with levelRelationWithCurrentUser field

  // Filter data based on search term, dates, and level relation
  const filteredData = teamData.filter((item) => {
    const matchesSearch =
      item.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referralId.toLowerCase().includes(searchTerm.toLowerCase());

    const levelNum =
      currentMainUserLevel === "All Levels"
        ? 0
        : parseInt(currentMainUserLevel.split(" ")[1]);

    const matchesLevelRelation =
      currentMainUserLevel === "All Levels"
        ? true
        : item.levelRelationWithCurrentUser === levelNum;

    let matchesDate = true;
    if (fromDate && toDate) {
      // Parse joinDate: "dd/mm/yy - hh:mm AM/PM"
      const [datePart, timePart] = item.joinDate.split(" - ");
      const [day, month, year] = datePart.split("/").map(Number);
      const fullYear = year < 100 ? 2000 + year : year;

      // Parse time part
      let hours = 0;
      let minutes = 0;
      if (timePart) {
        const [time, meridian] = timePart.split(" ");
        [hours, minutes] = time.split(":").map(Number);
        if (meridian === "PM" && hours < 12) hours += 12;
        if (meridian === "AM" && hours === 12) hours = 0;
      }

      const joinDateObj = new Date(fullYear, month - 1, day, hours, minutes);

      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0); // start of day

      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999); // end of day

      matchesDate = joinDateObj >= from && joinDateObj <= to;
    }

    return matchesSearch && matchesLevelRelation && matchesDate;
  });

  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Get level index from selected option for table columns
  const getLevelIndex = () => {
    if (selectedLevel === "All Levels") return -1;
    return parseInt(selectedLevel.split(" ")[1]) - 1;
  };

  const levelIndex = getLevelIndex();

  // Function to filter by level relation
  const filterMainRelationLevel = (level) => {
    setCurrentMainUserLevel(level);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
        <div className="flex items-center mt-2 md:mt-0"></div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        {/* Left side - Search and Level Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search teams, emails, IDs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Level Filter for Table Columns */}
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-300">
            <select
              className="text-sm bg-transparent outline-none"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i + 1} value={`Level ${i + 1}`}>
                  Show Level {i + 1} Data
                </option>
              ))}
              <option value="All Levels">Show All Levels Data</option>
            </select>
          </div>
        </div>

        {/* Right side - Filter Toggle and Date Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filter Toggle Button */}

          {!showFilter && (
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                showFilter
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
              onClick={() => setShowFilter(!showFilter)}
            >
              <FaFilter />
              <span>Date Filters</span>
            </button>
          )}

          {/* Date Filters - Shown when filter is expanded */}
          {showFilter && (
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-md border border-gray-200 absolute top-full right-0 mt-2 z-10 sm:relative sm:top-auto sm:mt-0 sm:shadow-none">
              {/* From Date */}
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" />
                <span className="text-sm">From:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border rounded-lg px-3 py-1 text-sm"
                />
              </div>

              {/* To Date */}
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" />
                <span className="text-sm">To:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border rounded-lg px-3 py-1 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 items-center">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  onClick={() => {
                    setCurrentPage(1); // reset to first page
                    setShowFilter(false);
                  }}
                >
                  Apply
                </button>

                {/* Show Reset button only if fromDate or toDate is set */}
                {(fromDate || toDate) && (
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-400"
                    onClick={() => {
                      setFromDate("");
                      setToDate("");
                      setCurrentPage(1); // reset page
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Level Relation Filter Cards */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Filter by Level Relation:
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((level) => (
            <div
              key={level}
              className={`p-2 rounded-lg text-center cursor-pointer ${
                currentMainUserLevel === `Level ${level}`
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => filterMainRelationLevel(`Level ${level}`)}
            >
              <div className="text-sm font-medium">Level {level}</div>
              <div className="text-xs">
                {
                  teamData.filter(
                    (item) => item.levelRelationWithCurrentUser === level
                  ).length
                }{" "}
                users
              </div>
            </div>
          ))}
          <div
            className={`p-2 rounded-lg text-center cursor-pointer ${
              currentMainUserLevel === "All Levels"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => filterMainRelationLevel("All Levels")}
          >
            <div className="text-sm font-medium">All Levels</div>
            <div className="text-xs">{teamData.length} users</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-xl bg-white border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Team</th>

              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Referral ID</th>

              <th className="px-4 py-3">Level Relation</th>
              <th className="px-4 py-3">IP Address</th>

              {/* Conditional level columns */}
              {selectedLevel === "All Levels" ? (
                [...Array(15)].map((_, i) => (
                  <th key={i} className="px-4 py-3 text-center">
                    L{i + 1}
                  </th>
                ))
              ) : (
                <th className="px-4 py-3 text-center">L{levelIndex + 1}</th>
              )}

              <th className="px-4 py-3">Join Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y divide-gray-200">
            {currentRows.length > 0 ? (
              currentRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={row.image}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{row.team}</td>

                  <td className="px-4 py-3">
                    {row.levelRelationWithCurrentUser > 1
                      ? row.email.replace(
                          /(.{2})(.*)(@.*)/,
                          (_, start, middle, domain) =>
                            start +
                            "*".repeat(Math.min(middle.length, 4)) +
                            domain
                        )
                      : row.email}
                  </td>

                  <td className="px-4 py-3">
                    {row.levelRelationWithCurrentUser > 1
                      ? row.mobile
                        ? row.mobile.replace(
                            /(\d{3})(\d+)(\d{2})/,
                            (_, start, middle, end) =>
                              start +
                              "*".repeat(Math.min(middle.length, 6)) +
                              end
                          )
                        : "N/A"
                      : row.mobile || "N/A"}
                  </td>
                  <td className="px-4 py-3">{row.referralId}</td>

                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Level {row.levelRelationWithCurrentUser}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.ipAddress || "N/A"}</td>

                  {/* Conditional level data */}
                  {selectedLevel === "All Levels" ? (
                    row.levels.map((level, idx) => (
                      <td key={idx} className="px-4 py-3 text-center">
                        {level}
                      </td>
                    ))
                  ) : (
                    <td className="px-4 py-3 text-center">
                      {row.levels[levelIndex]}
                    </td>
                  )}

                  <td className="px-4 py-3">{row.joinDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="15"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <FaUsers className="text-4xl text-gray-300 mb-2" />
                    <p>No users found for {currentMainUserLevel}</p>
                    <p className="text-sm">
                      Try selecting a different level or search term
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstRow + 1} to{" "}
            {Math.min(indexOfLastRow, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-10 h-10 rounded-lg text-sm font-medium ${
                  currentPage === num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
