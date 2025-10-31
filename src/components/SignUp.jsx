import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Signup1 from "../icon/Signup1";
import Email from "../icon/Email";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// import UserIdIcon from "../icon/UserIdIcon"; // You'll need to create this icon
import { authApi } from "./../api/userApi";

const SignUp = ({ onNextStep, onBack }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    userId: "",
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countrySelected, setCountrySelected] = useState(false);
  const phoneInputRef = useRef(null);

  useEffect(() => {
    const emailData = JSON.parse(localStorage.getItem("isEmailVerified"));
    if (emailData?.verified) {
      setEmail(emailData.value);
      setUserId(emailData.user_id);
      setIsEmailVerified(true);
    }
  }, []);

  const validateEmail = (email) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const validateUserId = (userId) => {
    return /^[a-zA-Z0-9_.]{3,20}$/.test(userId);
  };

  const handleEmailVerify = async () => {
    // Validate email
    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
      return;
    }

    // Validate userId
    if (!userId.trim()) {
      setErrors((prev) => ({ ...prev, userId: "User ID is required" }));
      return;
    }

    if (!validateUserId(userId)) {
      setErrors((prev) => ({
        ...prev,
        userId:
          "User ID must be 3-20 characters and can only contain letters, numbers, underscores, and periods",
      }));
      return;
    }


   

    setErrors((prev) => ({ ...prev, email: "", userId: "", phone: "" }));

    try {
      setIsLoading(true);

      // Call sendRegistrationOtp with email, phone_number, and userId
      await authApi.sendRegistrationOtp({
        email,
        phone_number: phone,
        user_id: userId,
      });

      // If OTP sent successfully, navigate to OTP verification
      navigate("/verify-otp", {
        state: {
          type: "email",
          value: email,
          phone: phone,
          user_id: userId,
          from: "signup",
        },
      });
    } catch (error) {
      // Handle specific error responses from sendRegistrationOtp
      console.log("Error sending OTP:", error.response);

      // Check if it's a 409 error
      if (error.response?.status === 409) {
        const errorData = error.response.data;
        console.log("Error data:", errorData);

        // If OTP verified but password not set
        if (errorData.data?.status?.setPassword === false) {
          // Store email in localStorage for SignUp2 component
          localStorage.setItem("userEmail", email);
          // Redirect to SignUp2 (password setup)
          onNextStep({ email });
          return;
        }

        // If payment not done
        if (errorData.data?.status?.isPaymentDone === false) {
          // Store email in localStorage for Signup3 component
          localStorage.setItem("userEmail", email);
          // Skip to Signup3 (payment step)
          onNextStep({ email });
          onNextStep({}); // Call twice to reach step 3
          return;
        }

        // If user already exists with completed registration
        if (errorData.message === "User already exists") {
          setErrors((prev) => ({
            ...prev,
            email: "User already exists. Please login instead.",
          }));
          return;
        }

        // If phone number already registered
        if (errorData.message === "Phone number already registered") {
          setErrors((prev) => ({
            ...prev,
            phone:
              "Phone number already registered. Please use a different number.",
          }));
          return;
        }

        // If user ID already exists
        if (errorData.message === "User ID already taken") {
          setErrors((prev) => ({
            ...prev,
            userId:
              "This user ID is already taken. Please choose a different one.",
          }));
          return;
        }
      }

      // For other errors, show the error message
      setErrors((prev) => ({
        ...prev,
        email:
          error.response?.data?.message || error.message || "An error occurred",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { fullName: "", email: "", phone: "", userId: "" };

    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      hasError = true;
    }
    if (!isEmailVerified) {
      newErrors.email = "Please verify your email";
      hasError = true;
    }
    if (!phone) {
      newErrors.phone = "Phone number is required";
      hasError = true;
    }
    if (!countrySelected) {
      newErrors.phone = "Please select a country code first";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      // Store form data in localStorage
      localStorage.setItem(
        "signupData",
        JSON.stringify({
          fullName,
          email,
          user_id: userId,
          phone: phone,
        })
      );

      onNextStep({
        fullName,
        email,
        user_id: userId,
        phone: phone,
      });
    }
  };

  const handlePhoneChange = (value, country) => {
    setPhone(value);

    // Mark country as selected when user interacts with the dropdown
    if (!countrySelected && country) {
      setCountrySelected(true);
    }

    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handlePhoneBlur = (e, country) => {
    // Basic validation - check if phone number is provided
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: "Phone number is required" }));
    } else if (!countrySelected) {
      setErrors((prev) => ({
        ...prev,
        phone: "Please select a country code first",
      }));
    }
  };

  const handleCountryChange = (country, e, formattedValue) => {
    // Set country as selected when user chooses from dropdown
    setCountrySelected(true);

    // Clear phone error related to country selection
    if (errors.phone && errors.phone.includes("country")) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  return (
    <div className="w-full md:h-[80vh] px-4 sm:px-6 md:px-12 sm:py-0 md:py-10 bg-white flex flex-col items-center">
      <div className="mb-8 w-full max-w-lg">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-2">
          Sign Up
        </h2>
        <p className="text-gray-500 text-center text-base sm:text-lg">
          Join us to access your dashboard.
        </p>
      </div>

      <form className="w-full max-w-lg space-y-6" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div>
          <label htmlFor="fullname" className="block mb-1 text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border border-[#C3D4E9] rounded-xl px-3 bg-white">
            <div className="flex items-center gap-2">
              <Signup1 />
              <span className="text-gray-400">|</span>
            </div>
            <input
              type="text"
              id="fullname"
              placeholder="Bikram Kumar"
              className="w-full p-3 outline-none bg-transparent text-sm disabled:opacity-50"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEmailVerified}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* User ID */}
        <div>
          <label htmlFor="userid" className="block mb-1 text-sm font-medium">
            User ID <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border border-[#C3D4E9] rounded-xl px-3 bg-white">
            <div className="flex items-center gap-2">
              {/* <UserIdIcon /> */}
              <span className="text-gray-400">|</span>
            </div>
            <input
              type="text"
              id="userid"
              placeholder="yourusername"
              className="w-full p-3 outline-none bg-transparent text-sm"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isEmailVerified}
            />
          </div>
          {errors.userId && (
            <p className="text-sm text-red-500 mt-1">{errors.userId}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Choose a unique username (3-20 characters, letters, numbers, _, .)
          </p>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border border-[#C3D4E9] rounded-xl px-3 bg-white">
            <div className="flex items-center gap-2">
              <Email />
              <span className="text-gray-400">|</span>
            </div>
            <input
              type="email"
              id="email"
              placeholder="yourmail123@gmail.com"
              className="w-full p-3 outline-none bg-transparent text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEmailVerified}
            />
            {isEmailVerified ? (
              <FaCheckCircle className="text-green-500 ml-2" size={18} />
            ) : (
              <button
                type="button"
                className="text-[#4361EE] font-medium text-sm px-3"
                onClick={handleEmailVerify}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            )}
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block mb-1 text-sm font-medium">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <PhoneInput
              country={"us"}
              value={phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              onCountryChange={handleCountryChange}
              disabled={!isEmailVerified}
              inputProps={{
                name: "phone",
                required: true,
                id: "phone",
                disabled: !isEmailVerified,
              }}
              inputStyle={{
                width: "100%",
                paddingLeft: "48px",
                paddingTop: "12px",
                paddingBottom: "12px",
                border: "1px solid #C3D4E9",
                borderRadius: "12px",
                fontSize: "14px",
                opacity: !isEmailVerified ? 0.5 : 1,
              }}
              buttonStyle={{
                border: "1px solid #C3D4E9",
                borderRadius: "12px 0 0 12px",
                backgroundColor: "white",
                opacity: !isEmailVerified ? 0.5 : 1,
              }}
              dropdownStyle={{
                borderRadius: "12px",
                marginTop: "4px",
              }}
              containerStyle={{
                opacity: !isEmailVerified ? 0.5 : 1,
              }}
              enableSearch
              searchPlaceholder="Search country"
              disableCountryCode={false}
            />
            {!countrySelected && (
              <div className="absolute inset-0 pointer-events-none bg-white opacity-70 rounded-xl"></div>
            )}
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
          {!countrySelected && (
            <p className="text-xs text-gray-500 mt-1">
              Please select a country code first
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-between">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="text-[#4361EE] font-medium text-sm px-4 py-2"
            >
              Back
            </button>
            <button
              type="button"
              className={`bg-red-500 text-white font-medium py-2 px-6 rounded-xl transition
    ${
      !isEmailVerified ? "opacity-50 cursor-not-allowed" : "hover:bg-[#354ac0]"
    }`}
              disabled={!isEmailVerified}
              onClick={() => {
                localStorage.removeItem("isEmailVerified");
                window.location.reload();
                // optionally, you can update state too if needed
              }}
            >
              Reset
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="bg-[#4361EE] mr-4 hover:bg-[#354ac0] text-white font-medium py-2 px-6 rounded-xl disabled:opacity-50"
              disabled={!isEmailVerified || !phone || !countrySelected}
            >
              Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
