import React, { useState } from "react";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { cssTransition, toast } from "react-toastify";
import Toast from "./toast";
import { liveUrl, token } from "./url";
import OurServices from "./ourServices";
import Searching from "./searching";
import Logo from "../../assets/img/password.webp";
export default function Login() {
  const Navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("option1");
  const [click, setClick] = useState(false);
  const [clickData, setClickData] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modals, setModals] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState("");
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
  // Forgot Password
  const [forgot, setForgot] = useState({
    password: "",
    confirmPassword: "",
  });
  const handleForgot = (e) => {
    setForgot({ ...forgot, [e.target.name]: e.target.value });
  };
  // fire Forgot Password
  // console.log(forgot)
  const fireForgot = () => {
    console.log(forgot, "$$$$$$$$$");
  };
  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      const button = document.getElementById("submitButton");
      if (button) {
        button.click();
      }
    }
  };
  const handleButtonClick = () => {
    handleLogin();
  };
  const handleClick = (span) => {
    setActiveButton(span);
  };
  const handleChangeText = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };
  const handleChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };
  const ValidateEmail = () => {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(store.email)) {
      setClick("email is not valid");
    } else {
      setClick("");
    }
  };
  const HandleApi = () => {
    setLoader(true);
    ValidateEmail();
    fetch(`${liveUrl}api/User/userRegister`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Add any other headers you need
      },
      body: JSON.stringify({
        ...store,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(data.message);
        if (data.status === "done") {
          toast.success("Create Account Successfully  ");
          setTimeout(() => {
            setLoading(false);
            Navigate("/login");
            window.location.reload();
          }, 3000);
        } else {
          toast.error("Something Went Wrong");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handleLogin = () => {
    setLoader(true);
    setClick(true);
    fetch(`${liveUrl}api/User/loginUser`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoginMessage(data.message);
        localStorage.setItem("token", data.token);
        if (data.status === "done") {
          toast.success("Login Successfully ");
          setTimeout(() => {
            setLoader(false);
            Navigate("/contact");
          }, 1000);
        } else {
          toast.error("Api Call Faild");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  // Css
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
      {/* Forgot Password Modal */}
      <Modal
        isOpen={modals}
        onRequestClose={() => setModals(false)}
        style={customStyles}
      >
        <div className="lg:w-[400px] w-full">
          <div className="flex justify-center items-center">
            <div className="font-bold mb-6 text-2xl text-green-800 ">
              Forget Password
            </div>
            <button
              onClick={() => {
                setModals(false);
              }}
              className="bg-red-600 absolute top-0
             right-0 w-8 h-8 flex justify-center items-center"
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
            <img className="w-28" src={Logo} />
          </div>
          <div className="text-sm text-slate-400">
            Enter your email and we'll send you a link to reset your password
          </div>
          <div className="w-full mt-4 ">
            <input
              placeholder="test@gmail.com"
              onChange={handleForgot}
              value={forgot.password}
              name="password"
              className="border w-full p-2 border-green-600 h-10 rounded-md"
            />
            {click && forgot.password == "" ? (
              <div className="text-red-600">Required to fill Email</div>
            ) : null}

            <button
              id="forgotPassword"
              className="mt-3 text-white w-full bg-red-600 p-2 rounded-md font-bold text-2x"
              type="submit"
              onClick={fireForgot}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
      <Navbar />
      <div className="border border-green-800"></div>
      <div className="container mx-auto flex mt-14 mb-14 justify-center items-center">
        <div className="flex justify-center items-center mt-5  lg:w-8/12 w-full ">
          <div className=" mt-5  lg:w-6/12 min-h-[300px] w-full px-4 py-4 ">
            <div className="border shadow-lg px-4 py-6 mb-14 rounded-md">
              <div className="flex justify-center mt-4 items-center ">
                <button
                  style={{
                    border: "2px solid #D3D3D3",
                    height: "45px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick("option1")}
                  className={
                    activeButton === "option1"
                      ? "activess btn btn-solid  w-full "
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
                      ? "activess btn btn-solid w-full "
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
                      {loginMessage == "User login successfully." ? (
                        <>
                          <div className="text-center text-green-600 p-2">
                            {loginMessage}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center text-red-600 p-2">
                            {loginMessage}
                          </div>
                        </>
                      )}

                      <div className="text-lg mt-4 text-black ">Phone</div>
                      <input
                        className="border w-full p-2 border-green-600 h-10 rounded-md"
                        type="number"
                        id="phone"
                        name="phone"
                        value={newData.phone}
                        onChange={handleChangeText}
                        onKeyDown={handleEnterKeyPress}
                      />
                      {click && newData.phone == "" ? (
                        <div className="text-red-900">
                          Required to fill phone number
                        </div>
                      ) : null}
                      <div className="text-lg mt-4 text-black ">Password</div>
                      <input
                        className="border w-full p-2 border-green-600 h-10 rounded-md"
                        type="password"
                        id="password"
                        name="password"
                        value={newData.password}
                        onChange={handleChangeText}
                        onKeyDown={handleEnterKeyPress}
                      />
                      {click && newData.password == "" ? (
                        <div className="text-red-900">
                          Required to fill password
                        </div>
                      ) : null}
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
                        onClick={() => {
                          setModals(true);
                        }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div
                      onClick={handleLogin}
                      className="flex cursor-pointer  rounded-md  p-2 w-full  justify-center items-center mt-5"
                    >
                      {loader ? (
                        <>
                          <svg
                            fill="red"
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <button
                            id="submitButton"
                            className="text-white w-full bg-red-600 p-2 rounded-md font-bold text-2x"
                            type="submit"
                          >
                            Login
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
              {activeButton === "option2" ? (
                <>
                  <div className="font-bold text-2xl text-white  text-center ">
                    Register
                  </div>
                  <div className="text-red-600  mb-4  text-center">
                    {messages}
                  </div>
                  <div>
                    <div className="text-lg text-black">Name</div>
                    <input
                      onChange={handleChange}
                      value={store.name}
                      name="name"
                      className="border w-full p-2 h-10 rounded-md"
                      type="name"
                    />
                    {click && store.name == "" ? (
                      <div className="text-red-600 capitalize mt-1 ">
                        Required to fill Name
                      </div>
                    ) : null}
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
                    {click && (
                      <div className="text-red-600 capitalize">{click}</div>
                    )}
                  </div>
                  <div>
                    <div className="mt-2 text-lg text-black">Password</div>
                    <input
                      type="password"
                      onChange={handleChange}
                      name="password"
                      value={store.password}
                      className="w-full p-2  border h-10 rounded-md"
                    />
                    {click && store.password == "" ? (
                      <div className="text-red-600 capitalize">
                        Required to fill password
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <div className="mt-2 text-lg text-black">Mobile</div>
                    <input
                      type="number"
                      onChange={handleChange}
                      name="phone"
                      value={store.phone}
                      className="w-full p-2  border h-10 rounded-md"
                    />
                    {click && store.phone.length < 10 ? (
                      <div className="text-red-600 capitalize ">
                        Phone Number is not Valid
                      </div>
                    ) : null}
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
                        className=" text-white w-full bg-red-600 p-2 rounded-md font-bold text-xl  "
                        type="submit"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
      <Toast />
    </>
  );
}
