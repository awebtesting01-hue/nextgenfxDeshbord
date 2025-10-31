import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import img1 from "../assets/img1.png";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = () => {
    if (!password || !confirmPassword) {
      setError("All fields are required");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    console.log(`Resetting password for: ${email}, New Password: ${password}`);
    setError("");
    navigate("/password-reset-success");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left: Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Steps */}
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-[#4361EE] text-white">1</div>
            <div className="w-6 h-[2px] bg-[#4361EE]" />
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-[#4361EE] text-white">2</div>
            <div className="w-6 h-[2px] bg-[#C3D4E9]" />
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border border-[#C3D4E9] text-[#94A3B8]">3</div>
          </div>

          <h2 className="text-3xl font-semibold text-center mb-2">Reset Password</h2>
          <p className="text-lg text-center mb-5">
            Create a new password to regain access to your account.
          </p>

          <form onSubmit={handleReset} className="space-y-4">
            {/* New Password */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-blue-300 rounded-xl p-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
              <span
                className="absolute right-4 top-[38px] cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 block mb-1">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-blue-300 rounded-xl p-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
              <span
                className="absolute right-4 top-[38px] cursor-pointer text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>

      {/* Right: Image Section (Responsive) */}
     <div
             className="hidden md:flex w-full md:w-1/2 h-[300px] md:h-screen items-center justify-center bg-[#4361EE] bg-cover bg-center"
             style={{ backgroundImage: `url(${img1})` }}
           >
             <h1 className="text-white text-5xl lg:text-7xl font-bold">MLM</h1>
           </div>
    </div>
  );
};

export default ResetPassword;
