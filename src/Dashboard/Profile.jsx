import React, { useState, useEffect } from "react";
import { FaRegEdit, FaSave } from "react-icons/fa";
import {
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { userApi } from "../api/userApi";
import { uploadToCloudinary } from "../utils/coudinary";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    user_id: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState({});

  // 👁️ Password visibility toggle states
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userProfile"));
      const userId = userData?._id;

      if (userId) {
        const response = await userApi.getProfile(userId);
        setProfileData(response.data);

        const newFormData = {
          name: response.data.display_name || "",
          user_id: response.data.user_id || "",
          email: response.data.email || "",
          phone: response.data.phone_number || "",
        };

        setFormData(newFormData);
        setOriginalData(newFormData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Failed to load profile data" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size should be less than 5MB" });
      return;
    }

    try {
      setUploading(true);
      const cloudinaryResponse = await uploadToCloudinary(file);

      setNewAvatar(cloudinaryResponse.secure_url);

      setProfileData((prev) => ({
        ...prev,
        avatar: cloudinaryResponse.secure_url,
      }));

      setMessage({
        type: "success",
        text: "Avatar updated successfully! Don't forget to save changes.",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setMessage({ type: "error", text: "Failed to upload avatar" });
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const userData = JSON.parse(localStorage.getItem("userProfile"));
      const userId = userData?._id;

      const updateData = {
        display_name: formData.name,
        phone_number: formData.phone,
        email: formData.email,
        userId,
      };

      if (newAvatar) {
        updateData.avatar = newAvatar;
      }

      const response = await userApi.updateProfile(updateData);

      if (response.data) {
        const updatedUserData = { ...userData, ...response.data };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setOriginalData(formData);
      setNewAvatar(null);
      setIsEditing(false);

      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setPasswordErrors({});
    setMessage({ type: "", text: "" });

    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      setSaving(false);
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userProfile = JSON.parse(localStorage.getItem("userProfile"));
      const userId = userData?._id || userProfile?._id;

      await userApi.changePassword(
        userId,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setMessage({ type: "success", text: "Password updated successfully!" });
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage({
        type: "error",
        text: error || "Failed to update password",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setFormData(originalData);
      if (newAvatar) {
        setProfileData((prev) => ({
          ...prev,
          avatar: originalData.avatar,
        }));
        setNewAvatar(null);
      }
    }
    setIsEditing(!isEditing);
  };

  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.phone !== originalData.phone ||
      newAvatar !== null
    );
  };

  if (loading) {
    return (
      <div className="min-h-[87vh] bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[87vh] bg-white flex justify-center items-center px-4 py-5">
      <div className="bg-white rounded-2xl w-full max-w-2xl relative">
        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-center ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Change Password
            </button>
            <button
              onClick={toggleEditMode}
              className={`${
                isEditing
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2`}
            >
              {isEditing ? (
                <>
                  <AiOutlineClose size={16} />
                  Cancel
                </>
              ) : (
                <>
                  <FaRegEdit size={16} />
                  Edit Profile
                </>
              )}
            </button>
            {isEditing && hasChanges() && (
              <button
                onClick={handleProfileUpdate}
                disabled={saving}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaSave size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={profileData?.avatar || "https://i.pravatar.cc/150?img=7"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            {isEditing && (
              <label
                htmlFor="avatar-upload"
                className="absolute -top-2 -right-2 bg-[#3b82f6] p-1.5 rounded-full shadow-md cursor-pointer"
              >
                <FaRegEdit className="text-white text-xs" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={uploading}
                />
              </label>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <h2 className="mt-2 text-lg font-semibold">{formData.name}</h2>
          <p className="text-sm text-gray-500">{formData.user_id}</p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Name */}
          <div className="relative">
            <label className="text-sm text-gray-500 mb-1 block">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <FaRegEdit className="absolute right-3 top-9 text-gray-400" />
          </div>

          {/* ID */}
          <div className="relative">
            <label className="text-sm text-gray-500 mb-1 block">ID</label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              disabled
              className="w-full border rounded-xl px-4 py-2 pr-10 bg-gray-100"
            />
            <FaRegEdit className="absolute right-3 top-9 text-gray-400" />
          </div>

          {/* Email */}
          <div className="relative">
            <label className="text-sm text-gray-500 mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border rounded-xl px-4 py-2 pr-10 bg-gray-100"
            />
            <FaRegEdit className="absolute right-3 top-9 text-gray-400" />
          </div>

          {/* Phone */}
          <div className="relative">
            <label className="text-sm text-gray-500 mb-1 block">Phone</label>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={handlePhoneChange}
              disabled={!isEditing}
              inputProps={{
                name: "phone",
                required: true,
              }}
              inputStyle={{
                width: "100%",
                paddingLeft: "48px",
                paddingTop: "12px",
                paddingBottom: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "14px",
                backgroundColor: !isEditing ? "#f3f4f6" : "white",
              }}
              buttonStyle={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px 0 0 12px",
                backgroundColor: "white",
              }}
              containerStyle={{
                opacity: !isEditing ? 0.7 : 1,
              }}
              enableSearch
              searchPlaceholder="Search country"
            />
            <FaRegEdit className="absolute right-3 top-9 text-gray-400" />
          </div>
        </form>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <AiOutlineClose size={20} />
              </button>

              <h3 className="text-xl font-bold mb-4">Change Password</h3>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                {/* Current Password */}
                <div className="relative">
                  <label className="text-sm text-gray-500 mb-1 block">
                    Current Password
                  </label>
                  <input
                    type={showPassword.currentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        currentPassword: !prev.currentPassword,
                      }))
                    }
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {showPassword.currentPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>

                {/* New Password */}
                <div className="relative">
                  <label className="text-sm text-gray-500 mb-1 block">
                    New Password
                  </label>
                  <input
                    type={showPassword.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        newPassword: !prev.newPassword,
                      }))
                    }
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {showPassword.newPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="text-sm text-gray-500 mb-1 block">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {showPassword.confirmPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
