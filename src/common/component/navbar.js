import React, { useState } from "react";
import Modal from "react-modal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";

const generateRandomNumber = () => Math.floor(Math.random() * 20);
const generateRandomOperation = () => (Math.random() > 0.5 ? "+" : "-");

export default function Navbar() {
  const Navigate = useNavigate();
  const location = useLocation();
  const [click, setClick] = useState(false);
  const [modals, setModals] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [activeCommercial, setActiveCommercial] = useState("");
  const [active, setActive] = useState("");
  const [selectedOption, setSelectedOption] = useState("residential");
  const [showData, setShowData] = useState(false);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [num1, setNum1] = React.useState(generateRandomNumber());
  const [num2, setNum2] = React.useState(generateRandomNumber());
  const [operation, setOperation] = React.useState(generateRandomOperation());
  const [answer, setAnswer] = React.useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [storedata, setStoreData] = useState({ phone: "" });
  const [loanData, setLoanData] = useState({
    name: "",
    loanAmount: "",
    mobile: "",
    description: "",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleNewData = (e) => {
    setStoreData({ ...storedata, [e.target.name]: e.target.value });
  };

  const storedTitleFromLocalStorage = localStorage.getItem("panelTitle");
  const retrievedToken = localStorage.getItem("token");

  const isValidToken = () => {
    return (
      retrievedToken &&
      retrievedToken !== "undefined" &&
      retrievedToken !== "null" &&
      retrievedToken.trim() !== "" &&
      retrievedToken.length > 0
    );
  };

  const handleSubmit = () => {
    setClick(true);
    if (!storedata.phone || storedata.phone.length !== 10) {
      setMessage("Please enter a valid 10-digit phone number");
      return;
    }
    if (!active) {
      setMessage("Please select a property action (Sell/Rent)");
      return;
    }
    if (selectedOption === "residential" && !activeButton) {
      setMessage("Please select a residential property type");
      return;
    }
    if (selectedOption === "commercial" && !activeCommercial) {
      setMessage("Please select a commercial property type");
      return;
    }

    fetch(`${liveUrl}api/Seller/addSeller`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...storedata,
        propertyType: active,
        residential: activeButton,
        commercial: activeCommercial,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        localStorage.setItem("responseData", JSON.stringify(data.result));
        if (data.status === "done") {
          Navigate("/about-property");
        } else {
          setMessage(data.message || "Registration failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage("An error occurred. Please try again.");
      });
  };

  const handleLoans = () => {
    setClick(true);
    setLoader (true);
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
      body: JSON.stringify({
        ...loanData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        localStorage.setItem("responseData", JSON.stringify(data.result));
        if (data.status === "done") {
          Navigate("/success");
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage("An error occurred. Please try again.");
      })
      .finally(() => setLoader(false));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("panelTitle");
    Navigate("/login");
    window.location.reload();
  };

  const handleClick = (span) => setActiveButton(span);
  const handleCommercial = (span) => setActiveCommercial(span);
  const handleClickButton = (div) => setActive(div);
  const handleOptionChange = (event) => setSelectedOption(event.target.value);
  const datashow = () => setShowData(true);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      zIndex: "999999",
      width: "90%",
      maxWidth: "700px",
      maxHeight: "500px",
      padding: "20px",
      overflowY: "auto",
    },
  };

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
        isOpen={modals}
        onRequestClose={() => setModals(false)}
        style={customStyles}
      >
        <div className="w-full p-4">
          <div className="text-red-600 text-center mb-4">{message}</div>
          <div className="flex justify-between items-center">
            <h6 className="text-2xl font-semibold text-green-600">
              Posting your property is free, so get started.
            </h6>
            <div
              onClick={() => setModals(false)}
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
          </div>
          <div>
            <p className="mt-3 text-lg font-semibold">
              Provide a few fundamental details
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <button
              style={{
                border: "2px solid #D3D3D3",
                borderRadius: "10px",
                backgroundColor: "white",
                height: "45px",
                cursor: "pointer",
              }}
              onClick={() => handleClickButton("sale") || datashow()}
              className={
                active === "sale" ? "activess btn btn-solid" : "btn btn-solid"
              }
            >
              Sell
            </button>
            <button
              style={{
                border: "2px solid #D3D3D3",
                borderRadius: "10px",
                backgroundColor: "white",
                height: "45px",
                cursor: "pointer",
              }}
              onClick={() => handleClickButton("Rent/Lease") || datashow()}
              className={
                active === "Rent/Lease"
                  ? "activess btn btn-solid"
                  : "btn btn-solid"
              }
            >
              Rent/Lease
            </button>
          </div>
          {click && active === "" ? (
            <div className="text-red-600 mt-2">Select any one option</div>
          ) : null}
          {showData ? (
            <>
              <div className="flex gap-5 mt-4">
                <label className="flex items-center">
                  <input
                    className="w-5 h-5 mr-2"
                    type="radio"
                    name="residential"
                    value="residential"
                    checked={selectedOption === "residential"}
                    onChange={handleOptionChange}
                  />
                  Residential
                </label>
                <label className="flex items-center">
                  <input
                    className="w-5 h-5 mr-2"
                    type="radio"
                    name="commercial"
                    value="commercial"
                    checked={selectedOption === "commercial"}
                    onChange={handleOptionChange}
                  />
                  Commercial
                </label>
              </div>
              {selectedOption === "residential" ? (
                <>
                  <div className="grid grid-cols-2 gap-2 mt-5">
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                      }}
                      onClick={() => handleClick("Flat/Apartment")}
                      className={
                        activeButton === "Flat/Apartment"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Flat/Apartment
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                      }}
                      onClick={() => handleClick("IndePendentHouse/villa")}
                      className={
                        activeButton === "IndePendentHouse/villa"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Independent House/villa
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                      }}
                      onClick={() => handleClick("Independent/Builder Floor")}
                      className={
                        activeButton === "Independent/Builder Floor"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Independent/ Builder Floor
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                      }}
                      onClick={() => handleClick("plot")}
                      className={
                        activeButton === "plot"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Plot/Land
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                      }}
                      onClick={() => handleClick("1RK/Studio Apartment")}
                      className={
                        activeButton === "1RK/Studio Apartment"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      1RK/Studio Apartment
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                      }}
                      onClick={() => handleClick("Serviced Apartment")}
                      className={
                        activeButton === "Serviced Apartment"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Serviced Apartment
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                      }}
                      onClick={() => handleClick("Farmhouse")}
                      className={
                        activeButton === "Farmhouse"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Farmhouse
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                      }}
                      onClick={() => handleClick("Other")}
                      className={
                        activeButton === "Other"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Other
                    </button>
                  </div>
                  {click && activeButton === "" ? (
                    <div className="text-red-600 mt-2">Select any one option</div>
                  ) : null}
                </>
              ) : null}
              {selectedOption === "commercial" ? (
                <>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCommercial("Office")}
                      className={
                        activeCommercial === "Office"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Office
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCommercial("Retail")}
                      className={
                        activeCommercial === "Retail"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Retail
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCommercial("Plot/Land")}
                      className={
                        activeCommercial === "Plot/Land"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Plot/Land
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCommercial("Storage")}
                      className={
                        activeCommercial === "Storage"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Storage
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCommercial("Industry")}
                      className={
                        activeCommercial === "Industry"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Industry
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCommercial("Hospitality")}
                      className={
                        activeCommercial === "Hospitality"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Hospitality
                    </button>
                    <button
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCommercial("Other")}
                      className={
                        activeCommercial === "Other"
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      Other
                    </button>
                  </div>
                  {click && activeCommercial === "" ? (
                    <div className="text-red-600 mt-2">Select any one option</div>
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}
          <div>
            <h6 className="mt-3 text-lg font-bold">
              Your contact information so the buyer can get in touch with you
            </h6>
          </div>
          <div className="mt-3">
            <input
              value={storedata.phone}
              name="phone"
              onChange={handleNewData}
              className="h-10 rounded p-2 border border-black w-full"
              type="number"
              pattern="[0-9]*"
              placeholder="Phone Number"
              maxLength={10}
            />
          </div>
          {click && storedata.phone.length !== 10 ? (
            <div className="text-red-600 mt-2">
              Please enter a valid 10-digit phone number
            </div>
          ) : null}
          {!isValidToken() && (
            <p className="mt-2 font-bold">
              Are you a registered user?{" "}
              <Link to="/login" className="text-green-600">
                Login
              </Link>
            </p>
          )}
          <button
            onClick={handleSubmit}
            className="bg-red-600 w-full p-2 mt-5 rounded flex justify-center items-center text-white font-bold"
          >
            Submit
          </button>
        </div>
      </Modal>
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
          {click && loanData.name === "" ? (
            <div className="text-red-600 mt-2">Required to fill name</div>
          ) : null}
          <div className="mt-2 mb-2 font-bold">Enter Loan Amount</div>
          <input
            onChange={handleLoan}
            value={loanData.loanAmount}
            name="loanAmount"
            type="number"
            className="border border-green-800 p-2 w-full rounded-md"
          />
          {click && loanData.loanAmount === "" ? (
            <div className="text-red-600 mt-2">Required to fill loan amount</div>
          ) : null}
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
            {click && answer.length <= 0 ? (
              <div className="text-red-600 mt-2">Required to fill the captcha</div>
            ) : null}
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
                  onClick={() => Navigate("/property")}
                  className={`menu-item text-black-bold rounded-sm p-1 lg:px-1 ${
                    location.pathname === "/property"
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  For Sale
                </button>
                <Link
                  to="/buyer-data"
                  className={`menu-item rounded-sm text-black-bold p-1 lg:px-1 ${
                    location.pathname === "/buyer-data"
                      ? "bg-green-600 rounded-md text-white"
                      : ""
                  }`}
                >
                  Buy
                </Link>
                <button
                  onClick={() => Navigate("/for-rent")}
                  className={`menu-item rounded-sm text-black font-semibold p-1 lg:px-1 ${
                    location.pathname === "/for-rent"
                      ? "bg-green-600 rounded-md text-white"
                      : ""
                  }`}
                >
                  For Rent
                </button>
                <button
                  onClick={() => Navigate("/projects")}
                  className={`menu-item rounded-sm text-black font-semibold p-1 lg:px-1 ${
                    location.pathname === "/projects"
                      ? "bg-green-600 rounded-md text-white"
                      : ""
                  }`}
                >
                  Projects
                </button>
                <Link
                  onClick={() => setModals(true)}
                  className={`menu-item text-black-bold p-1 lg:px-1 ${
                    location.pathname === "" ? "bg-green-600" : ""
                  }`}
                >
                  Sell With Us
                </Link>
                {isValidToken() ? (
                  <>
                    <div
                      onClick={() => Navigate("/Agent")}
                      className="text-black-bold lg:block hidden cursor-pointer font-leading"
                    >
                      {storedTitleFromLocalStorage}
                    </div>
                    <button
                      className="menu-item text-red-600 font-semibold"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div
                    onClick={() => setVisibleModal(true)}
                    className="menu-item cursor-pointer text-black font-semibold"
                  >
                    Home Loan
                  </div>
                )}
                <button
                  className="menu-item text-red-600 font-semibold"
                  onClick={() => Navigate("/login")}
                >
                  Login
                </button>
              </div>
            </div>
            {isMenuOpen && (
              <div className="lg:hidden flex flex-col bg-white text-center shadow-md absolute top-full left-0 w-full z-50">
                <button
                  onClick={() => {
                    Navigate("/property");
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
                    Navigate("/for-rent");
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
                    Navigate("/projects");
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
                <Link
                  onClick={() => {
                    setModals(true);
                    setIsMenuOpen(false);
                  }}
                  className={`menu-item text-black font-semibold p-3 border-b border-gray-200 ${
                    location.pathname === "" ? "bg-green-600" : ""
                  }`}
                >
                  Sell With Us
                </Link>
                {isValidToken() ? (
                  <>
                    <div
                      onClick={() => {
                        Navigate("/Agent");
                        setIsMenuOpen(false);
                      }}
                      className="text-black font-semibold p-3 border-b border-gray-200 cursor-pointer"
                    >
                      {storedTitleFromLocalStorage}
                    </div>
                    <button
                      className="menu-item text-red-600 font-semibold p-3 border-b border-gray-200"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div
                    onClick={() => {
                      setVisibleModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="menu-item text-black font-semibold p-3 border-b border-gray-200 cursor-pointer"
                  >
                    Home Loan
                  </div>
                )}
                <button
                  className="menu-item text-red-600 font-semibold p-3"
                  onClick={() => {
                    Navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full border-t border-gray-400"></div>
      </div>
    </div>
  );
}