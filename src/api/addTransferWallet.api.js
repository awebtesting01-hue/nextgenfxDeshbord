// addWallet.api.js
import axiosInstance from "../utils/axiosInstance";

export const trasnferAddWalletApi = {
  // Create a new add-wallet request (USER)
  createTransferWallet: async (walletData) => {
    try {
      const response = await axiosInstance.post(
        "/user/create-add-wallet/transfer",
        walletData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getTransferWallets: async () => {
    try {
      const response = await axiosInstance.get("/user/get-add-wallet/transfer");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getTransferWalletById: async (id) => {
    try {
      const response = await axiosInstance.get(
        `/user/get-add-wallet/byId/transfer/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  updateTransferWallet: async (id, data) => {
    try {
      const response = await axiosInstance.put(
        `/user/update-add-wallet/transfer/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  deleteTransferWallet: async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/user/delete-add-wallet/transfer/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
