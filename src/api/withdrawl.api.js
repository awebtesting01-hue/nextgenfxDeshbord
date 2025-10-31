import axiosInstance from "../utils/axiosInstance";

export const withdrawalFeeApi = {
  getAllFees: async () => {
    try {
      const response = await axiosInstance.get("/admin/get-all-withdrawl");
      // Ensure the response is always an array
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  calculateFee: (amount, feeRules) => {
    // Safety check
    console.log({ amount, feeRules });
    if (!Array.isArray(feeRules) || feeRules.length === 0) return 0;

    // Find the applicable fee rule
    const rule = feeRules.find(
      (r) =>
        typeof r.fromAmount === "number" &&
        amount >= r.fromAmount &&
        (r.toAmount === null || amount <= r.toAmount)
    );

    if (!rule) return 0;

    if (rule.type === "percent") {
      return (amount * rule.value) / 100;
    } else if (rule.type === "flat") {
      return rule.value;
    }

    return 0;
  },
};

export const withdrawalRequestApi = {
  /**
   * Create a new withdrawal request
   * @param {Object} withdrawalData - { userId, amount, method, walletAddress, fee, netAmount }
   * @returns {Object} Created withdrawal request
   */
  createWithdrawal: async (withdrawalData) => {
    try {
      const response = await axiosInstance.post(
        "/user/create-withdrawl",
        withdrawalData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Get all withdrawal requests
   * @returns {Array} List of withdrawal requests
   */
  getAllWithdrawals: async () => {
    try {
      const response = await axiosInstance.get("/user/get-all-withdrawl");
      // Assuming your backend wraps data in `data` field
      return response.data.data || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
