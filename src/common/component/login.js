/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { liveUrl, token } from "./url";
import OurServices from "./ourServices";
import Searching from "./searching";
import Logo from "../../assets/img/password.webp";

export default function Login() {
  const Navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("option1");
  const [click, setClick] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modals, setModals] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
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
  const [forgot, setForgot] = useState({
    email: "",
  });

  const handleForgot = (e) => {
    setForgot({ ...forgot, [e.target.name]: e.target.value });
  };

  const fireForgot = () => {
    setClick(true);
    console.log("Forgot Password Clicked:", forgot);
    if (!forgot.email) {
      toast.error("Please enter your email");
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(forgot.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Simulate API call for forgot password (adjust URL and payload as needed)
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
        console.log("Forgot Password API Response:", data); // Debug
        if (data.status === "done") {
          toast.success("Password reset link sent to your email");
          setModals(false);
          setForgot({ email: "" });
        } else {
          toast.error(data.message || "Failed to send reset link");
        }
      })
      .catch((error) => {
        console.error("Forgot Password Error:", error);
        toast.error("Something went wrong");
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
  };

  const handleChangeText = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone) => {
    if (!phone) return false;
    return /^[1-9][0-9]{9}$/.test(phone);
  };

  const validatePassword = (password) => {
    if (!password || password.length < 6) {
      return false;
    }
    return true;
  };

  const HandleApi = () => {
    setClick(true);
    setLoader(true);
    console.log("Register Clicked:", store);

    // Validation checks
    if (!store.name) {
      console.log("Validation Failed: No name");
      toast.error("Please enter your name");
      setLoader(false);
      return;
    }
    if (!store.email) {
      console.log("Validation Failed: No email");
      toast.error("Please enter your email");
      setLoader(false);
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(store.email)) {
      console.log("Validation Failed: Invalid email");
      toast.error("Please enter a valid email address");
      setLoader(false);
      return;
    }
    if (!store.phone || !validatePhone(store.phone)) {
      console.log("Validation Failed: Invalid phone");
      toast.error("Please enter a valid 10-digit phone number");
      setLoader(false);
      return;
    }
    if (!store.password) {
      console.log("Validation Failed: No password");
      toast.error("Please enter a password");
      setLoader(false);
      return;
    }
    if (!validatePassword(store.password)) {
      console.log("Validation Failed: Password too short");
      toast.error("Password must be at least 6 characters long");
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
        name: store.name,
        email: store.email,
        phone: store.phone,
        password: store.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Register API Response:", data); // Debug
        if (data.status === "done") {
          toast.success("Account created successfully");
          setTimeout(() => {
            setLoader(false);
            Navigate("/login");
            window.location.reload();
          }, 2000);
        } else {
          toast.error(data.message || "Registration failed");
          setLoader(false);
        }
      })
      .catch((error) => {
        console.error("Register Error:", error);
        toast.error("Something went wrong");
        setLoader(false);
      });
  };

  const handleLogin = () => {
    setClick(true);
    setLoader(true);
    console.log("Login Clicked:", newData);

    if (!newData.phone) {
      toast.error("Please enter your phone number");
      setLoader(false);
      return;
    }
    if (!validatePhone(newData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      setLoader(false);
      return;
    }
    if (!newData.password) {
      toast.error("Please enter your password");
      setLoader(false);
      return;
    }
    if (!validatePassword(newData.password)) {
      toast.error("Password must be at least 6 characters long");
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
        phone: newData.phone,
        password: newData.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login API Response:", data);
        if (data.status === "done") {
          // localStorage.setItem("token", data.token);
          toast.success("Login successful");
          setTimeout(() => {
            setLoader(false);
            Navigate("/contact");
          }, 1000);
        } else {
          if (data.message.includes("password")) {
            toast.error("Incorrect password");
          } else {
            toast.error(data.message || "Login failed");
          }
          setLoader(false);
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
        toast.error("Something went wrong");
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
              className="mt-3 text-white w-full bg-red-600 p-2 rounded-md font-bold text-2x"
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
                      <div className="text-lg mt-4 text-black">Phone</div>
                      <input
                        className="border w-full p-2 border-green-600 h-10 rounded-md"
                        type="number"
                        id="phone"
                        name="phone"
                        value={newData.phone}
                        onChange={handleChangeText}
                        onKeyDown={handleEnterKeyPress}
                        maxLength="10"
                      />
                      <div className="text-lg mt-4 text-black">Password</div>
                      <input
                        className="border w-full p-2 border-green-600 h-10 rounded-md"
                        type="password"
                        id="password"
                        name="password"
                        value={newData.password}
                        onChange={handleChangeText}
                        onKeyDown={handleEnterKeyPress}
                      />
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
                          className="text-white w-full bg-red-600 p-2 rounded-md font-bold text-2x"
                          type="submit"
                        >
                          Login
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-2xl text-black text-center">
                      Register
                    </div>
                    <div>
                      <div className="text-lg text-black">Name</div>
                      <input
                        onChange={handleChange}
                        value={store.name}
                        name="name"
                        className="border w-full p-2 h-10 rounded-md"
                        type="text"
                      />
                    </div>
                    <div className="mt-3">
                      <div className="text-lg text-black">Email</div>
                      <input
                        onChange={handleChange}
                        value={store.email}
                        name="email"
                        className="border w-full p-2 h-10 rounded-md"
                        type="email"
                      />
                    </div>
                    <div>
                      <div className="mt-2 text-lg text-black">Password</div>
                      <input
                        type="password"
                        onChange={handleChange}
                        name="password"
                        value={store.password}
                        className="w-full p-2 border h-10 rounded-md"
                      />
                    </div>
                    <div></div>
                    <div>
                      <div className="mt-2 text-lg text-black">Mobile</div>
                      <input
                        type="number"
                        onChange={handleChange}
                        name="phone"
                        value={store.phone}
                        className="w-full p-2 border h-10 rounded-md"
                        maxLength="10"
                      />
                    </div>
                    <div
                      onClick={HandleApi}
                      className="bg-white cursor-pointer flex justify-center items-center p-2 w-full mt-2 rounded-md mb-2"
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
