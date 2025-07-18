import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import { liveUrl, token } from "./url";

export default function UserProfile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const response = await fetch(`${liveUrl}api/User/loginUser`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }), // Adjust the payload as per your API requirements
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserDetails(data.result); // Adjust according to the response structure
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <svg
          className="animate-spin h-10 w-10 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"
          />
        </svg>
      </div>
    );
  }

  if (!userDetails) {
    return <div>No user details found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name:
            </label>
            <p className="text-gray-900">{userDetails.name}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <p className="text-gray-900">{userDetails.email}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone:
            </label>
            <p className="text-gray-900">{userDetails.phone}</p>
          </div>
          {/* Add more fields as necessary */}
        </div>
      </div>
      <BottomBar />
    </>
  );
}
