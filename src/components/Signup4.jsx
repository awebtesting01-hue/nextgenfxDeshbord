import React, { useEffect, useState } from "react";
import { FaDollarSign, FaCopy } from "react-icons/fa";
import { walletApi } from "../api/signUpWalletApi";
import { QRCodeSVG } from "qrcode.react";

const Signup4 = ({ onNextStep, onBack }) => {
  const [amount, setAmount] = useState(990);
  const [copied, setCopied] = useState(false);
  const [wallet, setWallet] = useState({});

  const handleAmountChange = (value) => {
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setAmount(numericValue);
    }
  };

  useEffect(() => {
    const walletInfo = async () => {
      try {
        const data = await walletApi.getAll();
        if (data && data.data.length > 0) {
          setWallet(data.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch wallet:", err);
      }
    };
    walletInfo();
  }, []);

  useEffect(() => {
    const signupData = JSON.parse(localStorage.getItem("signupData")) || {};
    if (signupData.amount) {
      setAmount(signupData.amount);
    }
  }, []);

  const handleSubmit = () => {
    const signupData = JSON.parse(localStorage.getItem("signupData")) || {};
    const updatedData = { ...signupData, amount };
    localStorage.setItem("signupData", JSON.stringify(updatedData));
    if (onNextStep) {
      onNextStep({ amount });
    }
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full h-[80vh] bg-white flex items-center justify-center px-4 py-10 mt-10">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-black text-center">
          Payment Information
        </h2>

        {/* Amount Field */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Amount ($)
          </label>
          <div className="flex items-center bg-gray-100 px-4 py-3 rounded-xl w-full">
            <FaDollarSign className="text-gray-400 mr-2" />
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              min={0}
              className="w-full bg-transparent outline-none text-base text-black"
            />
          </div>
        </div>

        {/* Payment Address */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            BEP20 Wallet Address
          </label>
          <div className="relative">
            <div className="bg-gray-100 px-4 py-3 pr-12 rounded-xl w-full overflow-x-auto">
              <code className="text-sm text-black break-all">
                {wallet.address}
              </code>
            </div>
            <button
              onClick={copyAddress}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-[#4361EE] transition-colors"
              title="Copy address"
            >
              <FaCopy />
            </button>
            {copied && (
              <div className="absolute -bottom-8 left-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Copied!
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Send exactly ${amount} to this BEP20 address
          </p>
        </div>

        {/* QR Code (Dynamic) */}
        {wallet?.address && (
          <div className="flex flex-col items-center">
            <QRCodeSVG
              value={wallet.address} // ✅ encodes wallet address
              size={256}
            />
            <p className="text-xs text-gray-500 mt-2">
              Scan QR code to make payment
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#4361EE] hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition"
        >
          Confirm Payment
        </button>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="text-[#4361EE] font-medium text-sm px-4 py-2"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup4;
