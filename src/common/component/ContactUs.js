import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast from "./toast";
import { liveUrl, token } from "./url";

export default function Contact() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedValue, setSelectedValue] = useState("Buy");
  const [message, setMessage] = useState("");
  const [store, setStore] = useState({
    firstname: "",
    subject: "",
    email: "",
    phone: "",
    checkbox: true, // Pre-filled checkbox
  });

  window.scroll(0,0);
  const handleText = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
    // Clear error for the field being edited
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCheckbox = (e) => {
    setStore({ ...store, checkbox: e.target.checked });
    setErrors({ ...errors, checkbox: "" });
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    // Name validation: only letters and spaces, min 2 characters
    if (!store.firstname || !/^[A-Za-z\s]{2,}$/.test(store.firstname)) {
      newErrors.firstname =
        "Name is required and must contain only letters and spaces (min 2 characters).";
    }
    // Phone validation: exactly 10 digits
    if (!store.phone || !/^\d{10}$/.test(store.phone)) {
      newErrors.phone =
        "Phone number is required and must be exactly 10 digits.";
    }
    // Email validation: optional, but must be valid if provided
    if (store.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(store.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    // Checkbox validation
    if (!store.checkbox) {
      newErrors.checkbox = "You must agree to the terms and conditions.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function HandleApi() {
    setLoader(true);
    if (!validateForm()) {
      setLoader(false);
      return;
    }
    fetch(`${liveUrl}api/Contact/contact`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
            "Thank you for getting in touch! We will contact you soon."
          );
          setTimeout(() => {
            setLoader(false);
            navigate("/");
          }, 1000);
        } else {
          toast.error("Error during API call.");
          setLoader(false);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error during API call.");
        setLoader(false);
      });
  }

  return (
    <div>
      <Navbar />
      <div className="border-t-2 border-orange-900"></div>
      <div className="w-full py-5 mb-5 shadow-2xl rounded-md mt-4 container mx-auto lg:w-[700px] lg:px-5 px-4 border">
        <div className="text-3xl mt-2 font-bold text-center uppercase">
          Contact Us
        </div>
        <div>{message}</div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3">
            <label className="block tracking-wide text-lg font-bold mb-2">
              Your Name *
            </label>
            <input
              className="appearance-none block w-full h-12 border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="firstname"
              name="firstname"
              value={store.firstname}
              onChange={handleText}
              placeholder="Please enter your name"
            />
            {errors.firstname && (
              <div className="text-red-600 capitalize">{errors.firstname}</div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3">
            <label className="block tracking-wide text-lg font-bold mb-2">
              Email
            </label>
            <input
              name="email"
              value={store.email}
              onChange={handleText}
              className="appearance-none block w-full h-12 border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="email"
              placeholder="Please enter your email "
            />
            {errors.email && <div className="text-red-600">{errors.email}</div>}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3">
            <label className="block tracking-wide text-lg font-bold mb-2">
              Phone *
            </label>
            <input
              maxLength={10}
              type="text"
              name="phone"
              value={store.phone}
              onChange={handleText}
              className="appearance-none block w-full h-12 border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="phone"
              placeholder="Please enter your phone number"
            />
            {errors.phone && (
              <div className="text-red-600 capitalize">{errors.phone}</div>
            )}
          </div>
        </div>
        <label className="block tracking-wide text-lg font-bold mb-2">
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
          <option value="Home Loan">Home Loan</option>
          <option value="Investment">Investment</option>
          <option value="Partner">Partner</option>
          <option value="Others">Others</option>
        </select>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3">
            <label className="block tracking-wide text-lg font-bold mb-2">
              Message
            </label>
            <textarea
              name="subject"
              value={store.subject}
              onChange={handleText}
              className="appearance-none block w-full h-40 border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="subject"
              placeholder="Message for me "
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            onChange={handleCheckbox}
            checked={store.checkbox}
            name="checkbox"
            className="h-4 w-4"
            type="checkbox"
          />
          <div className="text-sm">
            By submitting this form, you hereby agree that we may collect, store
            and process your data that you provided.
          </div>
        </div>
        {errors.checkbox && (
          <div className="text-red-600 ml-2 capitalize">{errors.checkbox}</div>
        )}
        <div className="flex items-center justify-center">
          <button
            onClick={HandleApi}
            className={`bg-red-600 mt-4 rounded p-2 flex justify-center items-center w-40 hover:bg-slate-600 ${
              store.checkbox ? "" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!store.checkbox || loader}
          >
            {loader ? (
              <svg
                fill="white"
                className="w-8 h-12 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
              </svg>
            ) : (
              <div className="text-center font-bold text-1xl p-1 text-white">
                SUBMIT
              </div>
            )}
          </button>
        </div>
      </div>
      <Toast />
      <BottomBar />
    </div>
  );
}
