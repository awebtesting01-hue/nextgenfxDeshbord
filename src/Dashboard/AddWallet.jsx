import React, { useEffect, useState } from "react";
import PaymentIcon1 from "../icon/PaymentIcon1";
import PaymentIcon2 from "../icon/PaymentIcon2";
import PaymentIcon3 from "../icon/PaymentIcon3";
import PaymentIcon4 from "../icon/PaymentIcon4";
import { transactionFeeApi } from "../api/transactionFeeApi";
import { uploadToCloudinary } from "../utils/coudinary";
import { addWalletApi } from "../api/addWallet.api";
import { referralApi, userApi } from "../api/userApi";
import axios from "axios";
import { useRef } from "react";

const AddWallet = () => {
  const [profile, setProfile] = useState(null);
  const [fees, setFees] = useState([]);
  const [amount, setAmount] = useState(0);
  const [selected, setSelected] = useState("");
  const [transferType, setTransferType] = useState("");
  const [summary, setSummary] = useState({ charge: 0, payable: 0, receive: 0 });
  const [remarks, setRemarks] = useState("");
  const [files, setFiles] = useState([]);
  const [screenshotUrls, setScreenshotUrls] = useState([]);
  const [otherUserSearch, setOtherUserSearch] = useState("");
  const [otherUserResults, setOtherUserResults] = useState([]);
  const [selectedOtherUser, setSelectedOtherUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralEarningL1, setReferralEarningL1] = useState(0);

  const fileInputRef = useRef(null);

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
        const user = JSON.parse(localStorage.getItem("user"));
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

  // Fetch transaction fees
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const data = await transactionFeeApi.getAllFees();
        const feeArray = data?.data?.fees || data?.fees || [];
        setFees(feeArray);
      } catch (err) {
        console.error("Failed to fetch fees:", err);
      }
    };
    fetchFees();
  }, []);

  // Calculate summary
  useEffect(() => {
    if (!amount || fees.length === 0) {
      setSummary({ charge: 0, payable: amount || 0, receive: amount || 0 });
      return;
    }
    const applicableFee = fees.find(
      (fee) =>
        amount >= fee.fromAmount &&
        (fee.toAmount === null || amount <= fee.toAmount)
    );
    let charge = 0;
    if (applicableFee) {
      charge =
        applicableFee.type === "flat"
          ? applicableFee.value
          : (amount * applicableFee.value) / 100;
    }
    setSummary({
      charge,
      payable: amount,
      receive: Math.max(amount - charge, 0),
    });
  }, [amount, fees]);

  const handleAmountClick = (value) => {
    setSelected(value);
    setAmount(value === "Custom" ? 0 : Number(value.replace("$", "")));
  };

  const handleTransferTypeChange = (e) => {
    setTransferType(e.target.value);
    setSelectedOtherUser(null);
    setOtherUserSearch("");
    setOtherUserResults([]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const filteredFiles = selectedFiles.filter((file) =>
      validTypes.includes(file.type)
    );
    if (filteredFiles.length !== selectedFiles.length)
      alert("Only JPG, JPEG, or PNG files are allowed");
    setFiles((prev) => [...prev, ...filteredFiles]);
  };

  const handleRemoveFile = (index) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  // Search other users by ID (debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!otherUserSearch.trim()) {
        setOtherUserResults([]);
        return;
      }

      try {
        const data = await userApi.searchUserByUserID(otherUserSearch);

        if (data.statusCode === 200 && data.data.length > 0) {
          setOtherUserResults(data.data);
        } else if (data.statusCode === 404) {
          setOtherUserResults([]);
        }
      } catch (err) {
        setOtherUserResults([]);
        console.error("Error searching users:", err);
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [otherUserSearch]);

  const handleContinue = async () => {
    setLoading(true);
    try {
      if (!amount || amount <= 0) return alert("Please enter a valid amount");
      if (!transferType) return alert("Please select a transfer type");
      if (!paymentMethod) return alert("Please select a payment method");
      if (files.length === 0)
        return alert("Please upload at least one payment screenshot");
      if (transferType === "Other User Account" && !selectedOtherUser)
        return alert("Please select a user for Other User Account transfer");

      let uploadedUrls = [];
      for (const file of files) {
        const cloudinaryResponse = await uploadToCloudinary(file);
        if (!cloudinaryResponse.secure_url)
          throw new Error("Failed to upload image to Cloudinary");
        uploadedUrls.push(cloudinaryResponse.secure_url);
      }
      setScreenshotUrls(uploadedUrls);

      const payload = {
        userId: profile?._id,
        totalPayable: summary.payable,
        transactionCharge: summary.charge,
        receiveAmount: summary.receive,
        transferType,
        paymentMethod,
        screenshotUrls: uploadedUrls,
        user_remarks: remarks || "",
        ...(transferType === "Other User Account" && {
          otherUserId: selectedOtherUser._id,
        }),
      };

      const response = await addWalletApi.createWallet(payload);
      console.log("Wallet Created:", response);
      alert("Wallet request created successfully ✅");

      // Reset
      setAmount(0);
      setSelected("");
      setTransferType("");
      setRemarks("");
      setFiles([]);
      setScreenshotUrls([]);
      setSummary({ charge: 0, payable: 0, receive: 0 });
      setSelectedOtherUser(null);
      setOtherUserSearch("");
      setOtherUserResults([]);
      setPaymentMethod("");

      // ✅ Clear input value so same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error in continue:", error);
      alert(error.message || "Something went wrong while processing");
    } finally {
      // ✅ Stop loading no matter what
      setLoading(false);
    }
  };

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
            Wallet Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your wallet balance and transactions
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

        {/* Recharge Wallet Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Recharge Wallet</h2>
            <p className="text-blue-100 mt-1">
              Add funds to your wallet securely
            </p>
          </div>

          <div className="p-8">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Amount Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Select Amount ($USD)
                </label>
                <div className="flex flex-wrap gap-3">
                  {["$10", "$50", "$100", "Custom"].map((amt, index) => (
                    <button
                      key={index}
                      onClick={() => handleAmountClick(amt)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 border-2 ${
                        selected === amt
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105"
                          : "bg-white text-blue-600 border-blue-200 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Enter Amount ($USD)
                </label>
                <input
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Enter custom amount"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  min="0"
                  disabled={selected !== "Custom"}
                />
              </div>

              {/* Transfer Type */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Transfer Type
                </label>
                <select
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={transferType}
                  onChange={handleTransferTypeChange}
                >
                  <option value="" disabled>
                    Select transfer type
                  </option>
                  <option value="Other User Account">Other User Account</option>
                  <option value="Own Account">Own Account</option>
                </select>
              </div>

              {/* Other User Search */}
              {transferType === "Other User Account" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Search User by ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={otherUserSearch}
                      onChange={(e) => setOtherUserSearch(e.target.value)}
                      placeholder="Enter user ID to search"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 transition-colors duration-200"
                    />
                    {otherUserSearch.trim().length > 0 && (
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl">
                        {otherUserResults.length > 0 ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-red-500">✗</span>
                        )}
                      </span>
                    )}
                  </div>

                  {otherUserResults.length > 0 && (
                    <select
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      value={selectedOtherUser?._id || ""}
                      onChange={(e) =>
                        setSelectedOtherUser(
                          otherUserResults.find((u) => u._id === e.target.value)
                        )
                      }
                    >
                      <option value="" disabled>
                        Select a user
                      </option>
                      {otherUserResults.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.display_name} ({user.user_id})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Payment Method */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Payment Method
                </label>
                <select
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="" disabled>
                    Choose a payment network
                  </option>
                  <option value="bep20">🔶 USDT - BEP20 (1.5% fee)</option>
                </select>
              </div>

              {/* Transaction Summary */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Transaction Summary
                </label>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Transaction Charge:</span>
                    <span className="font-semibold text-gray-900">
                      ${summary.charge.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Total Payable:</span>
                    <span className="font-semibold text-gray-900">
                      ${summary.payable.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-bold text-gray-900">
                      You will receive:
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      ${summary.receive.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Payment Screenshots
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-blue-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 010 10h-1.5"
                      />
                    </svg>
                    <p className="text-gray-600 font-medium mb-1">
                      Click to upload payment proof
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports JPG, JPEG, PNG • Multiple files allowed
                    </p>
                  </div>
                  <input
                    id="screenshotUpload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>

                {/* File Previews */}
                {files.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Selected Files ({files.length})
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {files.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Remarks */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add reference or note for this transaction"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  onClick={handleContinue}
                  disabled={
                    loading ||
                    !amount ||
                    !transferType ||
                    files.length === 0 ||
                    (transferType === "Other User Account" &&
                      !selectedOtherUser) ||
                    !paymentMethod
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:scale-100"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Transaction...</span>
                    </div>
                  ) : (
                    "Complete Transaction"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWallet;
