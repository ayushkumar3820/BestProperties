import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function ReportModal({ isOpen, onClose }) {
  const isLoggedIn = Cookies.get("isLoggedIn") === "true";
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload;
      if (isLoggedIn) {
        payload = {
          comment: formData.comment,
          userId: Cookies.get("userId"), 
        };
      } else {
        payload = formData;
      }

      // 🔹 Replace with your backend API URl
      await axios.post("https://yourapi.com/api/report", payload);

      alert("Report submitted successfully!");
      setFormData({ name: "", number: "", comment: "" });
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">Report</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLoggedIn && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="number"
                placeholder="Your Number"
                value={formData.number}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </>
          )}
          <textarea
            name="comment"
            placeholder="Write your comment..."
            value={formData.comment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
