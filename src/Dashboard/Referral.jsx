import React, { useState, useEffect } from "react";
import {
  FaCopy,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import referralImg from "../assets/Group 2.png"; // Make sure this path is correct
import { referralApi, teamApi } from "../api/userApi";

const Referral = () => {
  const [referralCode, setReferralCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false); // Separate state for code copy
  const [copiedLink, setCopiedLink] = useState(false); // Separate state for link copy
  const [referralLink, setReferralLink] = useState("");
  const [directReferrals, setDirectReferrals] = useState(15);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [teamData, setTeamData] = useState([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchBonus = async () => {
      try {
        const data = await referralApi.getLevel1BonusSum(user._id);
        console.log("Level 1 total bonus:", data);
        setReferralEarnings(data.data.totalBonus);
      } catch (err) {
        console.error(err);
      }
    };
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
    fetchBonus();
  }, []);

  // Load referral_id from localStorage when component mounts
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.referral_id) {
          setReferralCode(parsedUser.referral_id);

          // Build full referral link using current domain
          const domain = window.location.origin;
          setReferralLink(`${domain}/signup/${parsedUser.referral_id}`);
        }
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  const handleCopyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareOnSocialMedia = (platform) => {
    const shareText = `Join me on NextGenFX using my referral code: ${referralCode}`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(referralLink);

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=Join me on NextGenFX&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Invite & Earn</h2>
          <p className="text-gray-600 text-lg">
            Share your referral code or link. Earn rewards for every direct
            referral!
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section - Referral Code and Link */}
        <div className="lg:w-1/2">
          {/* Referral Code */}
          <div className="mb-6">
            <p className="text-gray-700 font-medium mb-2">Your Referral Code</p>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
              <div className="bg-gray-100 border border-gray-300 px-4 py-3 rounded-lg text-lg font-mono font-bold w-full md:w-auto flex-grow">
                {referralCode || "Loading..."}
              </div>
              <button
                onClick={handleCopyCode}
                disabled={!referralCode}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition min-w-[100px] justify-center"
              >
                <FaCopy /> {copiedCode ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Referral Link */}
          {referralLink && (
            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">
                Your Referral Link
              </p>
              <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
                <div className="bg-gray-100 border border-gray-300 px-4 py-3 rounded-lg text-sm md:text-base w-full md:w-auto flex-grow font-mono truncate">
                  {referralLink}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition min-w-[120px] justify-center"
                >
                  <FaCopy /> {copiedLink ? "Copied" : "Copy Link"}
                </button>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#457bf5] p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-white">
                {
                  teamData.filter(
                    (item) => item?.levelRelationWithCurrentUser === 1
                  ).length
                }{" "}
                users
              </p>
              <p className="text-white">Direct Referrals</p>
            </div>
            <div className="bg-[#30D096] p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-white">
                ${referralEarnings.toFixed(2)}
              </p>
              <p className="text-white">Referral Earnings</p>
            </div>
          </div>

          {/* Social Sharing Buttons */}
          <div className="mb-6">
            <p className="text-gray-700 font-medium mb-3">Share via</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => shareOnSocialMedia("whatsapp")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
              >
                <FaWhatsapp /> WhatsApp
              </button>
              <button
                onClick={() => shareOnSocialMedia("facebook")}
                className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
              >
                <FaFacebook /> Facebook
              </button>
              <button
                onClick={() => shareOnSocialMedia("twitter")}
                className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
              >
                <FaTwitter /> Twitter
              </button>
              <button
                onClick={() => shareOnSocialMedia("email")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
              >
                <FaEnvelope /> Email
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Illustration */}
        <div className="lg:w-1/2 flex justify-center items-center">
          <img
            src={referralImg}
            alt="Referral illustration"
            className="max-w-full md:w-96"
          />
        </div>
      </div>
    </div>
  );
};

export default Referral;
