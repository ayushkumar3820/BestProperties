// src/components/HomeLoanPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";
import BottomBar from "./bottomBar";

const generateRandomNumber = () => Math.floor(Math.random() * 20);
const generateRandomOperation = () => (Math.random() > 0.5 ? "+" : "-");

export default function HomeLoanPage() {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [num1, setNum1] = useState(generateRandomNumber());
  const [num2, setNum2] = useState(generateRandomNumber());
  const [operation, setOperation] = useState(generateRandomOperation());
  const [answer, setAnswer] = useState("");
  const [loanData, setLoanData] = useState({
    name: "",
    loanAmount: "",
    mobile: "",
    description: "",
  });

  const checkAnswer = () =>
    parseInt(answer) === (operation === "+" ? num1 + num2 : num1 - num2);

  const handleLoan = (e) =>
    setLoanData({ ...loanData, [e.target.name]: e.target.value });

  const handleLoans = () => {
    setClick(true);
    setLoader(true);
    if (!loanData.name || !loanData.loanAmount || !loanData.mobile || !answer) {
      setMessage("Please fill all required fields");
      setLoader(false);
      return;
    }
    if (loanData.mobile.length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number");
      setLoader(false);
      return;
    }
    if (!checkAnswer()) {
      setMessage("Incorrect captcha");
      setLoader(false);
      return;
    }
    fetch(`${liveUrl}add-loan-info`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loanData),
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("panelTitle");
          localStorage.removeItem("responseData");
          navigate("/login");
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        localStorage.setItem("responseData", JSON.stringify(data.result));
        if (data.status === "done") {
          navigate("/success");
        }
      })
      .catch((error) => {
        console.error("Error in handleLoans:", error);
        if (error.message !== "Unauthorized")
          setMessage("An error occurred. Please try again.");
      })
      .finally(() => setLoader(false));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h1 className="text-center text-3xl font-semibold text-green-600">
                Apply for Home Loan
              </h1>
              <p className="text-center text-gray-600 mt-2">
                Fill out the form below to apply for your home loan
              </p>
            </div>

            {message && (
              <div className="text-red-600 text-center mb-4 p-3 bg-red-50 rounded-md">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-bold text-gray-700">
                  Name *
                </label>
                <input
                  onChange={handleLoan}
                  value={loanData.name}
                  name="name"
                  type="text"
                  className="border border-green-800 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter your full name"
                />
                {click && loanData.name === "" && (
                  <div className="text-red-600 mt-2 text-sm">
                    Required to fill name
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700">
                  Loan Amount *
                </label>
                <input
                  onChange={handleLoan}
                  value={loanData.loanAmount}
                  name="loanAmount"
                  type="number"
                  className="border border-green-800 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter loan amount"
                />
                {click && loanData.loanAmount === "" && (
                  <div className="text-red-600 mt-2 text-sm">
                    Required to fill loan amount
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700">
                  Mobile Number *
                </label>
                <input
                  onChange={handleLoan}
                  value={loanData.mobile}
                  name="mobile"
                  type="number"
                  pattern="[0-9]*"
                  maxLength={10}
                  className="border border-green-800 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter 10-digit mobile number"
                />
                {click && loanData.mobile === "" ? (
                  <div className="text-red-600 mt-2 text-sm">
                    Required to fill mobile number
                  </div>
                ) : click && loanData.mobile.length !== 10 ? (
                  <div className="text-red-600 mt-2 text-sm">
                    Please enter a valid 10-digit mobile number
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700">
                  Description
                </label>
                <textarea
                  onChange={handleLoan}
                  value={loanData.description}
                  name="description"
                  placeholder="Enter any additional details about your loan requirement"
                  className="w-full p-3 h-24 border border-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-700">
                    Security Check: {num1} {operation} {num2} = ?
                  </p>
                  <input
                    className="border border-green-800 p-2 rounded-md w-20 text-center focus:outline-none focus:ring-2 focus:ring-green-600"
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Answer"
                  />
                </div>
                <button
                  className="text-red-600 font-semibold underline "
                  onClick={() => {
                    setNum1(generateRandomNumber());
                    setNum2(generateRandomNumber());
                    setOperation(generateRandomOperation());
                    setAnswer("");
                  }}
                >
                  Generate New Question
                </button>
                {click && answer.length <= 0 && (
                  <div className="text-red-600 mt-2 text-sm">
                    Required to fill the captcha
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleLoans}
              className="bg-red-600 hover:bg-red-700 w-full p-3 mt-6 rounded-md flex justify-center items-center text-white font-bold min-h-[48px] transition-colors"
              disabled={loader}
            >
              {loader ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Processing...
                </div>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </div>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
