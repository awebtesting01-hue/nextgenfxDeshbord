import React from 'react';
import { useNavigate } from 'react-router-dom';
import Payment from '../icon/Payment';
import img1 from "../assets/img1.png";

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/'); // Change this path as needed
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-white">
      {/* Left Section: Success Message */}
      <div className="flex flex-col items-center justify-center gap-8 w-full md:w-1/2 px-6 py-12">
        {/* Payment Icon */}
        <Payment className="w-24 h-24" />

        {/* Message */}
        <h2 className="text-5xl font-semibold text-center text-black">
          Your Password <br />  Has Been Reset
        </h2>

        {/* Button */}
        <button
          onClick={handleContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-14 rounded-xl w-full max-w-lg transition duration-300"
        >
          Continue
        </button>
      </div>

      {/* Right Section: Background Image */}
      <div
        className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-[#4361EE] bg-cover bg-center"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <h1 className="text-white text-5xl lg:text-7xl font-bold">MLM</h1>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
