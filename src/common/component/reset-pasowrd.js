import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";
import BottomBar from "./bottomBar";

export default function ResetPassword() {
  const { tokenPath } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    console.log("🚀 Sending request to reset password");

    try {
      const res = await fetch(`${liveUrl}api/User/resetPassword`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: tokenPath,
          password: password,
        }),
      });

      const data = await res.json();
      console.log("🔁 API Response:", data);

      if (data.message?.toLowerCase().includes("reset")) {
        console.log("✅ Password reset successful");
        alert("Password has been reset");
        navigate("/login");
      } else {
        console.log("❌ Reset failed:", data);
        alert(data.message || "Reset failed");
      }
    } catch (error) {
      console.error("🔥 API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center bg-gray-100 p-4 pt-10 h-[63vh]">
        <div className="bg-white px-8 py-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-black text-center mb-6">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-medium">New Password</label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded text-white font-medium ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>

      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
