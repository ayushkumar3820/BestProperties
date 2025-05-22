import React, { useState } from "react";
import Navbar from "./component/navbar";
import BottomBar from "./component/bottomBar";
import { useNavigate } from "react-router-dom";
import OurServices from "./component/ourServices";
import Searching from "./component/searching";
import { liveUrl, token } from "./component/url";

export default function Sucess() {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [messageData, setMessageData] = useState({
    message: "",
  });
  const handleChange = (e) => {
    setMessageData({ ...messageData, [e.target.name]: e.target.value });
  };
  const handleApi = () => {
    setClick(true);
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
          navigate("/");
          console.log(data);
        } else {
        }
      })
      .catch((error) => console.error(error));
  };
  return (
    <>
      <Navbar />
      <div className="container mt-24 mb-24 w-[450px] mx-auto">
        <div className="mt-5 px-4  border rounded-md border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
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
          <div className="text-center text-sm mt-4 capitalize w-1/1 p-2">
            Thank you for share your details our executive will Call within 24
            Hours to 48 Hours to provide you better solution.
          </div>
          <div className="text-green-800 mt-4 font-semibold">Message</div>
          <textarea
            onChange={handleChange}
            name="message"
            value={messageData.message}
            className="h-24 w-full border p-2"
          />
          {click && messageData == "" ? (
            <div className="text-red-600 py-2">Please fill Message</div>
          ) : null}
          <button
            onClick={handleApi}
            className="bg-red-600 text-white mb-4 text-center w-full px-10 p-2 rounded-md mt-5"
          >
            CONTINUE
          </button>
        </div>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
