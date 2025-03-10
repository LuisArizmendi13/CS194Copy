import React, { useState } from "react";
import axios from "axios";

const UploadMenuPopup = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [menuName, setMenuName] = useState(""); // ✅ Menu Name Input
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    if (!menuName.trim()) return alert("Please enter a menu name!"); // ✅ Ensure menu name is provided

    setLoading(true);
    setDone(false);

    const token = localStorage.getItem("cognitoToken");
    if (!token) {
      alert("❌ Authentication token missing. Please sign in again.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("menuName", menuName); // ✅ Send menu name

    try {
      console.log("📤 Uploading file to backend...");
      const response = await axios.post("http://localhost:5000/api/upload-menu", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      console.log("✅ Response from backend:", response.data.message);
      setDone(true);
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      alert("Upload failed. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Upload Menu</h2>

        <input
          type="text"
          placeholder="Enter Menu Name"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-2 border rounded mb-4" />
        
        {loading ? (
          <p className="text-blue-500 text-center">Uploading...</p>
        ) : done ? (
          <p className="text-green-500 text-center">✅ Done Processing!</p>
        ) : (
          <button onClick={handleUpload} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Upload
          </button>
        )}

        <button onClick={onClose} className="w-full mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  );
};

export default UploadMenuPopup;
