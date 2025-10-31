// src/api/userApi.js
import axiosInstance from "../utils/axiosInstance";

export const authApi = {
  // Registration flow
  sendRegistrationOtp: async (userData) => {
    try {
      const response = await axiosInstance.post("/user/send-otp", userData);
      return response.data;
    } catch (error) {
      console.log("Error in sendRegistrationOtp:", error);
      throw error;
    }
  },

  verifyRegistrationOtp: async ({ email, otp, userId }) => {
    try {
      const response = await axiosInstance.post("/user/verify-otp", {
        email,
        otp,
        userId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
  resendRegistrationOtp: async ({ email, userId }) => {
    console.log({ email, userId });
    try {
      const response = await axiosInstance.post("/user/resend-otp", {
        email,
        userId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  setPassword: async ({ email, password, user_id }) => {
    try {
      const response = await axiosInstance.post("/user/set-password", {
        email,
        password,
        user_id,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  completeRegistration: async ({
    email,
    display_name,
    phone_number,
    ip_address,
    amount,
    payment_screenshot,
    referral_id,
    user_id,
  }) => {
    try {
      const response = await axiosInstance.post("/user/complete-registration", {
        email,
        display_name,
        phone_number,
        ip_address,
        amount,
        payment_screenshot,
        referral_id,
        user_id,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Login
  login: async (user_id, password) => {
    try {
      const response = await axiosInstance.post("/user/login", {
        user_id,
        password,
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Login failed";

      if (error.response) {
        // Server responded with error status
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage =
            error.response.statusText ||
            `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  // status check
  getStatus: async (email) => {
    try {
      const response = await axiosInstance.get(`/user/status/${email}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export const userApi = {
  searchUserByUserID: async (query) => {
    try {
      const response = await axiosInstance.get("/user/search", {
        params: { query }, // send query as GET param
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  getProfile: async (userId) => {
    try {
      const token = localStorage.getItem("accessToken"); // ✅ get token

      const response = await axiosInstance.post(
        "/user/get-profile",
        { userId }, // ✅ send in body
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token in headers
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
  // NEW: Update profile method
  updateProfile: async (updateData) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axiosInstance.post(
        "/user/update-profile",
        { updateData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axiosInstance.post(
        "/user/reset-password",
        { userId, currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};

export const teamApi = {
  getTeamDetails: async (userId) => {
    try {
      const token = localStorage.getItem("accessToken"); // get token

      const response = await axiosInstance.get(
        `/user/get-teamDetails/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token in headers
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};

export const referralApi = {
  getLevel1BonusSum: async (userId) => {
    try {
      const token = localStorage.getItem("accessToken"); // get token

      const response = await axiosInstance.post(
        "/user/get-referral-bonus-l1",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token in headers
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};
