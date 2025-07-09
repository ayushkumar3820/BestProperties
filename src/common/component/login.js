/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import Modal from "react-modal";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { liveUrl, token } from "./url";
import OurServices from "./ourServices";
import Searching from "./searching";
import Logo from "../../assets/img/password.webp";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState("option1");
  const [click, setClick] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modals, setModals] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Registration form state
  const [store, setStore] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  
  // Login form state
  const [newData, setNewData] = useState({
    phone: "",
    password: "",
  });
  
  // Forgot password state
  const [forgot, setForgot] = useState({
    email: "",
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleForgot = (e) => {
    setForgot({ ...forgot, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleForgotPassword = () => {
    navigate("/forget-password");
  };

  const fireForgot = () => {
    setClick(true);
    setErrorMessage("");
    
    if (!forgot.email) {
      setErrorMessage("Please enter your email");
      return;
    }
    
    if (!isValidEmail(forgot.email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    fetch(`${liveUrl}api/User/forgotPassword`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: forgot.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Forgot Password API Response:", data);
        if (data.status === "done") {
          setErrorMessage.success("Password reset link sent to your email");
          setModals(false);
          setForgot({ email: "" });
        } else {
          setErrorMessage(data.message || "Failed to send reset link");
        }
      })
      .catch((error) => {
        console.error("Forgot Password Error:", error);
        setErrorMessage("Something went wrong");
      });
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      const button = document.getElementById("submitButton");
      if (button) {
        button.click();
      }
    }
  };

  const handleClick = (span) => {
    setActiveButton(span);
    setClick(false);
    setLoginMessage("");
    setErrorMessage("");
    setValidationErrors({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  // Handle login form changes
  const handleChangeText = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
    setErrorMessage("");
    
    // Real-time validation for login
    if (name === "phone") {
      validatePhoneRealTime(value);
    }
    if (name === "password") {
      validatePasswordRealTime(value);
    }
  };

  // Handle registration form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
    setErrorMessage("");
    
    // Real-time validation for registration
    validateFieldRealTime(name, value);
  };

  // Real-time validation for individual fields
  const validateFieldRealTime = (fieldName, value) => {
    let error = "";
    
    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (!validateName(value)) {
          error = "Name should contain only letters and spaces";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!isValidEmail(value)) {
          error = "Please enter a valid email (gmail.com, yahoo.com, etc.)";
        }
        break;
        
      case "phone":
        if (!value.trim()) {
          error = "Mobile number is required";
        } else if (!validatePhone(value)) {
          error = "Please enter a valid 10-digit mobile number";
        }
        break;
        
      case "password":
        if (!value.trim()) {
          error = "Password is required";
        } else if (!validatePassword(value)) {
          error = "Password must be at least 6 characters long";
        }
        break;
        
      default:
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  // Real-time validation for login phone
  const validatePhoneRealTime = (value) => {
    let error = "";
    if (!value.trim()) {
      error = "Mobile number is required";
    } else if (!validatePhone(value)) {
      error = "Please enter a valid 10-digit mobile number";
    }
    setValidationErrors(prev => ({ ...prev, phone: error }));
  };

  // Real-time validation for login password
  const validatePasswordRealTime = (value) => {
    let error = "";
    if (!value.trim()) {
      error = "Password is required";
    } else if (!validatePassword(value)) {
      error = "Password must be at least 6 characters long";
    }
    setValidationErrors(prev => ({ ...prev, password: error }));
  };

  // Validation functions
  const validatePhone = (phone) => {
    if (!phone) return false;
    const phoneStr = phone.toString();
    return /^[6-9][0-9]{9}$/.test(phoneStr) && phoneStr.length === 10;
  };

  const validatePassword = (password) => {
    if (!password || password.length < 6) {
      return false;
    }
    return true;
  };

  const validateName = (name) => {
    if (!name || !name.trim()) return false;
    return /^[A-Za-z\s]+$/.test(name.trim());
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|aol\.com|icloud\.com|protonmail\.com|rediffmail\.com)$/i;
    return emailRegex.test(email);
  };

  // Registration API call
  const HandleApi = () => {
    setClick(true);
    setLoader(true);
    setErrorMessage("");
    
    // Validate all fields before submission
    const errors = {};
    
    if (!store.name.trim()) {
      errors.name = "Name is required";
    } else if (!validateName(store.name)) {
      errors.name = "Name should contain only letters and spaces";
    }
    
    if (!store.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(store.email)) {
      errors.email = "Please enter a valid email (gmail.com, yahoo.com, etc.)";
    }
    
    if (!store.phone.toString().trim()) {
      errors.phone = "Mobile number is required";
    } else if (!validatePhone(store.phone)) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }
    
    if (!store.password.trim()) {
      errors.password = "Password is required";
    } else if (!validatePassword(store.password)) {
      errors.password = "Password must be at least 6 characters long";
    }
    
    // If there are validation errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoader(false);
      return;
    }

    console.log("Sending Register API Request:", store);
    fetch(`${liveUrl}api/User/userRegister`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: store.name.trim(),
        email: store.email.trim(),
        phone: store.phone.toString().trim(),
        password: store.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Register API Response:", data);
        if (data.status === "done") {
          localStorage.setItem("name", store.name);
          localStorage.setItem("email", store.email);
          toast.success("Account created successfully");
          setTimeout(() => {
            setLoader(false);
            navigate("/login");
            window.location.reload();
          }, 2000);
        } else {
          setErrorMessage(data.message || "Registration failed");
          setLoader(false);
        }
      })
      .catch((error) => {
        console.error("Register Error:", error);
        setErrorMessage("Something went wrong");
        setLoader(false);
      });
  };

  // Login API call
  const handleLogin = () => {
    setClick(true);
    setLoader(true);
    setErrorMessage("");
    
    // Validate login fields
    const errors = {};
    
    if (!newData.phone.toString().trim()) {
      errors.phone = "Mobile number is required";
    } else if (!validatePhone(newData.phone)) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }
    
    if (!newData.password.trim()) {
      errors.password = "Password is required";
    } else if (!validatePassword(newData.password)) {
      errors.password = "Password must be at least 6 characters long";
    }
    
    // If there are validation errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoader(false);
      return;
    }

    fetch(`${liveUrl}api/User/loginUser`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: newData.phone.toString().trim(),
        password: newData.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login API Response:", data);
        if (data.status === "done") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("phone", newData.phone);
          localStorage.setItem("password", newData.password);
          toast.success("Login successful");
          const redirectTo = location.state?.from || "/sell-with-us";
          setTimeout(() => {
            setLoader(false);
            navigate(redirectTo);
          }, 1000);
        } else {
          if (data.message.includes("password")) {
            setErrorMessage("Incorrect password");
          } else {
            setErrorMessage(data.message || "Login failed");
          }
          setLoader(false);
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
        setErrorMessage("Something went wrong");
        setLoader(false);
      });
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
    },
  };

  return (
    <>
      <Modal
        isOpen={modals}
        onRequestClose={() => setModals(false)}
        style={customStyles}
      >
        <div className="lg:w-[400px] w-full">
          <div className="flex justify-center items-center">
            <div className="font-bold mb-6 text-2xl text-green-800">
              Forgot Password
            </div>
            <button
              onClick={() => setModals(false)}
              className="bg-red-600 absolute top-0 right-0 w-8 h-8 flex justify-center items-center"
            >
              <svg
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 384 512"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </button>
          </div>
          <div className="py-6 flex justify-center items-center">
            <img className="w-28" src={Logo} alt="password" />
          </div>
          <div className="text-sm text-slate-400">
            Enter your email to receive a password reset link
          </div>
          {errorMessage && (
            <div className="text-red-600 text-sm mt-2 text-center">
              {errorMessage}
            </div>
          )}
          <div className="w-full mt-4">
            <input
              placeholder="test@gmail.com"
              onChange={handleForgot}
              value={forgot.email}
              name="email"
              className="border w-full p-2 border-green-600 h-10 rounded-md"
            />
            <button
              id="forgotPassword"
              className="mt-3 text-white w-full bg-red-600 p-2 rounded-md font-bold text-2xl"
              type="submit"
              onClick={fireForgot}
            >
              Send Reset Link
            </button>
          </div>
        </div>
      </Modal>
      
      <Navbar />
      <div className="border border-green-800"></div>
      <div className="container mx-auto flex mt-14 mb-14 justify-center items-center">
        <div className="flex justify-center items-center mt-5 lg:w-8/12 w-full">
          <div className="mt-5 lg:w-6/12 min-h-[300px] w-full px-4 py-4">
            <div className="border shadow-lg px-4 py-6 mb-14 rounded-md">
              <div className="flex justify-center mt-4 items-center">
                <button
                  style={{
                    border: "2px solid #D3D3D3",
                    height: "45px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick("option1")}
                  className={
                    activeButton === "option1"
                      ? "activess btn btn-solid w-full"
                      : "btn btn-solid w-full"
                  }
                >
                  Login
                </button>
                <button
                  style={{
                    border: "2px solid #D3D3D3",
                    backgroundColor: "white",
                    height: "45px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick("option2")}
                  className={
                    activeButton === "option2"
                      ? "activess btn btn-solid w-full"
                      : "btn btn-solid w-full"
                  }
                >
                  Register
                </button>
              </div>
              
              <div>
                {activeButton === "option1" ? (
                  // LOGIN FORM
                  <>
                    <div className="">
                      {loginMessage && (
                        <div
                          className={`text-center p-2 ${
                            loginMessage === "User login successfully."
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {loginMessage}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                          {errorMessage}
                        </div>
                      )}
                      
                      <div className="text-lg mt-4 text-black">Mobile Number</div>
                      <input
                        className={`border w-full p-2 h-10 rounded-md ${
                          validationErrors.phone ? 'border-red-500' : 'border-green-600'
                        }`}
                        type="number"
                        id="phone"
                        name="phone"
                        value={newData.phone}
                        onChange={handleChangeText}
                        onKeyDown={handleEnterKeyPress}
                        maxLength="10"
                        placeholder="Enter 10-digit mobile number"
                      />
                      {validationErrors.phone && (
                        <div className="text-red-500 text-sm mt-1">
                          {validationErrors.phone}
                        </div>
                      )}
                      
                      <div className="text-lg mt-4 text-black">Password</div>
                      <input
                        className={`border w-full p-2 h-10 rounded-md ${
                          validationErrors.password ? 'border-red-500' : 'border-green-600'
                        }`}
                        type="password"
                        id="password"
                        name="password"
                        value={newData.password}
                        onChange={handleChangeText}
                        onKeyDown={handleEnterKeyPress}
                        placeholder="Enter your password"
                      />
                      {validationErrors.password && (
                        <div className="text-red-500 text-sm mt-1">
                          {validationErrors.password}
                        </div>
                      )}
                    </div>
                    
                    <div
                      className="forget-pass-div mt-2"
                      style={{ textAlign: "end" }}
                    >
                      <button
                        style={{
                          fontWeight: "500",
                          textDecoration: "underline",
                        }}
                        onClick={() => setModals(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    
                    <div
                      onClick={handleLogin}
                      className="flex cursor-pointer rounded-md p-2 w-full justify-center items-center mt-5"
                    >
                      {loader ? (
                        <svg
                          fill="red"
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                        </svg>
                      ) : (
                        <button
                          id="submitButton"
                          className="text-white w-full bg-red-600 p-2 rounded-md font-bold text-2xl"
                          type="submit"
                        >
                          Login
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  // REGISTRATION FORM
                  <>
                    <div className="font-bold text-2xl text-black text-center mt-4">
                      Register
                    </div>
                    {errorMessage && (
                      <div className="text-red-600 text-sm mt-2 text-center">
                        {errorMessage}
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <div className="text-lg text-black">Name</div>
                      <input
                        onChange={handleChange}
                        value={store.name}
                        name="name"
                        className={`border w-full p-2 h-10 rounded-md ${
                          validationErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        type="text"
                        placeholder="Enter your full name"
                      />
                      {validationErrors.name && (
                        <div className="text-red-500 text-sm mt-1">
                          {validationErrors.name}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-lg text-black">Email</div>
                      <input
                        onChange={handleChange}
                        value={store.email}
                        name="email"
                        className={`border w-full p-2 h-10 rounded-md ${
                          validationErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        type="email"
                        placeholder="user@gmail.com"
                      />
                      {validationErrors.email && (
                        <div className="text-red-500 text-sm mt-1">
                          {validationErrors.email}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-lg text-black">Mobile Number</div>
                      <input
                        type="number"
                        onChange={handleChange}
                        name="phone"
                        value={store.phone}
                        className={`w-full p-2 border h-10 rounded-md ${
                          validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength="10"
                        placeholder="Enter 10-digit mobile number"
                      />
                      {validationErrors.phone && (
                        <div className="text-red-500 text-sm mt-1">
                          {validationErrors.phone}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-lg text-black">Password</div>
                      <input
                        type="password"
                        onChange={handleChange}
                        name="password"
                        value={store.password}
                        className={`w-full p-2 border h-10 rounded-md ${
                          validationErrors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter password (min 6 characters)"
                      />
                      {validationErrors.password && (
                        <div className="text-red-500 text-sm mt-1">
                          {validationErrors.password}
                        </div>
                      )}
                    </div>
                    
                    <div
                      onClick={HandleApi}
                      className="bg-white cursor-pointer flex justify-center items-center p-2 w-full mt-4 rounded-md mb-2"
                    >
                      {loader ? (
                        <svg
                          fill="red"
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                        </svg>
                      ) : (
                        <button
                          className="text-white w-full bg-red-600 p-2 rounded-md font-bold text-xl"
                          type="submit"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <OurServices />
      <Searching />
      <BottomBar />
      <ToastContainer />
    </>
  );
}