import React, { useState } from "react";
import { FaDollarSign, FaUpload } from "react-icons/fa";

const Signup3 = ({ onNextStep, onBack }) => {
  const [amount, setAmount] = useState(999);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [showShortcut, setShowShortcut] = useState(false);

  const handleAmountChange = (value) => {
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setAmount(numericValue);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!agree) newErrors.agree = "You must agree to the terms";
    return newErrors;
  };

  

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Get existing data from localStorage
      const signupData = JSON.parse(localStorage.getItem("signupData")) || {};

      // Update with amount
      const updatedData = {
        ...signupData,
        amount,
      };

 

      // Store back in localStorage
      localStorage.setItem("signupData", JSON.stringify(updatedData));

      // Call onNextStep to proceed to next step (PaymentUpload)
      onNextStep(updatedData);
    }
  };

  const handleAlreadyPaidClick = () => {
    // Get existing data from localStorage
    const signupData = JSON.parse(localStorage.getItem("signupData")) || {};

    // Update with amount
    const updatedData = {
      ...signupData,
      amount,
    };

    // Store back in localStorage
    localStorage.setItem("signupData", JSON.stringify(updatedData));

    // Proceed directly to payment upload (step 6)
    // We'll use a custom event to communicate with the parent component
    window.dispatchEvent(new CustomEvent("proceedToPaymentUpload"));
  };

  return (
    <div className="w-full min-h-[70vh] flex flex-col justify-start px-4 sm:px-6 md:px-[60px] lg:px-[100px] sm:py-0 md:py-11 bg-white">
      <div className="max-w-md w-full space-y-8 py-10 mx-auto">
        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
            Payment Information
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-500">
            Complete your registration by making the payment
          </p>
        </div>

        {/* Already Paid Shortcut Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowShortcut(!showShortcut)}
            className="text-[#4361EE] text-sm font-medium hover:underline"
          >
            Already made the payment?
          </button>

          {showShortcut && (
            <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 mb-2">
                If you've already paid the amount, you can proceed directly to
                upload your payment screenshot.
              </p>
              <button
                type="button"
                onClick={handleAlreadyPaidClick}
                className="flex items-center justify-center w-full bg-[#4361EE] hover:bg-[#354ac0] text-white font-medium py-2 px-4 rounded-xl"
              >
                <FaUpload className="mr-2" />
                Upload Payment Proof
              </button>
            </div>
          )}
        </div>

        <form className="space-y-5" onSubmit={handleProceedToPayment}>
          {/* Amount */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Amount ($) <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap sm:flex-nowrap items-center">
              <div className="flex items-center flex-grow border border-gray-300 rounded-l-xl px-3 py-3 bg-white">
                <FaDollarSign className="text-gray-400 mr-2 mt-1" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full outline-none bg-transparent text-sm sm:text-base"
                  min={15}
                />
              </div>
              <div className="flex w-full sm:w-auto mt-2 sm:mt-0 sm:ml-0">
                <button
                  type="button"
                  onClick={() => setAmount((prev) => Math.max(prev - 1, 0))}
                  className="w-1/2 sm:w-auto border border-l-0 border-gray-300 sm:px-15 sm:py-3 md:px-18 md:py-3 bg-gray-100 hover:bg-gray-200"
                >
                  –
                </button>
                <button
                  type="button"
                  onClick={() => setAmount((prev) => prev + 1)}
                  className="w-1/2 sm:w-auto border border-l-0 border-gray-300 sm:px-15 sm:py-4 md:px-18 md:py-3 bg-gray-100 hover:bg-gray-200 rounded-r-xl"
                >
                  +
                </button>
              </div>
            </div>
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I agree to the{" "}
              <span className="underline">Terms & Conditions</span> and{" "}
              <span className="underline">Privacy Policy</span>
            </label>
          </div>
          {errors.agree && (
            <p className="text-red-600 text-sm mt-1">{errors.agree}</p>
          )}

          {/* Submit Button */}
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
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup3;
