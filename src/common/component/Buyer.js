import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";
export default function Buyer() {
  const Navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [newData, setNewData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [uname, setUname] = useState(false);
  const [user, setUser] = useState("Individual Customer");
  const [store, setStore] = useState({
    uName: "",
    mobile: "",
  });
  const ValidateEmail = () => {
    if (!/^\d{10}$/.test(store.mobile)) {
      setClick("Mobile number is not valid.");
    } else {
      setClick(true);
    }
  };
  const ValidateName = () => {
    if (!/^\d{4}$/.test(store.uName)) {
      setUname("Name is not valid");
    } else {
      setUname(true);
    }
  };
  const handleData = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };
  const handleApi = () => {
    ValidateEmail();
    ValidateName();
    setLoader(false);
    fetch(`${liveUrl}api/Buyer/addBuyer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Add any other headers you need
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
          setClick(true);
          setUname(true);
          setLoader(true);
          Navigate("/budget");
          setNewData(data);
          console.log(data);
        } else {
        }
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    localStorage.setItem("dataKey", JSON.stringify(store.mobile));
  }, [store]);
  function handleSelectUser(event) {
    setUser(event.target.value);
  }
  return (
    <>
      <div className="container mx-auto  absolute  lg:mt-52 lg:ml-24 w-full lg:w-[400px] bg-white  flex justify-center items-center">
        <div className="px-4 py-6">
          <div className="font-bold lg:text-4xl mt-10 text-xl text-center mb-4">
            Buyer
          </div>
          <div className="flex gap-2 items-center justify-center">
            <label className=" lg:text-lg font-bold text-sm " for="option1">
              I am 
            </label>
            <input
              className="w-5 h-5 outline-none"
              type="radio"
              id="option2"
              name="Individual Customer"
              value="Individual Customer"
              onChange={handleSelectUser}
              checked={user === "Individual Customer"}
            />
            <label className=" lg:text-lg text-sm" for="option2 ">
              Individual
            </label>
            <input
              className="w-5 h-5 outline-none"
              type="radio"
              id="option4"
              name="Dealer"
              value="Dealer"
              checked={user === "Dealer"}
              onChange={handleSelectUser}
            />
            <label className=" lg:text-xl text-sm" for="option4">
              Dealer
            </label>
            <input
              className="w-5 h-5 outline-none"
              type="radio"
              id="option3"
              name="Invester"
              value="Invester"
              checked={user === "Invester"}
              onChange={handleSelectUser}
            />
            <label className=" lg:text-xl text-sm" for="option3">
              Investor
            </label>
          </div>
          <div className="mb-3  lg:p-1 mt-5 p-2 ">
            <input
              type="alphbet"
              id="disabledTextInput"
              className="border border-black outline-none rounded-md  p-2 h-10 w-full"
              placeholder="Name"
              onChange={handleData}
              value={store.uName}
              name="uName"
            />
            {uname && <div className="text-red-600">{uname}</div>}
          </div>
          <div className="mb-3 lg:p-1 p-2 ">
            <input
              type="number"
              className="border border-black outline-none rounded-md h-10 p-2 w-full"
              placeholder="Mobile No."
              onChange={handleData}
              value={store.mobile}
              maxLength={10}
              name="mobile"
            />
            {click && store.mobile.length < 10 ? (
              <div className="text-red-600">Mobile Number is not Valid</div>
            ) : null}
          </div>
          <div className="mb-3 mt-5">
            <p className="mx-auto   px-2 text-lg">
              I agree to <span className="colors">Terms & Conditions </span>
              and <span className="colors">Privacy Statement. </span>
            </p>
          </div>
          <button
            onClick={handleApi}
            className="p-2 bg-red-600 mt-5 mb-10 w-full rounded-md text-white flex justify-center items-center text-2xl"
          >
            <div>Next</div>
          </button>
        </div>
      </div>
    </>
  );
}
