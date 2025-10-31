// src/api/walletApi.ts
import axiosInstance from "../utils/axiosInstance";




// Helper to attach auth header
const authHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const walletApi = {
  // Get all wallets
  getAll: async () => {
    try {
      const response = await axiosInstance.get(
        "/user/get-signup-wallet",
        authHeaders()
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.statusText ||
          error.message ||
          "Failed to fetch wallets"
      );
    }
  },


};
