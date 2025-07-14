import React, { useEffect } from "react";
import Navbar from "./component/navbar";
import BottomBar from "./component/bottomBar";
import { useNavigate } from "react-router-dom";
import OurServices from "./component/ourServices";
import Searching from "./component/searching";

export default function Sucess() {
  const navigate = useNavigate();

  // Auto-redirect to homepage after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

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
            Thank you for sharing your details. Our executive will contact you
            within 24 to 48 hours to provide a better solution.
          </div>
        </div>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
