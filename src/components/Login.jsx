// Frontend: Login.jsx
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/userApi";

const Login = ({ onForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authApi.login(formData.user_id, formData.password);

      // Store tokens and user data
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert(response.message || "Login successful!");
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[80vh] flex flex-col justify-start px-6 md:px-[60px] lg:px-[100px] py-10 bg-white ">
      <h2 className="text-[41px] text-center font-semibold mb-2">Login</h2>
      <p className="text-[17px] text-center text-gray-500 mb-6">
        Welcome back! Please login to your Account Now.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user_id" className="block mb-1 text-sm font-medium">
            User Id
          </label>
          <input
            type="user_id"
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            placeholder="User123"
            className="w-full p-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full p-[14px] border border-gray-300 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <h1
            className="text-md text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forget Password?
          </h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-[14px] rounded-2xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
