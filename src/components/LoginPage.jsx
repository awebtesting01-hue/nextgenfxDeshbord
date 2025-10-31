// pages/LoginPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/img1.png";
import ForgetPassword from "./ForgetPassword";
import Login from "./Login";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row font-sans">
      {/* Left Section */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:px-16 lg:px-15 py-10 bg-white">
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-[#F5F5F5] p-1 rounded-full shadow-inner">
            <button
              className="px-6 py-3 rounded-full text-sm font-medium bg-[#4361EE] text-white"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="px-6 py-3 rounded-full text-sm font-medium bg-white text-black"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>

        {showForgotPassword ? (
          <ForgetPassword onBack={() => setShowForgotPassword(false)} />
        ) : (
          <Login onForgotPassword={() => navigate("/forgot-password")} />
        )}
      </div>

      {/* Right Section */}
      <div
        className="hidden md:flex w-full md:w-1/2 h-[300px] md:h-screen items-center justify-center bg-[#4361EE] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/W4xW1VZk/login-background.jpg')",
        }}
      ></div>
    </div>
  );
};

export default LoginPage;
