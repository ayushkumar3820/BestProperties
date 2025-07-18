import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from 'js-cookie';
import { liveUrl, token } from "./url";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import OurServices from "./ourServices";
import Searching from "./searching";
import Logo from "../../assets/img/password.webp";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState("option1");
  const [click, setClick] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [store, setStore] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [newData, setNewData] = useState({
    phone: "",
    password: "",
  });
  const [fieldTouched, setFieldTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

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
    setFieldTouched({
      name: false,
      email: false,
      phone: false,
      password: false,
    });
  };

  const handleChangeText = (e) => {
    const { name, value } = e.target;
    setFieldTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setNewData({ ...newData, [name]: numericValue });
      if (fieldTouched[name]) {
        validatePhoneRealTime(numericValue);
      }
    } else if (name === "password") {
      const limitedValue = value;
      setNewData({ ...newData, [name]: limitedValue });
      if (fieldTouched[name]) {
        validatePasswordRealTime(limitedValue);
      }
    } else {
      setNewData({ ...newData, [name]: value });
    }
    setErrorMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setStore({ ...store, [name]: numericValue });
      if (fieldTouched[name]) {
        validateFieldRealTime(name, numericValue);
      }
    } else if (name === "password") {
      const limitedValue = value;
      setStore({ ...store, [name]: limitedValue });
      if (fieldTouched[name]) {
        validateFieldRealTime(name, limitedValue);
      }
    } else {
      setStore({ ...store, [name]: value });
      if (fieldTouched[name]) {
        validateFieldRealTime(name, value);
      }
    }
    setErrorMessage("");
  };

  const handleBlur = (fieldName) => {
    setFieldTouched((prev) => ({ ...prev, [fieldName]: true }));
    if (activeButton === "option1") {
      if (fieldName === "phone") {
        validatePhoneRealTime(newData.phone);
      } else if (fieldName === "password") {
        validatePasswordRealTime(newData.password);
      }
    } else {
      const value = store[fieldName];
      validateFieldRealTime(fieldName, value);
    }
  };

  const validateFieldRealTime = (fieldName, value) => {
    let error = "";
    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.length < 2) {
          error = "Name must be at least 2 characters long";
        } else if (!/^[A-Za-z\s]+$/.test(value.trim())) {
          error = "Name should contain only letters and spaces";
        }
        break;
      case "email":
        if (value.trim() && !isValidEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Mobile number is required";
        } else if (value.length < 10) {
          error = `Please enter ${10 - value.length} more digit${
            10 - value.length > 1 ? "s" : ""
          }`;
        } else if (!/^\d{10}$/.test(value)) {
          error = "Please enter a valid 10-digit mobile number";
        }
        break;
      case "password":
        if (!value.trim()) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = `Password must be at least 6 characters long`;
        }
        break;
      default:
        break;
    }
    setValidationErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const validatePhoneRealTime = (value) => {
    let error = "";
    if (!value.trim()) {
      error = "Mobile number is required";
    } else if (value.length < 10) {
      error = `Please enter ${10 - value.length} more digit${
        10 - value.length > 1 ? "s" : ""
      }`;
    } else if (!/^\d{10}$/.test(value)) {
      error = "Please enter a valid 10-digit mobile number";
    }
    setValidationErrors((prev) => ({ ...prev, phone: error }));
  };

  const validatePasswordRealTime = (value) => {
    let error = "";
    if (!value.trim()) {
      error = "Password is required";
    } else if (value.length < 6) {
      error = `Password must be at least 6 characters long`;
    }
    setValidationErrors((prev) => ({ ...prev, password: error }));
  };

  const validatePhone = (phone) => {
    if (!phone) return false;
    const phoneStr = phone.toString();
    return /^\d{10}$/.test(phoneStr);
  };

  const validatePassword = (password) => {
    if (!password || password.length < 6) {
      return false;
    }
    return true;
  };

  const validateName = (name) => {
    if (!name || !name.trim()) return false;
    return /^[A-Za-z\s]+$/.test(name.trim()) && name.trim().length >= 2;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const handleCheckboxChange = (e) => {
    setAgreeTerms(e.target.checked);
  };

  const HandleApi = () => {
    setClick(true);
    setLoader(true);
    setErrorMessage("");
    setFieldTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
    });
    const errors = {};
    if (!store.name.trim()) {
      errors.name = "Name is required";
    } else if (!validateName(store.name)) {
      errors.name =
        "Name should contain only letters and spaces (min 2 characters)";
    }
    if (store.email.trim() && !isValidEmail(store.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!store.phone.toString().trim()) {
      errors.phone = "Mobile number is required";
    } else if (!validatePhone(store.phone)) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!store.password.trim()) {
      errors.password = "Password is required";
    } else if (!validatePassword(store.password)) {
      errors.password = "Password must be exactly 6 characters long";
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoader(false);
      return;
    }
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
        if (data.status === "done") {
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

  const handleLogin = () => {
    setClick(true);
    setLoader(true);
    setErrorMessage("");
    setFieldTouched({
      ...fieldTouched,
      phone: true,
      password: true,
    });
    const errors = {};
    if (!newData.phone.toString().trim()) {
      errors.phone = "Mobile number is required";
    } else if (!validatePhone(newData.phone)) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!newData.password.trim()) {
      errors.password = "Password is required";
    } else if (!validatePassword(newData.password)) {
      errors.password = "Password must be exactly 6 characters long";
    }
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
        if (data.status === "done") {
          // Store user data in cookies
          Cookies.set('token', data.token, { expires: 7 });
          Cookies.set('phone', newData.phone, { expires: 7 });
          Cookies.set('password', newData.password, { expires: 7 });
          Cookies.set('isLoggedIn', 'true', { expires: 7 });
          Cookies.set('userName', data?.name || "", { expires: 7 });
          Cookies.set('userId', data.userid?.toString() || "", { expires: 7 });

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

  const handleForgotPassword = () => {
    navigate("/forget-password");
  };

  return (
    <>
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
                      <div className="text-lg mt-4 text-black">
                        Mobile Number
                      </div>
                      <input
                        className={`border w-full p-2 h-10 rounded-md ${
                          fieldTouched.phone && validationErrors.phone
                            ? "border-red-500"
                            : "border-green-600"
                        }`}
                        type="text"
                        id="phone"
                        name="phone"
                        value={newData.phone}
                        onChange={handleChangeText}
                        onBlur={() => handleBlur("phone")}
                        onKeyDown={handleEnterKeyPress}
                        maxLength="10"
                        placeholder="Enter 10-digit mobile number"
                      />
                      {fieldTouched.phone && validationErrors.phone && (
                        <div className="text-red-500 text-sm mt-1">
                          {validationErrors.phone}
                        </div>
                      )}
                      <div className="text-lg mt-4 text-black">Password</div>
                      <input
                        className={`border w-full p-2 h-10 rounded-md ${
                          fieldTouched.password && validationErrors.password
                            ? "border-red-500"
                            : "border-green-600"
                        }`}
                        type="password"
                        id="password"
                        name="password"
                        value={newData.password}
                        onChange={handleChangeText}
                        onBlur={() => handleBlur("password")}
                        onKeyDown={handleEnterKeyPress}
                        placeholder="Enter password (min 6 characters)"
                      />
                      {fieldTouched.password && validationErrors.password && (
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
                          color: "#1f2937",
                          cursor: "pointer",
                        }}
                        onClick={handleForgotPassword}
                      >
                        Forgot Password
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
                        onBlur={() => handleBlur("name")}
                        className={`border w-full p-2 h-10 rounded-md ${
                          fieldTouched.name && validationErrors.name
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        type="text"
                        placeholder="Enter your full name"
                      />
                      {fieldTouched.name && validationErrors.name && (
                        <div className="text-red-500 text-sm mt-1">
                          {validationErrors.name}
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="text-lg text-black">Mobile Number</div>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="phone"
                        value={store.phone}
                        onBlur={() => handleBlur("phone")}
                        className={`w-full p-2 border h-10 rounded-md ${
                          fieldTouched.phone && validationErrors.phone
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        maxLength="10"
                        placeholder="Enter 10-digit mobile number"
                      />
                      {fieldTouched.phone && validationErrors.phone && (
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
                        onBlur={() => handleBlur("password")}
                        className={`w-full p-2 border h-10 rounded-md ${
                          fieldTouched.password && validationErrors.password
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Password must be at least 6 characters long"
                      />
                      {fieldTouched.password && validationErrors.password && (
                        <div className="text-red-500 text-sm mt-1">
                          {validationErrors.password}
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="text-lg text-black">Email</div>
                      <input
                        onChange={handleChange}
                        value={store.email}
                        name="email"
                        onBlur={() => handleBlur("email")}
                        className={`border w-full p-2 h-10 rounded-md ${
                          fieldTouched.email && validationErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        type="email"
                        placeholder="user@gmail.com"
                      />
                      {fieldTouched.email && validationErrors.email && (
                        <div className="text-red-500 text-sm mt-1">
                          {validationErrors.email}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeTerms}
                        onChange={handleCheckboxChange}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="terms" className="text-sm text-black">
                        I agree to the{" "}
                        <span
                          onClick={() => navigate("/term-and-condition")}
                          className="text-blue-600 underline cursor-pointer"
                        >
                          Terms and Conditions
                        </span>
                      </label>
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
