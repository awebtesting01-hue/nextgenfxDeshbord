import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/userApi";

const SignUp2 = ({ onNextStep, onBack }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Get existing data from localStorage
      const signupData = JSON.parse(localStorage.getItem("signupData")) || {};
      const email = signupData.email || localStorage.getItem("userEmail");

      if (!email) {
        throw new Error(
          "Email not found. Please start the registration process again."
        );
      }

      // Update with password in localStorage
      const updatedData = {
        ...signupData,
        password,
      };
      localStorage.setItem("signupData", JSON.stringify(updatedData));

      // Make API call to set password
      await authApi.setPassword({
        email,
        password,
        user_id: signupData.user_id,
      });

      // Store in localStorage that password is set
      localStorage.setItem(
        "signupData",
        JSON.stringify({
          ...updatedData,
          passwordSet: true,
        })
      );

      if (onNextStep) {
        onNextStep({ password });
      }
    } catch (error) {
      console.error("Error setting password:", error);
      setError(error.message || "Failed to set password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[70vh] flex flex-col justify-start px-6 md:px-[60px] lg:px-[100px] py-10 bg-white">
      <div className="max-w-md w-full space-y-8 py-10">
        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
            Create Password
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-500">
            Set a strong password to secure your account.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {/* Create Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </span>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="text-[#4361EE] font-medium text-sm px-4 py-2"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-[#4361EE] hover:bg-[#354ac0] text-white font-medium py-2 px-6 rounded-xl"
              disabled={loading}
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp2;
