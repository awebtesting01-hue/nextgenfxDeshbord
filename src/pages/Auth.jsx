import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/SignUp";
import Signup2 from "../components/SingUp2";
import img1 from "../assets/img1.png";
import Signup3 from "../components/Signup3";
import Signup4 from "../components/Signup4";
import PaymentSuccessful from "../components/PaymentSuccessful";
import ForgetPassword from "../components/ForgetPassword";
import ResetPassword from "../components/ResetPassword";
import VerifyOtp from "./VerifyOtp";
import VerifyOtpReset from "./VerifyOtpReset";

const Auth = () => {
  const location = useLocation();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerifyOtp, setShowVerifyOtp] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showotp, setShowotp] = useState(false);
  // Load values from localStorage
  const [showLogin, setShowLogin] = useState(() => {
    const stored = localStorage.getItem("showLogin");
    return stored !== null ? stored === "true" : true;
  });

  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("signupStep");
    return savedStep ? parseInt(savedStep) : 1;
  });

  // Handle back from verify page
  useEffect(() => {
    if (location.state?.fromVerify) {
      setShowLogin(false);
      localStorage.setItem("showLogin", "false");
    }
  }, [location]);

  // Keep localStorage in sync with state
  useEffect(() => {
    localStorage.setItem("signupStep", step.toString());
  }, [step]);

  useEffect(() => {
    localStorage.setItem("showLogin", showLogin.toString());
  }, [showLogin]);

  // Triggered when user completes step 1
  const handleNextStep = (dataFromStep1) => {
    console.log("Step 1 Data:", dataFromStep1);
    setStep(2);
  };
  const handleNextStep2 = (dataFromStep2) => {
    console.log("Step 2 Data:", dataFromStep2);
    setStep(3);
  };
  const handleNextStep3 = (dataFromStep3) => {
    console.log("Step 3 Data:", dataFromStep3);
    setStep(4);
  };

  const handleNextStep4 = (dataFromStep4) => {
    console.log("Step 4 Data:", dataFromStep4);
    setStep(5);
  };

  const handleNextStep5 = (dataFromStep5) => {
    console.log("Step 5 Data:", dataFromStep5);
    setStep(5);
  };
  const renderStepContent = () => {
    if (showForgotPassword) return <ForgetPassword />;
    if (showForgotPassword)
      return (
        <ForgetPassword
          onVerifyOtp={() => {
            setShowForgotPassword(false);
            setShowotp(true);
          }}
        />
      );

    if (showLogin)
      return <Login onForgotPassword={() => setShowForgotPassword(true)} />;
    if (showotp)
      return <VerifyOtp onResetPassword={() => setShowResetPassword(true)} />;
    if (showotp)
      return (
        <VerifyOtp
          onResetPassword={() => {
            setShowotp(false);
            setShowResetPassword(true);
          }}
        />
      );

    if (showResetPassword) {
      return <ResetPassword />;
    }

    if (showLogin) return <Login />;
    if (step === 1) return <Signup onNextStep={handleNextStep} />;
    if (step === 2) return <Signup2 onNextStep={handleNextStep2} />;
    if (step === 3) return <Signup3 onNextStep={handleNextStep3} />;
    if (step === 4) return <Signup4 onNextStep={handleNextStep4} />;
    if (step === 5) return <PaymentSuccessful />;
    if (step === 6) return <VerifyOtpReset on onNextStep={handleNextStep5} />;
    return null;
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row font-sans">
      {/* Left Section */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:px-16 lg:px-15 py-10 bg-white">
        {/* Toggle Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 w-full">
          {/* Login / Sign Up Toggle */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <div className="inline-flex bg-[#F5F5F5] p-1 rounded-full shadow-inner w-full md:w-auto max-w-md">
              <button
                className={`w-1/2 md:w-auto px-4 py-2 md:px-6 md:py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  showLogin ? "bg-[#4361EE] text-white" : "bg-white text-black"
                }`}
                onClick={() => {
                  setShowLogin(true);
                  setStep(1);
                }}
              >
                Login
              </button>
              <button
                className={`w-1/2 md:w-auto px-4 py-2 md:px-6 md:py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  !showLogin ? "bg-[#4361EE] text-white" : "bg-white text-black"
                }`}
                onClick={() => {
                  setShowLogin(false);
                  setStep(1);
                }}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Stepper */}
          {!showLogin && (
            <div className="flex justify-center md:justify-start w-full md:w-auto">
              <div className="flex flex-row items-center gap-3 mt-2 md:mt-0">
                {/* Step 1 */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= 1
                        ? "bg-[#4361EE] text-white"
                        : "border border-[#C3D4E9] text-[#94A3B8]"
                    }`}
                  >
                    1
                  </div>
                  <div className="w-6 h-[2px] bg-[#C3D4E9]" />
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 2
                        ? "bg-[#4361EE] text-white"
                        : "border border-[#C3D4E9] text-[#94A3B8]"
                    }`}
                  >
                    2
                  </div>
                  <div className="w-6 h-[2px] bg-[#C3D4E9]" />
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 3
                        ? "bg-[#4361EE] text-white"
                        : "border border-[#C3D4E9] text-[#94A3B8]"
                    }`}
                  >
                    3
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Form Content */}
        <div className="w-full">{renderStepContent()}</div>
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

export default Auth;
