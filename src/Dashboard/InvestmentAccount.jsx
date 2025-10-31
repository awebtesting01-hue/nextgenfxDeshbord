import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FaCopy } from "react-icons/fa";
import { walletApi } from "../api/signUpWalletApi";

const InvestmentAccount = ({ amount }) => {
  const [wallet, setWallet] = useState(null);
  const [copied, setCopied] = useState(false);

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

  const copyAddress = async () => {
    if (wallet?.address) {
      try {
        await navigator.clipboard.writeText(wallet.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  if (!wallet) {
    return (
      <div className="flex justify-center items-center py-10 space-x-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        <p className="text-gray-500 text-lg font-medium">Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl p-8 space-y-8 border border-gray-200">
      {/* Wallet Address */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          BEP20 Wallet Address
        </label>
        <div className="relative">
          <div className="bg-gray-100 px-5 py-4 rounded-xl w-full border border-gray-200 shadow-inner overflow-x-auto hover:shadow-lg transition-shadow duration-300">
            <code className="text-sm text-gray-800 font-mono break-all">
              {wallet.address}
            </code>
          </div>
          <button
            onClick={copyAddress}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
            title="Copy address"
          >
            <FaCopy className="text-base" />
          </button>
          {copied && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full shadow-md animate-fadeIn">
              ✅ Copied!
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Send exactly{" "}
          <span className="font-semibold text-blue-600">${amount}</span> to this
          BEP20 address
        </p>
      </div>

      {/* QR Code */}
      {wallet?.address && (
        <div className="flex flex-col items-center bg-white rounded-2xl py-6 px-8 shadow-xl border border-gray-200">
          <QRCodeSVG value={wallet.address} size={220} className="rounded-lg" />
          <p className="text-sm text-gray-600 mt-4 text-center">
            Scan this QR code to make payment
          </p>
        </div>
      )}
    </div>
  );
};

export default InvestmentAccount;
