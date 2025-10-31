import React from "react";
import { useNavigate } from "react-router-dom";

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md p-8">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-2">Registration Complete!</h2>
        <p className="text-gray-600 mb-6">
          Your account is pending admin approval. You'll receive an email once
          your account is activated.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#4361EE] text-white py-2 px-6 rounded-xl"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
