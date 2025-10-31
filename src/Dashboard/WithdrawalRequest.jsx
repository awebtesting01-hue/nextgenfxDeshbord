import PaymentIcon1 from "../icon/PaymentIcon1";
import PaymentIcon2 from "../icon/PaymentIcon2";
import PaymentIcon3 from "../icon/PaymentIcon3";
import PaymentIcon4 from "../icon/PaymentIcon4";
import HistoryTable from "../DashboardComponets/HistoryTable";
import { referralApi, userApi } from "../api/userApi";
import { useEffect, useState } from "react";
import WithdrawalForm from "./WithdrawalForm";
import { withdrawalRequestApi } from "../api/withdrawl.api";

const ITEMS_PER_PAGE = 5;

const WithdrawalRequest = () => {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [referralEarningL1, setReferralEarningL1] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("accessToken");
    const fetchBonus = async () => {
      try {
        const data = await referralApi.getLevel1BonusSum(user._id);
        console.log("Level 1 total bonus:", data);
        setReferralEarningL1(data.data.totalBonus);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBonus();
  }, []);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = localStorage.getItem("accessToken");
        if (!user?._id || !token) return;

        const data = await userApi.getProfile(
          { id: user._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProfile(data?.data);
        localStorage.setItem("userProfile", JSON.stringify(data?.data));
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch withdrawal history for logged-in user
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const allRequests = await withdrawalRequestApi.getAllWithdrawals();
        console.log({ allRequests });

        if (profile?._id) {
          const userRequests = allRequests.filter(
            (req) => req.userId?._id === profile._id
          );
          setHistory(userRequests);
        }
      } catch (err) {
        console.error("Failed to fetch withdrawal requests:", err);
        setHistory([]);
      }
    };

    if (profile?._id) fetchHistory();
  }, [profile]);

  // Paginated data
  const paginatedHistory = history.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Card Data with professional styling
  const cardData = [
    {
      icon: <PaymentIcon1 />,
      color: "from-amber-400 to-amber-500",
      label: "Wallet Balance",
      amount: `$${(
        (profile?.total_deposit || 0) + (profile?.total_earning || 0)
      ).toFixed(2)}`,
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
    },
    {
      icon: <PaymentIcon2 />,
      color: "from-emerald-400 to-emerald-500",
      label: "Total Deposit",
      amount: profile ? `$${profile.total_deposit || 0}` : "$0",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    },
    {
      icon: <PaymentIcon3 />,
      color: "from-blue-400 to-blue-500",
      label: "Total Earnings",
      amount: profile
        ? `$${(
            (profile?.total_referral_bonus || 0) +
            (profile?.trading_bonus || 0) +
            (profile?.monthly_profit_share || 0)
          ).toFixed(2)}`
        : "$0.00",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    },
    {
      icon: <PaymentIcon4 />,
      color: "from-violet-400 to-violet-500",
      label: "Total Withdrawn",
      amount: profile ? `$${profile.total_withdrawl || 0}` : "$0",
      bgColor: "bg-gradient-to-br from-violet-50 to-violet-100",
    },
    {
      icon: <PaymentIcon3 />,
      color: "from-cyan-400 to-cyan-500",
      label: "Your Referral Bonus",
      amount: profile ? `$${(referralEarningL1 || 0).toFixed(2)}` : "$0.00",
      bgColor: "bg-gradient-to-br from-cyan-50 to-cyan-100",
    },
    {
      icon: <PaymentIcon1 />,
      color: "from-orange-400 to-orange-500",
      label: "Level Income",
      amount: profile
        ? `$${
            (profile.trading_bonus + profile.total_referral_bonus).toFixed(2) ||
            "0"
          }`
        : "$0",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    },
    {
      icon: <PaymentIcon2 />,
      color: "from-teal-400 to-teal-500",
      label: "Daily Profit Share",
      amount: profile
        ? profile.profit_share_type === "percent"
          ? `${profile.profit_share_value || 0}%`
          : `$${profile.profit_share_value || 0}`
        : "$0",
      bgColor: "bg-gradient-to-br from-teal-50 to-teal-100",
    },
    {
      icon: <PaymentIcon4 />,
      color: "from-purple-400 to-purple-500",
      label: "Total Team Size",
      amount: profile
        ? `${(profile?.directMember || 0) + (profile?.levelMember || 0)}`
        : "0",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Withdrawal Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your withdrawal requests and track your earnings
          </p>
        </div>

        {/* Wallet Overview Cards */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Wallet Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardData.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-md`}
                  >
                    <div className="text-white text-xl">{card.icon}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {card.label}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {card.amount}
                  </div>
                  {card.label === "Total Team Size" && (
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Direct: {profile?.directMember || 0}</div>
                      <div>Level: {profile?.levelMember || 0}</div>
                    </div>
                  )}
                  {card.label === "Total Earnings" && (
                    <div className="text-xs text-gray-500">
                      Available: ${(profile?.total_earning || 0).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Withdrawal Requests
              </h2>
              <p className="text-gray-600 mt-1">
                Request withdrawals from your available balance
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Withdrawal History
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Track your withdrawal requests and their status
            </p>
          </div>

          <div className="p-8">
            <HistoryTable
              data={paginatedHistory.map((req) => ({
                amount: req.amount,
                method: req.method,
                walletAddress: req.walletAddress,
                status: req.status,
                createdAt: req.createdAt,
                updatedAt: req.updatedAt,
              }))}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          currentPage === page
                            ? "bg-red-600 text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
              <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Withdrawal Request
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-8">
                <WithdrawalForm
                  profile={profile}
                  onSubmit={(newRequest) => {
                    setHistory((prev) => [newRequest, ...prev]);
                    setShowModal(false);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalRequest;
