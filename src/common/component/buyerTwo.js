/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomBar from "./bottomBar";
import Navbar from "./navbar";
import { liveUrl, token } from "./url";
import Searching from "./searching";
import OurServices from "./ourServices";

export default function BuyerTwo() {
  const navigate = useNavigate();
  const [click, setClick] = useState("");
  const [uname, setUname] = useState("");
  const [loader, setLoader] = useState(false);
  const [selectedOption, setSelectedOption] = useState("residential");
  const [store, setStore] = useState({
    uName: "",
    mobile: "",
  });
  const [user, setUser] = useState("Individual Customer");

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("buyerFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setStore({
        uName: parsedData.uName || "",
        mobile: parsedData.mobile || "",
      });
      setUser(parsedData.userType || "Individual Customer");
    }
  }, []);

  // Save data to localStorage whenever store or user changes
  useEffect(() => {
    localStorage.setItem(
      "buyerFormData",
      JSON.stringify({
        uName: store.uName,
        mobile: store.mobile,
        userType: user,
      })
    );
  }, [store, user]);

  // Validate mobile number (exactly 10 digits)
  const ValidateMobile = () => {
    if (!/^\d{10}$/.test(store.mobile)) {
      setClick("Mobile number must be exactly 10 digits long.");
      return false;
    } else {
      setClick("");
      return true;
    }
  };

  // Validate name (at least 3 characters, only alphabetic and spaces)
  const ValidateName = () => {
    if (!store.uName || store.uName.length < 3) {
      setUname("Name must be at least 3 characters long.");
      return false;
    } else if (!/^[a-zA-Z\s]+$/.test(store.uName)) {
      setUname("Numbers are not allowed in the name.");
      return false;
    } else {
      setUname("");
      return true;
    }
  };

  // Handle input changes and validate name immediately
  const handleData = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });

    if (name === "uName") {
      if (value.length > 0 && !/^[a-zA-Z\s]+$/.test(value)) {
        setUname("Numbers are not allowed in the name.");
      } else if (value.length < 3 && value.length > 0) {
        setUname("Name must be at least 3 characters long.");
      } else {
        setUname("");
      }
    }
  };

 const handleApi = () => {
  const isMobileValid = ValidateMobile();
  const isNameValid = ValidateName();

  if (!isMobileValid || !isNameValid) {
    return;
  }

  setLoader(true);
  
  // ADD THIS: Store mobile number in localStorage before API call
  localStorage.setItem("dataKey", store.mobile);
  localStorage.setItem("userMobile", store.mobile);
  
  fetch(`${liveUrl}api/Buyer/addBuyer`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...store,
      userType: user,
      infotype: "personalInfo",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "done") {
        setLoader(false);
        // CHANGE: Don't clear localStorage here, we need mobile number for next pages
        // localStorage.removeItem("buyerFormData"); // REMOVE THIS LINE
        navigate("/budget");
        console.log(data);
      } else {
        setLoader(false);
        setClick("Failed to submit. Please try again.");
      }
    })
    .catch((error) => {
      console.error(error);
      setLoader(false);
      setClick("An error occurred. Please try again.");
    });
};

  function handleSelectUser(event) {
    setUser(event.target.value);
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center">
        <div className="container mx-auto lg:w-[800px] border shadow-lg w-full flex justify-center items-center">
          <div className="p-4">
            <div className="font-bold lg:text-3xl mt-5 text-center mb-4">
              Contact Us
            </div>
            <div className="w-full flex justify-center items-center rounded-md">
              <fieldset>
                <div className="flex items-center gap-5">
                  <label className="lg:text-xl font-bold text-sm" htmlFor="option1">
                    I am
                  </label>
                  <input
                    className="w-5 h-5 outline-none"
                    type="radio"
                    id="option2"
                    name="userType"
                    value="Individual Customer"
                    onChange={handleSelectUser}
                    checked={user === "Individual Customer"}
                  />
                  <label className="lg:text-xl text-sm" htmlFor="option2">
                    Individual
                  </label>
                  <input
                    className="w-5 h-5 outline-none"
                    type="radio"
                    id="option3"
                    name="userType"
                    value="Investor"
                    checked={user === "Investor"}
                    onChange={handleSelectUser}
                  />
                  <label className="lg:text-xl text-sm" htmlFor="option3">
                    Investor
                  </label>
                  <input
                    className="w-5 h-5 outline-none"
                    type="radio"
                    id="option4"
                    name="userType"
                    value="Dealer"
                    checked={user === "Dealer"}
                    onChange={handleSelectUser}
                  />
                  <label className="lg:text-xl text-sm" htmlFor="option4">
                    Dealer
                  </label>
                </div>
                <div className="mb-3 lg:p-1 mt-5 p-2">
                  <input
                    type="text"
                    id="nameInput"
                    className="border border-black outline-none rounded-md p-2 h-12 w-full"
                    placeholder="Name"
                    onChange={handleData}
                    value={store.uName}
                    name="uName"
                  />
                  {uname && <div className="text-red-600">{uname}</div>}
                </div>
                <div className="mb-3 lg:p-1 p-2">
                  <input
                    className="border border-black outline-none rounded-md h-12 p-2 w-full"
                    placeholder="Mobile No."
                    maxLength={10}
                    onChange={handleData}
                    type="number"
                    value={store.mobile}
                    name="mobile"
                  />
                  {click && <div className="text-red-600">{click}</div>}
                </div>
                <button
                  onClick={handleApi}
                  className="p-2 bg-red-600 mt-5 mb-10 w-full rounded-md text-white flex justify-center items-center text-2xl"
                  disabled={loader}
                >
                  {loader ? "Loading..." : "Next"}
                </button>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <OurServices />
        <Searching />
        <BottomBar />
      </div>
    </>
  )
}