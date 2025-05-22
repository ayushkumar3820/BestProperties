import React, { useState } from "react";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import { useNavigate } from "react-router-dom";

export default function OtpScreen() {
  const Navigate = useNavigate();
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  function handleOtpChange(event, index) {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = event.target.value;
    setOtpValues(newOtpValues);
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto flex justify-center items-center">
        <div className="mt-5 border px-2 py-2">
          <div className="font-bold text-2xl text-center">Welcome back,</div>
          <div className="text-2xl text-center">
            Your number is already register with us.{" "}
          </div>
          <div className="text-2xl text-center">Please login to continue</div>
          <div className="mt-5">
            <div className="font-bold text-center text-2xl mb-5">+91-8210574144</div>
            <div className="mt-5 mb-5 text-center">Enter your 4 digit OTP</div>
          </div>
          <div className="flex  items-center justify-center  gap-2">
            <input
              className="border  border-black text-center h-12 w-12 "
              type="text"
              maxLength={1}
              value={otpValues[0]}
              onChange={(event) => handleOtpChange(event, 0)}
            />
            <input
              className="border border-black text-center h-12 w-12 "
              type="text"
              maxLength={1}
              value={otpValues[1]}
              onChange={(event) => handleOtpChange(event, 1)}
            />
            <input
              className="border border-black text-center h-12 w-12 "
              type="text"
              maxLength={1}
              value={otpValues[2]}
              onChange={(event) => handleOtpChange(event, 2)}
            />
            <input
              className="border border-black text-center h-12 w-12 "
              type="text"
              maxLength={1}
              value={otpValues[3]}
              onChange={(event) => handleOtpChange(event, 3)}
            />
          </div>
          <div className="flex justify-center items-center mt-2">
            <div className="">Have't recieved yet? </div>
            <button className="text-blue-400">Resend OTP</button>
          </div>
          <button
         onClick={() => {
            Navigate("/aboutproperty");
          }}
            className="bg-blue-600 p-2 mt-4 w-full text-white font-bold text-center "
          >
            Verify & Login
          </button>
          <button className="bg-blue-600 p-2 mt-4 text-white font-bold w-full text-center ">
            Verify Via missed Call
          </button>
          <button  onClick={() => {
            Navigate("/login");
          }} className="text-blue-500 p-2 w-full text-center ">
            Or Login Via E-mail/Username
          </button>
        </div>
      </div>

      <BottomBar />
    </div>
  );
}
