import React, { useEffect, useState } from "react";
import {
  FaWallet,
  FaPiggyBank,
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaUsers,
  FaUserPlus,
  FaChartLine,
  FaUserFriends,
  FaPrint,
  FaDownload,
} from "react-icons/fa";
import EarningsBarChart from "../DashboardComponets/EarningsBarChart";
import PaymentIcon1 from "../icon/PaymentIcon1";
import PaymentIcon2 from "../icon/PaymentIcon2";
import PaymentIcon3 from "../icon/PaymentIcon3";
import PaymentIcon4 from "../icon/PaymentIcon4";
import { referralApi, userApi } from "../api/userApi";

const levelData = Array.from({ length: 15 }, (_, i) => ({
  level: `Level ${i + 1}`,
  members: Math.floor(Math.random() * 100) + 1,
  earnings: `$${Math.floor(Math.random() * 1000) + 100}`,
}));

const Earnings = () => {
  const [profile, setProfile] = useState(null);
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
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("accessToken");

        if (!user?._id || !token) {
          console.error("Missing user or access token");
          return;
        }

        const data = await userApi.getProfile(
          { id: user._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(data?.data);
        localStorage.setItem("userProfile", JSON.stringify(data?.data));
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const cardData = [
    {
      icon: <PaymentIcon1 />,
      color: "#FFC457",
      label: "Wallet Balance",
      amount: `$${(
        (profile?.total_deposit || 0) + (profile?.total_earning || 0)
      ).toFixed(2)}`,
    },
    {
      icon: <PaymentIcon2 />,
      color: "#34D399",
      label: "Total Deposit",
      amount: profile ? `$${profile.total_deposit || 0}` : "$0",
    },
    {
      icon: <PaymentIcon3 />,
      color: "#60A5FA",
      label: "Total Earnings",
      amount: profile
        ? `$${(
            (profile?.total_referral_bonus || 0) +
            (profile?.trading_bonus || 0) +
            (profile?.monthly_profit_share || 0)
          ).toFixed(2)}`
        : "$0.00",
    },
    {
      icon: <PaymentIcon4 />,
      color: "#A78BFA",
      label: "Total Withdrawn",
      amount: profile ? `$${profile.total_withdrawl || 0}` : "$0",
    },
    {
      icon: <PaymentIcon3 />,
      color: "#60A5FA",
      label: "Your Referral Bonus",
      amount: profile ? `$${(referralEarningL1 || 0).toFixed(2)}` : "$0.00",
    },
    {
      icon: <PaymentIcon1 />,
      color: "#FFC457",
      label: "Level Income",
      amount: profile
        ? `$${
            (profile.trading_bonus + profile.total_referral_bonus).toFixed(2) ||
            "0"
          }`
        : "$0",
    },
    {
      icon: <PaymentIcon2 />,
      color: "#34D399",
      label: "Daily Profit Share",
      amount: profile
        ? profile.profit_share_type === "percent"
          ? `${profile.profit_share_value || 0}%`
          : `$${profile.profit_share_value || 0}`
        : "$0",
    },
    {
      icon: <PaymentIcon4 />,
      color: "#A78BFA",
      label: "Total Team Size",
      amount: profile
        ? `${(profile?.directMember || 0) + (profile?.levelMember || 0)}`
        : "0",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 rounded-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-300 mb-6 gap-4">
        <div className="flex items-center gap-2 text-[#3B5AFE] font-semibold text-lg">
          <FaWallet />
          <span>Earnings</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="bg-[#3B5AFE] text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm">
            <FaDownload /> Export CSV
          </button>
          <button className="border border-[#3B5AFE] text-[#3B5AFE] px-4 py-2 rounded-md flex items-center gap-2 text-sm">
            <FaPrint /> Print Report
          </button>
        </div>
      </div>

      {/* Cards */}
      <h2 className="text-xl font-semibold mb-4">Wallet Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-100 flex flex-col items-start gap-2"
          >
            <div
              className="p-3 rounded-full text-white text-xl"
              style={{ backgroundColor: card.color }}
            >
              {card.icon}
            </div>
            <div className="text-gray-600 font-medium text-sm">
              {card.label}
            </div>
            <div className="text-xl font-bold text-gray-800">{card.amount}</div>
            {card.label === "Total Team Size" && (
              <div className="text-sm text-gray-600">
                Direct Member: {profile?.directMember || 0} <br />
                Level Member: {profile?.levelMember || 0}
              </div>
            )}
            {card.label === "Total Earnings" && (
              <div className="text-sm text-gray-600">
                Available Withdrawl Balance:{" "}
                {(profile?.total_earning || 0).toFixed(2)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Table */}
      <h2 className="text-xl font-semibold mb-4">
        Referral & Team Performance
      </h2>
      <div className="overflow-x-auto bg-white rounded-md border border-gray-200 mb-6">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Level</th>
              <th className="px-4 py-2 text-center">Members</th>
              <th className="px-4 py-2 text-right">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {levelData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b border-gray-200 text-left">
                  {row.level}
                </td>
                <td className="px-4 py-2 border-b border-gray-200  text-center">
                  {row.members}
                </td>
                <td className="px-4 py-2 border-b border-gray-200  text-right">
                  {row.earnings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-wrap gap-3 justify-start mb-10">
        <button className="bg-[#4361EE] text-white px-4 py-2 rounded-xl text-sm">
          Recharge Wallet
        </button>
        <button className="bg-[#01BA7F] text-white px-4 py-2 rounded-xl text-sm">
          Transfer
        </button>
        <button className="bg-[#89BA01] text-white px-4 py-2 rounded-xl text-sm">
          Withdrawal
        </button>
        <button className="px-4 py-2 rounded-xl text-[#89BA01] border border-[#89BA01] text-sm">
          Withdrawal History
        </button>
        <button className="px-4 py-2 rounded-xl text-[#01BA7F] border border-[#01BA7F] text-sm">
          Invite Via WhatsApp
        </button>
        <button className="px-4 py-2 rounded-xl text-[#4361EE] border border-[#4361EE] text-sm">
          Download Report
        </button>
      </div>

      {/* Chart */}
      <EarningsBarChart />
    </div>
  );
};

export default Earnings;
