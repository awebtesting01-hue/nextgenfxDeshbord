import React, { useEffect, useState } from "react";
import { addWalletApi } from "../api/addWallet.api";
import { uploadToCloudinary } from "../utils/coudinary";
import { transactionFeeApi } from "../api/transactionFeeApi";
import { trasnferAddWalletApi } from "../api/addTransferWallet.api";

const UserWalletRequests = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [addWallets, setAddWallets] = useState([]);
  const [transferWallets, setTransferWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [fees, setFees] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user profile from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setProfile(user);
  }, []);

  // Fetch transaction fees
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const data = await transactionFeeApi.getAllFees();
        const feeArray = data?.data?.fees || data?.fees || [];
        setFees(feeArray);
      } catch (err) {
        console.error("Failed to fetch fees:", err);
      }
    };
    fetchFees();
  }, []);

  // Fetch add wallets
  useEffect(() => {
    const fetchAddWallets = async () => {
      if (!profile || !profile._id) return;

      setLoading(true);
      try {
        const data = await addWalletApi.getWalletById(profile._id);
        setAddWallets(data?.data || []);
      } catch (err) {
        console.error("Failed to fetch add wallets:", err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "add") {
      fetchAddWallets();
    }
  }, [profile, activeTab]);

  // Fetch transfer wallets
  useEffect(() => {
    const fetchTransferWallets = async () => {
      if (!profile || !profile._id) return;

      setLoading(true);
      try {
        const data = await trasnferAddWalletApi.getTransferWalletById(
          profile._id
        );
        setTransferWallets(data?.data || []);
      } catch (err) {
        console.error("Failed to fetch transfer wallets:", err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "transfer") {
      console.log({ activeTab });
      fetchTransferWallets();
    }
  }, [profile, activeTab]);

  // Get current wallets based on active tab
  const currentWallets = activeTab === "add" ? addWallets : transferWallets;

  // Calculate fees when amount changes in edit modal
  useEffect(() => {
    if (!selectedWallet || fees.length === 0) return;

    const amount = parseFloat(formData.totalPayable) || 0;

    const applicableFee = fees.find(
      (fee) =>
        amount >= fee.fromAmount &&
        (fee.toAmount === null || amount <= fee.toAmount)
    );

    let charge = 0;
    if (applicableFee) {
      if (applicableFee.type === "flat") {
        charge = applicableFee.value;
      } else if (applicableFee.type === "percent") {
        charge = (amount * applicableFee.value) / 100;
      }
    }

    setFormData((prev) => ({
      ...prev,
      transactionCharge: charge,
      receiveAmount: Math.max(amount - charge, 0),
    }));
  }, [formData.totalPayable, fees, selectedWallet]);

  // Open modal to edit
  const handleEdit = (wallet) => {
    setSelectedWallet(wallet);
    setFormData({ ...wallet });
    setFiles([]);
  };

  // Close modal
  const handleClose = () => {
    setSelectedWallet(null);
    setFormData({});
    setFiles([]);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection for re-upload
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    const filteredFiles = selectedFiles.filter((file) => {
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= maxSize;

      if (!isValidType) {
        alert(`File ${file.name} is not a JPG, JPEG, or PNG file`);
        return false;
      }

      if (!isValidSize) {
        alert(`File ${file.name} exceeds the 5MB size limit`);
        return false;
      }

      return true;
    });

    setFiles((prev) => [...prev, ...filteredFiles]);
  };

  // Remove selected file (new uploads)
  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove existing screenshot
  const handleRemoveExistingScreenshot = (index) => {
    const updatedScreenshots = [...formData.screenshotUrls];
    updatedScreenshots.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      screenshotUrls: updatedScreenshots,
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      let uploadedUrls = [...formData.screenshotUrls];

      if (files.length > 0) {
        for (const file of files) {
          const res = await uploadToCloudinary(file);
          uploadedUrls.push(res.secure_url);
        }
      }

      const payload = {
        ...formData,
        screenshotUrls: uploadedUrls,
      };

      // Use appropriate API based on wallet type
      if (activeTab === "add") {
        await addWalletApi.updateWallet(selectedWallet._id, payload);
      } else {
        await trasnferAddWalletApi.updateWallet(selectedWallet._id, payload);
      }

      alert("Wallet updated successfully ✅");

      // Refresh the wallet list after update
      if (profile && profile._id) {
        if (activeTab === "add") {
          const data = await addWalletApi.getWalletById(profile._id);
          setAddWallets(data?.data || []);
        } else {
          const data = await trasnferAddWalletApi.getWalletById(profile._id);
          setTransferWallets(data?.data || []);
        }
      }

      handleClose();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update wallet");
    }
  };

  // Function to get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Truncate long text for table display
  const truncateText = (text, maxLength = 30) => {
    if (!text) return "-";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wallet Requests</h1>
          <p className="text-gray-600 mt-2">View and manage your wallet requests</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("add")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === "add"
                    ? "border-blue-600 text-blue-600 bg-blue-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Add Wallet Requests
              </button>
              {/* Uncomment if you want to enable transfer tab */}
              {/* <button
                onClick={() => setActiveTab("transfer")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === "transfer"
                    ? "border-blue-600 text-blue-600 bg-blue-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Transfer Wallet Requests
              </button> */}
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading wallet requests...</span>
                </div>
              </div>
            ) : currentWallets.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">
                  No {activeTab === "add" ? "add wallet" : "transfer wallet"} requests found.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Sl No
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          User Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Amount Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          User Remarks
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Admin Remarks
                        </th>
                        {activeTab === "transfer" && (
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Receiver Details
                          </th>
                        )}
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentWallets.map((wallet, index) => (
                        <tr key={wallet._id} className="hover:bg-gray-50/50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {wallet.userId?.display_name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {wallet.userId?.email || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-900">
                                <span className="font-medium">Payable:</span> $
                                {wallet.totalPayable}
                              </div>
                              <div className="text-sm text-gray-900">
                                <span className="font-medium">Charge:</span> $
                                {wallet.transactionCharge}
                              </div>
                              <div className="text-sm text-gray-900">
                                <span className="font-medium">Receive:</span> $
                                {wallet.receiveAmount}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <div className="text-sm text-gray-900">
                              {truncateText(wallet.user_remarks)}
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <div className="text-sm text-gray-900">
                              {truncateText(wallet.admin_remarks)}
                            </div>
                          </td>
                          {activeTab === "transfer" && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900">
                                {wallet.otherUserId?.display_name || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {wallet.otherUserId?.email || "N/A"}
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                                wallet.status
                              )}`}
                            >
                              {wallet.status?.charAt(0).toUpperCase() + wallet.status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(wallet.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                wallet.status === "approved" ||
                                wallet.status === "rejected"
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                              }`}
                              disabled={
                                wallet.status === "approved" ||
                                wallet.status === "rejected"
                              }
                              onClick={() => handleEdit(wallet)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {selectedWallet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                <h3 className="text-xl font-bold text-white">
                  Edit {activeTab === "add" ? "Add" : "Transfer"} Wallet Request
                </h3>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-blue-200 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Total Payable ($)
                    </label>
                    <input
                      type="number"
                      name="totalPayable"
                      value={formData.totalPayable || 0}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Transaction Charge ($)
                    </label>
                    <input
                      type="number"
                      name="transactionCharge"
                      value={formData.transactionCharge || 0}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Receive Amount ($)
                    </label>
                    <input
                      type="number"
                      name="receiveAmount"
                      value={formData.receiveAmount || 0}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <input
                      type="text"
                      value={formData.status?.charAt(0).toUpperCase() + formData.status?.slice(1)}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 capitalize"
                    />
                  </div>
                </div>

                {activeTab === "transfer" && formData?.otherUserId && (
                  <div className="mb-6 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                    <label className="block text-sm font-semibold text-blue-700 mb-3">
                      Receiver Details
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-blue-600 font-medium">Name:</span>
                        <p className="text-sm font-semibold text-gray-900">
                          {formData.otherUserId.display_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-blue-600 font-medium">Email:</span>
                        <p className="text-sm font-semibold text-gray-900">
                          {formData.otherUserId.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-blue-600 font-medium">User ID:</span>
                        <p className="text-sm font-semibold text-gray-900">
                          {formData.otherUserId.user_id || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      User Remarks
                    </label>
                    <textarea
                      name="user_remarks"
                      value={formData.user_remarks || ""}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter user remarks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Admin Remarks
                    </label>
                    <textarea
                      name="admin_remarks"
                      value={formData.admin_remarks || ""}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter admin remarks"
                      disabled
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Existing Screenshots
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {formData.screenshotUrls && formData.screenshotUrls.length > 0 ? (
                      formData.screenshotUrls.map((url, i) => (
                        <div key={i} className="relative group">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200 border border-blue-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 15.5v-11a2 2 0 012-2h16a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                            </svg>
                            Screenshot {i + 1}
                          </a>
                          <button
                            onClick={() => handleRemoveExistingScreenshot(i)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                            title="Remove screenshot"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 italic">No screenshots available</span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Add New Screenshots
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50/50">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">JPG, JPEG, PNG (MAX. 5MB each)</p>
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                      >
                        Choose Files
                      </label>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Files to Upload:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {files.map((file, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3 truncate">
                              <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm text-gray-700 truncate">{file.name}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(i)}
                              className="text-red-500 hover:text-red-700 ml-3 flex-shrink-0 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                              title="Remove file"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-8 py-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWalletRequests;