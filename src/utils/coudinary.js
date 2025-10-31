export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "swarasacademy");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dciy96dyu/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  return response.json();
};
