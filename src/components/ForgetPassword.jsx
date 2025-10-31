import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgetPassword = ({}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
   const navigate = useNavigate();

  const validateEmail = (email) => {
    // Basic email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };


 const handleSubmit = (e) => {
  e.preventDefault();

  if (!email.trim()) {
    setError("Email is required");
    return;
  }

  if (!validateEmail(email)) {
    setError("Please enter a valid email address");
    return;
  }

  setError("");
  setSubmitted(true);

  localStorage.setItem("resetEmail", email);

  // ✅ Redirect to verify OTP page with state
  navigate("/verify-otp", {
    state: {
      type: "email",
      value: email,
      from: "forget-password",
    },
  });
};

  return (
    <div className="flex items-center justify-center w-full h-[80vh]  px-3 bg-white">
      <div className="max-w-md w-full m-2">
        <h2 className="text-3xl font-semibold text-center mb-6">Forget Password?</h2>
        <p className="text-gray-500 text-center text-sm mb-12">
          Enter your registered email address below. We'll send you a link to reset your password.
        </p>

        {submitted ? (
        //   <p className="text-green-600 text-center font-medium">
        //     A reset link has been sent to your email!
        //   </p>
    //    <VerifyOtp
    
    <>p</>
    ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-blue-400 rounded-xl p-3 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="youremail123@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

         <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        //    onClick={handleVerfiyOtp}
          >
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
