import React, { useState } from "react";
// import logo from "../../assets/img/logoTwo.jpg";
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
  // const [storedataShow, setStoreDataShow] = useState("");
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [num1, setNum1] = React.useState(generateRandomNumber());
  const [num2, setNum2] = React.useState(generateRandomNumber());
  const [operation, setOperation] = React.useState(generateRandomOperation());
  const [answer, setAnswer] = React.useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [storedata, setStoreData] = useState({
    phone: "",
  });
  const handleNewData = (e) => {
    setStoreData({ ...storedata, [e.target.name]: e.target.value });
  };
  const [loanData, setLoanData] = useState({
    name: "",
    loanAmount: "",
    mobile: "",
    description: "",
  });
  const checkAnswer = () => {
    const expectedAnswer = operation === "+" ? num1 + num2 : num1 - num2;
    return parseInt(answer) === expectedAnswer;
  };

  const handleChange = (event) => {
    setAnswer(event.target.value);
  };

  const regenerateCaptcha = () => {
    setNum1(generateRandomNumber());
    setNum2(generateRandomNumber());
    setOperation(generateRandomOperation());
    setAnswer("");
  };

  const handleLoan = (e) => {
    setLoanData({ ...loanData, [e.target.name]: e.target.value });
  };

  const storedTitleFromLocalStorage = localStorage.getItem("panelTitle");
  const retrievedToken = localStorage.getItem("token");

  const isValidToken = () => {
    // Check if token exists and is not empty/undefined/null
    return (
      retrievedToken &&
      retrievedToken !== "undefined" &&
      retrievedToken !== "null"
    );
  };

  const handleSubmit = () => {
    setClick(true);
    if (!storedata.phone || storedata.phone.length !== 10) {
      setMessage("Please enter a valid 10-digit phone number");
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
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("panelTitle");
    Navigate("/login");
    window.location.reload();
  };

  const handleClick = (span) => {
    setActiveButton(span);
  };

  const handleCommercial = (span) => {
    setActiveCommercial(span);
  };

  const handleClickButton = (div) => {
    setActive(div);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const datashow = () => {
    setShowData(true);
  };

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
      margin: "auto",
    },
  };

  return (
    <div className="">
      <Modal
        isOpen={modals}
        onRequestClose={() => setModals(false)}
        style={customStyles}
      >
        <div className="lg:w-[700px] w-full p-2">
          <div className="text-red-600 text-center">{message}</div>
          <div className="flex justify-between">
            <h6 className="text-start text-2xl font-semibold text-green-600">
              Positing your property is free, so get started.
            </h6>
            <div
              onClick={() => setModals(false)}
              className="bg-red-600 w-9 h-9 cursor-pointer flex justify-center absolute top-0 right-0 items-center"
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
            <p className="text3 mt-3 text-start text-lg font-semibold">
              Provide a few fundamental details
            </p>
          </div>
          <div></div>
          <div className="grid grid-cols-3  justify-center items-center gap-5 mt-3">
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
            <div className="text-red-600">select any one option</div>
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
                  <div className="flex items-center gap-2 mt-5">
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
                      IndependentHouse/villa
                    </button>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <div className="mt-3 text-start w-full">
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
                        Independent/Builder Floor
                      </button>
                    </div>
                    <div className="mt-3 text-start w-full">
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
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
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
                  </div>
                  <div className="flex gap-2 mt-3">
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
                    <div className="text-red-600">select any one option</div>
                  ) : null}
                </>
              ) : null}
              {selectedOption === "commercial" ? (
                <>
                  <div>
                    <div className="flex gap-5 mt-3">
                      <button
                        style={{
                          border: "2px solid #D3D3D3",
                          width: "100px",
                          backgroundColor: "white",
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
                    </div>
                    <div className="flex gap-5 mt-3">
                      <button
                        style={{
                          border: "2px solid #D3D3D3",
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
                  </div>
                  {click && activeCommercial === "" ? (
                    <div className="text-red-600">select any one option</div>
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
          <div className="text-start ms-3">
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
            <div className="text-red-600">
              Please enter a valid 10-digit phone number
            </div>
          ) : null}
          {!isValidToken() ? (
            <p className="mt-2 text-start font-bold mb-2">
              Are you a registered user?{" "}
              <Link to="/login" className="text5 text-green-600">
                Login
              </Link>
            </p>
          ) : null}
          <button
            onClick={handleSubmit}
            className="bg-red-600 w-full p-2 mt-5 rounded flex justify-center items-center"
          >
            <div className="text-white font-bold rounded-xl">Submit</div>
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={visibleModal}
        onRequestClose={() => setVisibleModal(false)}
        style={loanStyle}
      >
        <div className="md:w-full sm:w-full">
          <div
            onClick={() => setVisibleModal(false)}
            className="bg-red-600 w-9 h-9 cursor-pointer flex justify-center absolute top-0 right-0 items-center"
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
              Apply for Loan.
            </h6>
          </div>
          <div className="mt-2 mb-2 font-bold">Name</div>
          <input
            onChange={handleLoan}
            value={loanData.name}
            name="name"
            type="text"
            className="border border-green-800 p-2 w-full rounded-md"
          />
          {click && loanData.name === "" ? (
            <div className="text-red-600">Required To Fill name</div>
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
            <div className="text-red-600">Required To Fill Loan Amount</div>
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
            <div className="text-red-600">Required To Fill Mobile Number</div>
          ) : click && loanData.mobile.length !== 10 ? (
            <div className="text-red-600">
              Please enter a valid 10-digit mobile number
            </div>
          ) : null}
          <textarea
            onChange={handleLoan}
            value={loanData.description}
            name="description"
            placeholder="description"
            className="w-full mt-4 p-2 lg:h-20 border border-green-800"
          />
          <div>
            <div className="flex" style={{ alignItems: "center" }}>
              <p className="lg:w-20 font-bold" style={{ width: "70%" }}>
                Captcha: {num1} {operation} {num2}?
              </p>
              <input
                style={{ width: "30%" }}
                className="border border-green-800 p-2 rounded-md"
                type="text"
                value={answer}
                onChange={handleChange}
              />
            </div>
            <button
              style={{ width: "100%", textDecoration: "underline" }}
              className="text-end deconation-underline font-semibold text-red-600"
              onClick={regenerateCaptcha}
            >
              Regenerate
            </button>
            {click && answer.length <= 0 ? (
              <div className="text-red-600">Required To Fill the Captcha</div>
            ) : null}
          </div>
          <button
            onClick={handleLoans}
            className="bg-red-600 p-2 mt-2 mb-2 m-auto w-full"
            style={{ width: "100%" }}
          >
            <div className="text-center text-white font-bold">
              {loader ? (
                <div className="flex justify-center align-items-center">
                  <svg
                    className="animate-spin h-6 w-6"
                    fill="#ffff"
                    xmlns="http://www.w3.org/2000/svg"
                    height="0.5rem"
                    viewBox="0 0 512 512"
                  >
                    <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                  </svg>
                </div>
              ) : (
                <div>Submit</div>
              )}
            </div>
          </button>
        </div>
      </Modal>
      <div className="relative">
        <div className="w-full bg-white z-50">
          <div className="container mx-auto">
            <div className="main-navbar-div flex gap-10 justify-between">
              <div className="justify-center lg:justify-start logo-div">
                <Link to="/">
                  <img
                    className="w-1/1 p-2"
                    alt="logo"
                    src="https://bestpropertiesmohali.com/assets/images/logo1.png"
                  />
                </Link>
              </div>
              <div className="flex lg:ml-2 mb-2 mt-2 lg:gap-5 gap-5 justify-center items-center nav-items-div">
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
                  className={`menu-item rounded-sm text-black-bold p-1 lg:px-1 ${
                    location.pathname === "/for-rent"
                      ? "bg-green-600 rounded-md text-white"
                      : ""
                  }`}
                >
                  For Rent
                </button>
                <button
                  onClick={() => Navigate("/projects")}
                  className={`menu-item rounded-sm text-black-bold p-1 lg:px-1 ${
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
                      className="menu-item text-red-600 font-leading"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div
                    onClick={() => setVisibleModal(true)}
                    className="menu-item cursor-pointer text-black-bold"
                  >
                    Home Loan
                  </div>
                )}
                <button
                  className="menu-item text-red-600 font-leading"
                  onClick={() => Navigate("/login")}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-black-400"></div>
      </div>
    </div>
  );
}
