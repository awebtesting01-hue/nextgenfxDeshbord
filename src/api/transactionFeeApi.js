// transactionFeeApi.js
import axiosInstance from "../utils/axiosInstance";

export const transactionFeeApi = {
  // Fetch all transaction fees
  getAllFees: async () => {
    try {
      const response = await axiosInstance.get("/user/wallet-transaction-fees");
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch transaction fees";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.statusText ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  },

  // Create a new transaction fee
  createFee: async (fee) => {
    try {
      const response = await axiosInstance.post(
        "/admin/wallet-transaction-fees",
        fee
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Get a single transaction fee by ID
  getFee: async (id) => {
    try {
      const response = await axiosInstance.get(
        `/admin/wallet-transaction/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Update a transaction fee by ID
  updateFee: async (id, fee) => {
    try {
      const response = await axiosInstance.put(
        `/admin/wallet-transaction/${id}`,
        fee
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  // Delete a transaction fee by ID
  deleteFee: async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/wallet-transaction/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
