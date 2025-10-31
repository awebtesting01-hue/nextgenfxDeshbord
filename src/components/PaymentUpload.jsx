import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/userApi";
import { uploadToCloudinary } from "../utils/coudinary";

const PaymentUpload = ({ onBack }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(999);
  const [referralId, setReferralId] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // On mount, check localStorage for referral ID
  useEffect(() => {
    // Set referral ID if exists
    const storedReferral = localStorage.getItem("signupReferralId");
    if (storedReferral) {
      setReferralId(storedReferral);
    }

    // Get signup data and amount
    const amountUserStr = localStorage.getItem("signupData"); // or "amountUser" if that's the key
    if (amountUserStr) {
      try {
        const amountUser = JSON.parse(amountUserStr); // Parse the stored string
        console.log({ amountUser });

        // If amount is nested inside the object
        const parsedAmountUser =
          typeof amountUser === "string" ? JSON.parse(amountUser) : amountUser;

        setAmount(parsedAmountUser.amount || 0); // Set default 0 if not available
      } catch (error) {
        console.error("Error parsing signupData from localStorage:", error);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isImageFile(selectedFile)) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError("");
    } else {
      setError("Please upload a valid image file (JPEG, PNG)");
    }
  };

  const isImageFile = (file) => {
    return file && file.type.match(/image\/(jpeg|png)/);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isImageFile(droppedFile)) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setError("");
    } else {
      setError("Please upload a valid image file (JPEG, PNG)");
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a payment screenshot");
      return;
    }
    if (Number(amount) < 15) {
      alert("Amount should be greater than or equal to 15");
      return;
    }

    try {
      setIsLoading(true);

      const signupData = JSON.parse(localStorage.getItem("signupData")) || {};
      const { fullName, phone, ip_address, user_id } = signupData;
      const email = signupData.email || localStorage.getItem("userEmail");

      if (!email) {
        throw new Error("Registration data not found. Please start over.");
      }

      const cloudinaryResponse = await uploadToCloudinary(file);
      if (!cloudinaryResponse.secure_url) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      await authApi.completeRegistration({
        email,
        display_name: fullName,
        phone_number: phone,
        ip_address,
        amount,
        user_id,
        payment_screenshot: cloudinaryResponse.secure_url,
        referral_id: referralId || "", // Use referralId from localStorage
      });

      // Clear localStorage after registration
      localStorage.removeItem("signupData");
      localStorage.removeItem("isEmailVerified");
      localStorage.removeItem("signupReferralId");

      navigate("/registration-success");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        (err && (err.message || err.toString())) ||
          "Failed to complete registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[80vh] bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-black text-center">
          Upload Payment Proof
        </h2>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-[#4361EE] bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("file-upload").click()}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={handleFileChange}
          />
          {preview ? (
            <div className="flex flex-col items-center">
              <img
                src={preview}
                alt="Preview"
                className="max-h-60 mx-auto mb-4 rounded-lg"
              />
              <button
                type="button"
                className="text-[#4361EE] text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
              >
                Change Image
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-700">
                {isDragging
                  ? "Drop your payment screenshot here"
                  : "Drag & drop your payment screenshot here"}
              </p>
              <p className="text-sm text-gray-500 mt-2">or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">
                (JPEG, PNG files only)
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="15"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Referral ID (Optional)
            </label>
            <input
              type="text"
              value={referralId}
              onChange={(e) => setReferralId(e.target.value)}
              placeholder="Enter Referral ID if any"
              disabled={!!localStorage.getItem("signupReferralId")} // Disable if exists in localStorage
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="text-[#4361EE] font-medium text-sm px-4 py-2 hover:bg-blue-50 rounded-lg"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !file}
            className={`bg-[#4361EE] hover:bg-[#354ac0] text-white font-medium py-2 px-6 rounded-xl transition-colors ${
              (isLoading || !file) && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Processing..." : "Complete Registration"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentUpload;
