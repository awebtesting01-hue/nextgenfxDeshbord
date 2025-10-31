import React, { useEffect, useState, useMemo } from "react";
import { FaWallet, FaDollarSign, FaRedo } from "react-icons/fa";
import ChartComponent from "../DashboardComponets/ChartComponent";
import EarningsChart from "../DashboardComponets/CustomTooltip";
import { referralApi, userApi } from "../api/userApi";
import PaymentIcon1 from "../icon/PaymentIcon1";
import PaymentIcon2 from "../icon/PaymentIcon2";
import PaymentIcon3 from "../icon/PaymentIcon3";
import PaymentIcon4 from "../icon/PaymentIcon4";

const Dashboard = () => {
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
    const fetchProfile = async () => {
      try {
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

        console.log({ data });

        setProfile(data?.data);
        localStorage.setItem("userProfile", JSON.stringify(data?.data));
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
    fetchBonus();
  }, []);

  // ✅ Recompute stats whenever profile changes
  const stats = useMemo(
    () => [
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
              (profile.trading_bonus + profile.total_referral_bonus).toFixed(
                2
              ) || "0"
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
      {
        icon: <PaymentIcon4 />,
        color: "#A78BFA",
        label: "Your Monthly Salary",
        amount: "$ 0",
      },
    ],
    [profile] // ✅ recompute whenever profile updates
  );

  return (
    <div className="p-3">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((card, index) => (
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

            {/* ✅ Custom layout for Daily Profit Share */}
            {card.label === "Daily Profit Share" ? (
              <div className="flex flex-col gap-1 text-sm text-gray-700">
                <div>
                  Own Account Share:{" "}
                  <span className="font-semibold text-gray-900">
                    {profile?.profit_share_type === "percent"
                      ? `${profile?.profit_share_value || 0}%`
                      : `$${profile?.profit_share_value || 0}`}
                  </span>
                </div>
                <div>
                  Commission Share:{" "}
                  <span className="font-semibold text-gray-900">
                    {profile?.commission_share_value
                      ? `$${profile.commission_share_value}`
                      : "$0"}
                  </span>
                </div>
                <div>
                  Total Money Received:{" "}
                  <span className="font-semibold text-gray-900">$0</span>
                </div>
              </div>
            ) : (
              // Default amount display for other cards
              <div className="text-xl font-bold text-gray-800">
                {card.amount}
              </div>
            )}

            {/* ✅ Extra details for other specific cards */}
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

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="w-full h-[440px]">
          <ChartComponent />
        </div>
        <div className="w-full h-[440px]">
          <EarningsChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
