// pages/SignupPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SignUp from "./SignUp";
import SignUp2 from "./SingUp2";
import Signup3 from "./Signup3";
import Signup4 from "./Signup4";
import PaymentSuccessful from "./PaymentSuccessful";
import img1 from "../assets/img1.png";
import RegistrationSuccess from "./RegistrationSuccess";
import PaymentUpload from "./PaymentUpload";
import { authApi } from "../api/userApi";

const SignupPage = () => {
  const navigate = useNavigate();
  const { referralId } = useParams(); // Get referralId from URL
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const checkUserStatus = async () => {
      if (referralId) {
        localStorage.setItem("signupReferralId", referralId);
      }
      try {
        const email = localStorage.getItem("userEmail");

        if (!email) {
          return; // Exit early if no email found
        }
        if (email) {
          // Call getStatus API
          const statusResponse = await authApi.getStatus(email);
          // statusResponse.data.status should have otp_verified and isPaymentDone
          const status = statusResponse.data.status;
          if (status.otp_verified === true && status.isPaymentDone === false) {
            setStep(3); // Redirect to Signup3 (payment step)
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    checkUserStatus();
  }, []);

  // Add this useEffect to your SignupPage component
  useEffect(() => {
    const handleProceedToPaymentUpload = () => {
      setStep(6); // Navigate to PaymentUpload step
    };

    // Add event listener for the custom event
    window.addEventListener(
      "proceedToPaymentUpload",
      handleProceedToPaymentUpload
    );

    // Clean up the event listener
    return () => {
      window.removeEventListener(
        "proceedToPaymentUpload",
        handleProceedToPaymentUpload
      );
    };
  }, []);

  const handleNextStep = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate("/login");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <SignUp onNextStep={handleNextStep} onBack={handleBack} />;
      case 2:
        return <SignUp2 onNextStep={handleNextStep} onBack={handleBack} />;
      case 3:
        return <Signup3 onNextStep={handleNextStep} onBack={handleBack} />;
      case 4:
        return <Signup4 onNextStep={handleNextStep} onBack={handleBack} />;
      case 5:
        return <PaymentSuccessful onNextStep={() => setStep(6)} />;
      case 6:
        return <PaymentUpload onBack={handleBack} />;
      default:
        return <SignUp onNextStep={handleNextStep} onBack={handleBack} />;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row font-sans">
      {/* Left Section */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:px-16 lg:px-15 py-10 bg-white">
        <div className="flex justify-between items-center gap-4 mb-10 w-full">
          {/* Login/Signup Toggle */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <div className="inline-flex bg-[#F5F5F5] p-1 rounded-full shadow-inner w-full md:w-auto max-w-md">
              <button
                className="w-1/2 md:w-auto px-4 py-2 md:px-6 md:py-3 rounded-full text-sm font-medium bg-white text-black"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="w-1/2 md:w-auto px-4 py-2 md:px-6 md:py-3 rounded-full text-sm font-medium bg-[#4361EE] text-white"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <div className="flex flex-row items-center gap-3 mt-2 md:mt-0">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= stepNumber
                        ? "bg-[#4361EE] text-white"
                        : "border border-[#C3D4E9] text-[#94A3B8]"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className="w-6 h-[2px] bg-[#C3D4E9]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {renderStep()}
      </div>

      {/* Right Section */}
      <div
        className="hidden md:flex w-full md:w-1/2 h-[300px] md:h-screen items-center justify-center bg-[#4361EE] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://i.ibb.co/yBVcKd1B/signup.jpg')",
        }}
      ></div>
    </div>
  );
};

export default SignupPage;
