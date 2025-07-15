import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";
import BottomBar from "./bottomBar";

const generateRandomNumber = () => Math.floor(Math.random() * 20);
const generateRandomOperation = () => (Math.random() > 0.5 ? "+" : "-");

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [num1, setNum1] = useState(generateRandomNumber());
  const [num2, setNum2] = useState(generateRandomNumber());
  const [operation, setOperation] = useState(generateRandomOperation());
  const [answer, setAnswer] = useState("");
  const [email, setEmail] = useState("");
  const [click, setClick] = useState(false);

  const checkAnswer = () => {
    const expectedAnswer = operation === "+" ? num1 + num2 : num1 - num2;
    return parseInt(answer) === expectedAnswer;
  };

  const handleChange = (event) => setAnswer(event.target.value);

  const regenerateCaptcha = () => {
    setNum1(generateRandomNumber());
    setNum2(generateRandomNumber());
    setOperation(generateRandomOperation());
    setAnswer("");
  };

  const handleSubmit = () => {
    setClick(true);
    setLoader(true);

    if (!email || !answer) {
      setMessage("Please fill all required fields");
      setLoader(false);
      return;
    }

    if (!checkAnswer()) {
      setMessage("Incorrect captcha");
      setLoader(false);
      return;
    }

    
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`${liveUrl}api/User/forgetPassword`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        if (data.status === "done") {
          navigate("/success"); 
        }
      })
      .catch((error) => {
        console.error("Error in handleSubmit:", error);
        setMessage("An error occurred. Please try again.");
      })
      .finally(() => setLoader(false));
  };

  return (
    <>
      <Navbar />
      <div className="w-full max-w-md mx-auto p-4">
        <h6 className="text-center text-2xl font-semibold text-green-600">
          Forget Password
        </h6>
        <div className="text-red-600 text-center mb-4">{message}</div>
        <div className="mt-2 mb-2 font-bold">Email</div>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="border border-green-800 p-2 w-full rounded-md"
        />
        {click && email === "" && (
          <div className="text-red-600 mt-2">Required to fill email</div>
        )}
        <div className="mt-4">
          <div className="flex items-center">
            <p className="font-bold w-3/4">
              Captcha: {num1} {operation} {num2}?
            </p>
            <input
              className="border border-green-800 p-2 rounded-md w-1/4"
              type="text"
              value={answer}
              onChange={handleChange}
            />
          </div>
          <button
            className="text-red-600 font-semibold underline w-full text-right mt-2"
            onClick={regenerateCaptcha}
          >
            Regenerate
          </button>
          {click && answer.length <= 0 && (
            <div className="text-red-600 mt-2">
              Required to fill the captcha
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-red-600 w-full p-2 mt-4 rounded flex justify-center items-center text-white font-bold min-h-[40px]"
          disabled={loader}
        >
          {loader ? (
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          ) : (
            "Submit"
          )}
        </button>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}