import React, { useState } from "react";
import Navbar from "./component/navbar";
import BottomBar from "./component/bottomBar";
import { useNavigate } from "react-router-dom";
import OurServices from "./component/ourServices";
import Searching from "./component/searching";
import { liveUrl, token } from "./component/url";

export default function Sucess() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [messageData, setMessageData] = useState({
    message: "",
  });

  // Handle input changes and validate message immediately
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessageData({ ...messageData, [name]: value });

    // Clear error if the user starts typing a valid message
    if (value.trim().length > 0) {
      setError("");
    }
  };

  // Validate message (not empty or just whitespace)
  const validateMessage = () => {
    if (!messageData.message.trim()) {
      setError("Please enter a message to continue.");
      return false;
    }
    return true;
  };

  const handleApi = () => {
    // Validate before making API call
    if (!validateMessage()) {
      return;
    }

    setLoader(true);
    fetch(`${liveUrl}get-any-message`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...messageData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setLoader(false);
          setMessageData({ message: "" }); // Clear form on success
          navigate("/");
          console.log(data);
        } else {
          setLoader(false);
          setError("Failed to submit. Please try again.");
        }
      })
      .catch((error) => {
        console.error(error);
        setLoader(false);
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-24 mb-24 w-[450px] mx-auto">
        <div className="mt-5 px-4 border rounded-md border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="flex justify-center items-center">
            <svg
              fill="green"
              className="h-14 w-14 mt-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
            </svg>
          </div>
          <div className="text-2xl text-center mt-3 font-bold text-red-600">
            Thank You
          </div>
          <div className="text-center text-sm mt-4 capitalize w-full p-2">
            Thank you for sharing your details. Our executive will contact you within 24 to 48 hours to provide a better solution.
          </div>
          <div className="text-green-800 mt-4 font-semibold">Message</div>
          <textarea
            onChange={handleChange}
            name="message"
            value={messageData.message}
            className="h-24 w-full border border-gray-400 p-2 rounded resize-none"
            placeholder="Enter your message here"
          />
          {error && <div className="text-red-600 py-2">{error}</div>}
          <button
            onClick={handleApi}
            className="bg-red-600 text-white mb-4 text-center w-full px-10 p-2 rounded-md mt-5"
            disabled={loader}
          >
            {loader ? "Submitting..." : "CONTINUE"}
          </button>
        </div>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}