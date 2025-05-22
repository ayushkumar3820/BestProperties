import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast from "./toast";
import { liveUrl, token } from "./url";

export default function Contact() {
  const navigate = useNavigate();
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10));
  const [loader, setLoader] = useState(false);
  const [click, setClick] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Buy");
  const [message, setMessage] = useState("");
  const [store, setStore] = useState({
    firstname: "",
    subject: "",
    email: "",
    phone: "",
    number: "",
    checkbox: false,
  });

  const handleText = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(store.number) === num1 + num2) {
      alert("Captcha verification successful!");
    } else {
      alert("Incorrect answer. Please try again.");
      setNum1(Math.floor(Math.random() * 10));
      setNum2(Math.floor(Math.random() * 10));
      setStore({ ...store, number: "" });
    }
  };
  const ValidateEmail = () => {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(store.email)) {
      setClick("Please enter a valid email address.");
    } else {
      setClick(true);
    }
  };
  function HandleApi() {
    setLoader(false);
    ValidateEmail();
    fetch(`${liveUrl}api/Contact/contact`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Add any other headers you need
      },
      body: JSON.stringify({
        ...store,
        property: "",
        selectedValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "done") {
          setMessage(data.status);
          toast.success(
            "Thank you for getting in touch! We will Contact you Soon "
          );
          setTimeout(() => {
            setLoader(false);
            navigate("/");
          }, 1000);
        } else {
          toast.error("Error during API call.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <div>
      <Navbar />
      <div className="border-t-2 border-orange-900 "></div>
      <div className="w-full  py-5 mb-5  shadow-2xl rounded-md mt-4 container mx-auto lg:w-[700px] lg:px-5 px-4 border ">
        <div className="text-3xl mt-2 font-bold text-center uppercase">
          Contact Us
        </div>
        <div>{message}</div>
        <div className="flex flex-wrap -mx-3 mb-2 ">
          <div className="w-full px-3">
            <label className="block tracking-wide  text-lg font-bold mb-2">
              Your Name
            </label>
            <input
              className="appearance-none block w-full h-12 border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="firstname"
              name="firstname"
              value={store.firstname}
              onChange={handleText}
              placeholder="Please enter your firstname"
            />
            {click && store.firstname == "" ? (
              <div className="text-red-600 capitalize ">
                Required to fill firstName
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3">
            <label className="block  tracking-wide  text-lg font-bold mb-2">
              Email
            </label>
            <input
              name="email"
              value={store.email}
              onChange={handleText}
              className="appearance-none block w-full h-12  border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="email"
              placeholder="Please enter your email"
            />
            {click && <div className="text-red-600">{click}</div>}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3">
            <label className="block  tracking-wide  text-lg font-bold mb-2">
              Phone
            </label>
            <input
              maxLength={10}
              type="number"
              name="phone"
              value={store.phone}
              onChange={handleText}
              className="appearance-none block w-full  border h-12 border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="phone"
              placeholder="Please enter your phone number"
            />
            {click && store.phone.length < 10 ? (
              <div className="text-red-600 capitalize">
                Phone number is not valid
              </div>
            ) : null}
            {click && store.phone.length > 10 ? (
              <div className="text-red-600 capitalize">
                Phone number is not valid
              </div>
            ) : null}
          </div>
        </div>
        <label className="block  tracking-wide  text-lg font-bold mb-2">
          Interested In
        </label>
        <select
          className="w-full p-3 border border-black rounded-md mb-2 bg-white"
          value={selectedValue}
          onChange={handleSelectChange}
        >
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
          <option value="Rent">Rent</option>
        </select>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3">
            <label className="block  tracking-wide  text-lg font-bold mb-2">
              Message
            </label>
            <textarea
              name="subject"
              value={store.subject}
              onChange={handleText}
              className="appearance-none block w-full h-40  border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="subject"
              placeholder="Message for me"
            />
            {click && store.subject == "" ? (
              <div className="text-red-600 capitalize ">
                Required to fill message
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            onChange={handleText}
            value={store.checkbox}
            name="checkbox"
            className="h-4 w-4"
            type="checkbox"
          />
          <div className="text-sm">
            By submitting this form, you hereby agree that we may collect, store
            and process your data that you provided.
          </div>
        </div>
        {click && store.checkbox == "" ? (
          <div className="text-red-600 ml-2 capitalize ">
            Accept term and conditions
          </div>
        ) : null}
        <div className=" flex items-center justify-center">
          <button
            onClick={() => {
              HandleApi();
            }}
            className={`bg-red-600 mt-4 rounded p-2 flex justify-center items-center w-40 hover:bg-slate-600 ${
              store.checkbox ? "" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!store.checkbox || loader}
          >
            {loader ? (
              <>
                <svg
                  fill="white"
                  className="w-8 h-12 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                </svg>
              </>
            ) : (
              <>
                <div className="text-center font-bold text-1xl p-1 text-white">
                  SUBMIT
                </div>
              </>
            )}
          </button>
        </div>
      </div>
      <Toast />
      <BottomBar />
    </div>
  );
}
