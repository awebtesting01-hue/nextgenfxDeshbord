import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Payment from "../icon/Payment";

const PaymentSuccessful = ({ onNextStep }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    // If onNextStep is provided, use it
    if (onNextStep) {
      onNextStep();
    } else {
      // Fallback navigation
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-9 w-full h-[70vh] bg-white px-5">
      {/* Checkmark Icon */}
      <Payment className="" />

      {/* Success Message */}
      <h2 className="text-3xl font-semibold text-center text-black">
        Payment <br /> Successful
      </h2>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-12 rounded-xl w-full max-w-lg transition duration-300"
      >
        Continue
      </button>
    </div>
  );
};

export default PaymentSuccessful;
