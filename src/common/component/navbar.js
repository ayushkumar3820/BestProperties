import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";

const generateRandomNumber = () => Math.floor(Math.random() * 20);
const generateRandomOperation = () => (Math.random() > 0.5 ? "+" : "-");

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [click, setClick] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Add this useEffect to close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const checkLoginStatus = () => {
    const retrievedToken = localStorage.getItem("token");
    const isValid = isValidToken(retrievedToken);
    setIsLoggedIn(isValid);

    if (!isValid && retrievedToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("panelTitle");
      localStorage.removeItem("responseData");
    }
  };

  const isValidToken = (token) => {
    if (!token) return false;
    if (
      token === "undefined" ||
      token === "null" ||
      token.trim() === "" ||
      token.length === 0
    ) {
      return false;
    }
    return true;
  };

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

  const handleLoan = (e) => {
    setLoanData({ ...loanData, [e.target.name]: e.target.value });
  };

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
          handleLogout();
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        localStorage.setItem("responseData", JSON.stringify(data.result));
        if (data.status === "done") {
          navigate("/success");
          setVisibleModal(false);
        }
      })
      .catch((error) => {
        console.error("Error in handleLoans:", error);
        if (error.message !== "Unauthorized") {
          setMessage("An error occurred. Please try again.");
        }
      })
      .finally(() => setLoader(false));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("panelTitle");
    localStorage.removeItem("responseData");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const loanStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      zIndex: 9999,
      width: "90%",
      maxWidth: "700px",
      maxHeight: "600px",
      padding: "20px",
      overflowY: "auto",
    },
  };

  return (
    <div className="relative">
      <Modal
        isOpen={visibleModal}
        onRequestClose={() => setVisibleModal(false)}
        style={loanStyle}
      >
        <div className="w-full p-4">
          <div
            onClick={() => setVisibleModal(false)}
            className="bg-red-600 w-9 h-9 cursor-pointer flex justify-center items-center absolute top-0 right-0"
          >
            <svg
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
          </div>
          <div>
            <h6 className="text-center text-2xl font-semibold text-green-600">
              Apply for Loan
            </h6>
          </div>
          <div className="text-red-600 text-center mb-4">{message}</div>
          <div className="mt-2 mb-2 font-bold">Name</div>
          <input
            onChange={handleLoan}
            value={loanData.name}
            name="name"
            type="text"
            className="border border-green-800 p-2 w-full rounded-md"
          />
          {click && loanData.name === "" && (
            <div className="text-red-600 mt-2">Required to fill name</div>
          )}
          <div className="mt-2 mb-2 font-bold">Enter Loan Amount</div>
          <input
            onChange={handleLoan}
            value={loanData.loanAmount}
            name="loanAmount"
            type="number"
            className="border border-green-800 p-2 w-full rounded-md"
          />
          {click && loanData.loanAmount === "" && (
            <div className="text-red-600 mt-2">Required to fill loan amount</div>
          )}
          <div className="mt-2 mb-2 font-bold">Mobile Number</div>
          <input
            onChange={handleLoan}
            value={loanData.mobile}
            name="mobile"
            type="number"
            pattern="[0-9]*"
            maxLength={10}
            className="border border-green-800 p-2 w-full rounded-md"
          />
          {click && loanData.mobile === "" ? (
            <div className="text-red-600 mt-2">Required to fill mobile number</div>
          ) : click && loanData.mobile.length !== 10 ? (
            <div className="text-red-600 mt-2">
              Please enter a valid 10-digit mobile number
            </div>
          ) : null}
          <textarea
            onChange={handleLoan}
            value={loanData.description}
            name="description"
            placeholder="Description"
            className="w-full mt-4 p-2 h-20 border border-green-800 rounded-md"
          />
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
              <div className="text-red-600 mt-2">Required to fill the captcha</div>
            )}
          </div>
          <button
            onClick={handleLoans}
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
      </Modal>
      <div className="relative">
        <div className="w-full bg-white z-50">
          <div className="container mx-auto">
            <div className="main-navbar-div flex justify-between items-center p-2">
              <div className="logo-div">
                <Link to="/">
                  <img
                    className="w-1/1 p-2"
                    alt="logo"
                    src="https://bestpropertiesmohali.com/assets/images/logo1.png"
                  />
                </Link>
              </div>
              <div className="lg:hidden">
                <button
                  onClick={toggleMenu}
                  className="text-black focus:outline-none"
                >
                  <svg
                    className="w-9 h-9"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        isMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
              <div className="hidden lg:flex lg:ml-2 mb-2 mt-2 lg:gap-5 justify-center items-center nav-items-div">
                <button
                  onClick={() => navigate("/property")}
                  className={`menu-item text-black font-semibold rounded-sm p-1 lg:px-1 ${
                    location.pathname === "/property"
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  For Sale
                </button>
                <Link
                  to="/buyer-data"
                  className={`menu-item text-black font-semibold rounded-sm p-1 lg:px-1 ${
                    location.pathname === "/buyer-data"
                      ? "bg-green-600 rounded-md text-white"
                      : ""
                  }`}
                >
                  Buy
                </Link>
                <button
                  onClick={() => navigate("/for-rent")}
                  className={`menu-item text-black font-semibold rounded-sm p-1 lg:px-1 ${
                    location.pathname === "/for-rent"
                      ? "bg-green-600 rounded-md text-white"
                      : ""
                  }`}
                >
                  For Rent
                </button>
                <button
                  onClick={() => navigate("/projects")}
                  className={`menu-item text-black font-semibold rounded-sm p-1 lg:px-1 ${
                    location.pathname === "/projects"
                      ? "bg-green-600 rounded-md text-white"
                      : ""
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => navigate("/sell-with-us")}
                  className={`menu-item text-black font-semibold p-1 lg:px-1 ${
                    location.pathname === "/sell-with-us"
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  Sell With Us
                </button>
                
                {/* Home Loan button - always visible */}
                <button
                  onClick={() => setVisibleModal(true)}
                  className="menu-item text-black font-semibold p-1 lg:px-1"
                >
                  Home Loan
                </button>

                {isLoggedIn ? (
                  <>
                    
                    <button
                      className="menu-item text-red-600 font-semibold p-1 lg:px-1"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    className="menu-item text-red-600 font-semibold p-1 lg:px-1"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
            {isMenuOpen && (
              <div className="lg:hidden flex flex-col bg-white text-center shadow-md absolute top-full left-0 w-full z-50">
                <button
                  onClick={() => {
                    navigate("/property");
                    setIsMenuOpen(false);
                  }}
                  className={`menu-item text-black font-semibold p-3 border-b border-gray-200 ${
                    location.pathname === "/property"
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  For Sale
                </button>
                <Link
                  to="/buyer-data"
                  onClick={() => setIsMenuOpen(false)}
                  className={`menu-item text-black font-semibold p-3 border-b border-gray-200 ${
                    location.pathname === "/buyer-data"
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  Buy
                </Link>
                <button
                  onClick={() => {
                    navigate("/for-rent");
                    setIsMenuOpen(false);
                  }}
                  className={`menu-item text-black font-semibold p-3 border-b border-gray-200 ${
                    location.pathname === "/for-rent"
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  For Rent
                </button>
                <button
                  onClick={() => {
                    navigate("/projects");
                    setIsMenuOpen(false);
                  }}
                  className={`menu-item text-black font-semibold p-3 border-b border-gray-200 ${
                    location.pathname === "/projects"
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => {
                    navigate("/sell-with-us");
                    setIsMenuOpen(false);
                  }}
                  className={`menu-item text-black font-semibold p-3 border-b border-gray-200 ${
                    location.pathname === "/sell-with-us"
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  Sell With Us
                </button>
                
                {/* Home Loan button in mobile menu - always visible */}
                <button
                  onClick={() => {
                    setVisibleModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="menu-item text-black font-semibold p-3 border-b border-gray-200"
                >
                  Home Loan
                </button>

                {isLoggedIn ? (
                  <>

                      {/* {localStorage.getItem("panelTitle") || "Profile"} */}
                   
                    <button
                      className="menu-item text-red-600 font-semibold p-3"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    className="menu-item text-red-600 font-semibold p-3"
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="w-full border-t border-gray-400"></div>
      </div>
    </div>
  );
}