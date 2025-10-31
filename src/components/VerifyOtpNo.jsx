import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/img1.png";

const VerifyOtpNo = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value;
    if (val.length === 1 && idx < 3) {
      inputsRef.current[idx + 1]?.focus();
    } else if (val.length === 0 && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleVerifyClick = (e) => {
    e.preventDefault();
    const otp = inputsRef.current.map((input) => input.value).join("");
    if (otp.length === 4) {
      navigate("/auth/signup"); // Step 3
    } else {
      alert("Please enter the complete 4-digit OTP.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-start md:justify-center px-6 md:px-[60px] lg:px-[100px] pt-10">
        {/* Heading */}
        <div className="mb-6 flex flex-col justify-center items-center text-center pr-[29%]">
          <h2 className="text-[40px] font-semibold mb-4">Verify OTP</h2>
          <p className="text-gray-500 text-lg mb-1">
            We sent a code to{" "}
            <span className="font-semibold text-black">0022330055</span>
          </p>
        </div>

        {/* OTP Input */}
        <form className="w-full max-w-md space-y-7" onSubmit={handleVerifyClick}>
          <div className="flex justify-center gap-12">
            {[...Array(4)].map((_, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                autoComplete="one-time-code"
                className="w-12 h-12 border border-[#C3D4E9] rounded-xl text-center text-lg focus:outline-none focus:border-[#4361EE]"
                onChange={(e) => handleChange(e, i)}
              />
            ))}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full bg-[#4361EE] text-white py-[14px] rounded-2xl"
          >
            Continue
          </button>

          {/* Resend Text */}
          <div className="text-sm text-gray-500 text-end">
            Didn’t receive the code?{" "}
            <button
              type="button"
              className="text-[#4361EE] font-medium"
              onClick={() => alert("Code resent!")}
            >
              Resend
            </button>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div
        className="hidden md:flex w-1/2 h-screen items-center justify-center bg-[#4361EE] bg-cover bg-center"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <h1 className="text-white text-5xl lg:text-7xl font-bold">MLM</h1>
      </div>
    </div>
  );
};

export default VerifyOtpNo;
