import { useState, useEffect } from "react";
import { withdrawalFeeApi, withdrawalRequestApi } from "../api/withdrawl.api";

const WithdrawalForm = ({ profile, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [feeRules, setFeeRules] = useState([]);
  const [fee, setFee] = useState("0.00");
  const [net, setNet] = useState("0.00");

  // Fetch fee rules on mount
  useEffect(() => {
    const fetchFeeRules = async () => {
      try {
        const response = await withdrawalFeeApi.getAllFees();
        setFeeRules(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } catch (err) {
        console.error("Failed to fetch withdrawal fees:", err);
        setFeeRules([]);
      }
    };
    fetchFeeRules();
  }, []);

  // Update fee & net whenever amount or feeRules change
  useEffect(() => {
    if (!amount || amount <= 0 || feeRules.length === 0) {
      setFee("0.00");
      setNet("0.00");
      return;
    }

    const calculatedFee = withdrawalFeeApi.calculateFee(amount, feeRules);
    setFee(calculatedFee.toFixed(2));
    setNet((amount - calculatedFee).toFixed(2));
  }, [amount, feeRules]);

  const handleContinue = async () => {
    if (!amount || amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    if (amount < 5) {
      alert("Amount must be at least 5 USD");
      return;
    }
    if (amount > profile.total_earning) {
      alert("Amount cannot exceed total earnings");
      return;
    }
    if (!walletAddress.trim()) {
      alert("Wallet address is required");
      return;
    }

    const withdrawalData = {
      userId: profile._id, // make sure profile contains _id
      amount,
      fee: parseFloat(fee),
      netAmount: parseFloat(net),
      method: "BEP20",
      walletAddress,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await withdrawalRequestApi.createWithdrawal(
        withdrawalData
      );
      console.log("Withdrawal Created:", response);

      if (onSubmit) onSubmit(response);

      // Reset form
      setAmount("");
      setWalletAddress("");
      setFee("0.00");
      setNet("0.00");

      alert("Withdrawal request created successfully!");
    } catch (err) {
      console.error("Failed to create withdrawal request:", err);
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Withdraw Funds
      </h2>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
        <div className="flex flex-col w-full">
          <label className="text-sm text-gray-600 font-medium mb-1">
            Enter Amount ($USD)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-12 px-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter amount"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm text-gray-600 font-medium mb-1">
            Payment Method
          </label>
          <input
            type="text"
            value="BEP20"
            disabled
            className="h-12 px-3 rounded-xl border border-gray-300 text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex flex-col w-full mb-4">
        <label className="text-sm text-gray-600 font-medium mb-1">
          Wallet Address
        </label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="h-12 px-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter BEP20 wallet address"
        />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
        <h3 className="font-medium text-gray-700 mb-2">Summary</h3>
        <p className="text-gray-600 mb-1">
          Transaction Fee: <strong>${fee}</strong>
        </p>
        <p className="text-gray-600">
          You Will Receive: <strong>${net}</strong>
        </p>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="w-full h-12 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        Continue
      </button>
    </div>
  );
};

export default WithdrawalForm;
