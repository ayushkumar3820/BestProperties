import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";

export default function Buyer() {
  const navigate = useNavigate();
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [user, setUser] = useState("Individual Customer");
  const [store, setStore] = useState({
    uName: "",
    mobile: "",
  });
  const [loader, setLoader] = useState(false);

  const validateName = () => {
    if (!/^[a-zA-Z\s]{2,}$/.test(store.uName)) {
      setNameError("Name must contain at least 2 letters and no numbers.");
      return false;
    }
    setNameError("");
    return true;
  };

  const validatePhone = () => {
    if (!/^\d{10}$[1-9][0-9]{9}$/.test(store.mobile)) {
      setPhoneError("Mobile number must be exactly 10 digits.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleData = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleApi = () => {
    const isNameValid = validateName();
    const isPhoneValid = validatePhone();
    if (!isNameValid || !isPhoneValid) return;

    setLoader(true);
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
          localStorage.setItem("dataKey", JSON.stringify(store.mobile));
          navigate("/budget");
        }
      })
      .catch((error) => {
        console.error(error);
        setLoader(false);
      });
  };

  function handleSelectUser(event) {
    setUser(event.target.value);
  }

  return (
    <div className="container mx-auto absolute lg:mt-52 lg:ml-24 w-full lg:w-[400px] bg-white flex justify-center items-center">
      <div className="px-4 py-6">
        <div className="font-bold lg:text-4xl mt-10 text-xl text-center mb-4">
          Buyer
        </div>
        <div className="flex gap-2 items-center justify-center">
          <label className="lg:text-lg font-bold text-sm" htmlFor="option1">
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
          <label className="lg:text-lg text-sm" htmlFor="option2">
            Individual
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
        </div>
        <div className="mb-3 lg:p-1 mt-5 p-2">
          <input
            type="text"
            id="nameInput"
            className="border border-black outline-none rounded-md p-2 h-10 w-full"
            placeholder="Name"
            onChange={handleData}
            value={store.uName}
            name="uName"
          />
          {nameError && <div className="text-red-600">{nameError}</div>}
        </div>
        <div className="mb-3 lg:p-1 p-2">
          <input
            type="tel"
            className="border border-black outline-none rounded-md h-10 p-2 w-full"
            placeholder="Mobile No."
            onChange={handleData}
            value={store.mobile}
            maxLength={10}
            name="mobile"
          />
          {phoneError && <div className="text-red-600">{phoneError}</div>}
        </div>
        <div className="mb-3 mt-5">
          <p className="mx-auto px-2 text-lg">
            I agree to <span className="colors">Terms & Conditions</span> and{" "}
            <span className="colors">Privacy Statement</span>.
          </p>
        </div>
        <button
          onClick={handleApi}
          className="p-2 bg-red-600 mt-5 mb-10 w-full rounded-md text-white flex justify-center items-center text-2xl"
          disabled={loader}
        >
          <div>{loader ? "Loading..." : "Next"}</div>
        </button>
      </div>
    </div>
  );
}