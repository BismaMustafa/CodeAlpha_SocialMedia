import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadProfilePic } from "../services/userService";

const UploadProfilePic = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      return alert("Please select an image to upload.");
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await uploadProfilePic(formData);
      alert("Profile picture updated");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Profile picture update failed");
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-[#fdf3ff] flex items-start justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Upload Profile Picture</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0])}
            className="mb-4"
          />

          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}

          <button
            type="submit"
            className="w-full bg-violet-600 text-white rounded-lg py-2"
          >
            Save Profile Picture
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProfilePic;
