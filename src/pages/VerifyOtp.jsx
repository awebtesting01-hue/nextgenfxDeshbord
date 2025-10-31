import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/userApi";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputsRef = useRef([]);
  const [target, setTarget] = useState("");
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [referralId, setReferralId] = useState("");

  // Initialize OTP data and referralId

  console.log({ referralId });
  useEffect(() => {
    const state = location.state || {};
    if (state.type && state.value && state.user_id) {
      setTarget(state.value);
      setUserId(state.user_id);
      setFrom(state.from || "");
      setReferralId(state.referralId || "");
    } else {
      // Check localStorage fallback
      const savedReferralId = localStorage.getItem("signupReferralId") || "";
      const savedEmail = localStorage.getItem("signupEmail");
      const savedUserId = localStorage.getItem("signupUserId");

      if (savedEmail && savedUserId) {
        setTarget(savedEmail);
        setUserId(savedUserId);
        setReferralId(savedReferralId);
        setFrom("signup");
      } else {
        navigate("/signup"); // fallback
      }
    }
  }, [location, navigate]);

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setOtp((prev) => {
      const updated = [...prev];
      updated[idx] = value[0] || "";
      return updated;
    });

    if (value && idx < otp.length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleVerifyClick = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      alert("Please enter all 4 digits of the OTP.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await authApi.verifyRegistrationOtp({
        email: target,
        otp: enteredOtp,
        userId: userId,
      });

      if (response.statusCode === 200 && response.success) {
        localStorage.setItem(
          "isEmailVerified",
          JSON.stringify({
            value: target,
            verified: true,
            user_id: response.data.userId,
          })
        );

        // Navigate back to signup or dashboard
        if (from === "signup") {
          if (referralId) {
            navigate(`/signup/${referralId}`);
          } else {
            navigate("/signup");
          }
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("OTP verification failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.resendRegistrationOtp({
        email: target,
        userId,
      });

      if (response.statusCode === 200 && response.success) {
        alert("OTP sent successfully");
        setOtp(["", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-10 md:px-16 lg:px-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-2">
            Verify OTP
          </h2>
          <p className="text-gray-500 text-base md:text-lg">
            We sent a code to{" "}
            <span className="font-semibold text-black">{target}</span>
          </p>
        </div>

        {/* OTP Input */}
        <form className="w-full max-w-md mx-auto space-y-6">
          <div className="flex justify-center gap-6">
            {otp.map((val, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val}
                autoComplete="one-time-code"
                className="w-12 h-12 border border-[#C3D4E9] rounded-xl text-center text-xl focus:outline-none focus:border-[#4361EE]"
                onChange={(e) => handleChange(e, i)}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="button"
            onClick={handleVerifyClick}
            className="w-full bg-[#4361EE] text-white py-3 rounded-2xl font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Continue"}
          </button>

          <div className="text-sm text-gray-500 text-center md:text-end">
            Didn't receive the code?{" "}
            <button
              type="button"
              className="text-[#4361EE] font-medium"
              onClick={handleResendOtp}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Resend"}
            </button>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div
        className="hidden md:flex w-full md:w-1/2 h-[300px] md:h-screen items-center justify-center bg-[#4361EE] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://i.ibb.co/GvxMTKFW/Otp-verify.png')",
        }}
      ></div>
    </div>
  );
};

export default VerifyOtp;
