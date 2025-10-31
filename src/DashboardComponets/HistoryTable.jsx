import React, { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 10;

const HistoryTable = ({ data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset page if data length changes and currentPage is out of bounds
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [data.length, totalPages, currentPage]);

  return (
    <div className="p-6 bg-white rounded-md w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">History</h2>
        <button className="text-[#3F5BF6] bg-blue-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1">
          <span className="text-lg">⚙️</span>{" "}
          {/* Replace with icon if needed */}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
          <thead className="text-gray-500 bg-[#F9FAFB] text-sm font-medium">
            <tr>
              <th className="px-4 py-3">Date</th>

              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item._id || index}
                className="bg-white shadow-sm rounded-md"
              >
                <td className="px-4 py-3 text-gray-800">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-blue-600 font-medium">
                  ${item.amount}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "approved"
                        ? "text-green-600 bg-green-100"
                        : item.status === "rejected"
                        ? "text-red-600 bg-red-100"
                        : "text-yellow-600 bg-yellow-100"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          {/* Left Arrow */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            className="px-2 py-1 text-gray-500 hover:text-black disabled:text-gray-300"
            disabled={currentPage === 1}
          >
            ←
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 text-sm">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, currentPage - 2),
                Math.min(totalPages, currentPage + 3)
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 rounded-md ${
                    page === currentPage
                      ? "bg-[#3F5BF6] text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
            {currentPage + 2 < totalPages && <span>...</span>}
            <button
              onClick={() => goToPage(totalPages)}
              className="w-8 h-8 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              {totalPages}
            </button>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            className="px-2 py-1 text-gray-500 hover:text-black disabled:text-gray-300"
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
