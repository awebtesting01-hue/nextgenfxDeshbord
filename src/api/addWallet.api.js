// addWallet.api.js
import axiosInstance from "../utils/axiosInstance";

export const addWalletApi = {
  // Create a new add-wallet request (USER)
  createWallet: async (walletData) => {
    try {
      const response = await axiosInstance.post(
        "/user/create-add-wallet",
        walletData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getWallets: async () => {
    try {
      const response = await axiosInstance.get("/user/get-add-wallet");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getWalletById: async (id) => {
    try {
      const response = await axiosInstance.get(
        `/user/get-add-wallet/byId/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  updateWallet: async (id, data) => {
    try {
      const response = await axiosInstance.put(
        `/user/update-add-wallet/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  deleteWallet: async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/user/delete-add-wallet/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
