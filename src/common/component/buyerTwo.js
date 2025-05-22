import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import BottomBar from "./bottomBar";
import Navbar from "./navbar";
import { liveUrl, token } from "./url";
import Searching from "./searching";
import OurServices from "./ourServices";
export default function BuyerTwo() {
  const Navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [loader, setLoader] = useState(false);
  const [uname, setUname] = useState(false);
  const [selectedOption, setSelectedOption] = useState("residential");
  const [store, setStore] = useState({
    uName: "",
    mobile: "",
  });
  const ValidateEmail = () => {
    if (!/^\d{10}$/.test(store.mobile)) {
      setClick("Mobile number should be 10 digits long.");
    } else {
      setClick("");
    }
  };
  const ValidateName = () => {
    if (store.uName.length < 3) {
      setUname("Name Must Be 3 letter");
    } else {
      setUname(true);
    }
  };
  const [user, setUser] = useState("Individual Customer");
  console.log(user, "this is user");
  const handleData = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };
  const handleApi = () => {
    ValidateEmail();
    ValidateName();
    setLoader(false);
    fetch(
      `${liveUrl}api/Buyer/addBuyer`,
      {
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
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "done") {
          setClick(true);
          setUname(true);
          setLoader(true);
          Navigate("/budget");
          setStore("");
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
      <Navbar />
      <div className="  flex justify-center items-center">
        <div className="container mx-auto  lg:w-[800px]   border shadow-lg   w-full   flex justify-center items-center">
          <div className="      ">
            <div className="font-bold lg:text-3xl mt-5  text-center mb-4">
              Contact Us
            </div>
            <div className="  w-full  flex justify-center  items-center  rounded-md">
              <fieldset>
                <div className="flex items-center gap-5">
                  <label
                    className=" lg:text-xl font-bold text-sm"
                    for="option1"
                  >
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
                  <label className=" lg:text-xl text-sm" for="option2 ">
                    Individual
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
                  <input
                    className="w-5 h-5 outline-none"
                    type="radio"
                    id="option4"
                    name="Dealer"
                    value="Dealer"
                    checked={user === "Dealer"}
                    onChange={handleSelectUser}
                  />
                  <label className=" lg:text-xl text-sm" for="option3">
                    Dealer
                  </label>
                </div>
                <div className="mb-3  lg:p-1 mt-5 p-2">
                  <input
                    type="text"
                    id="disabledTextInput"
                    className="border border-black outline-none rounded-md  p-2 h-12 w-full"
                    placeholder="Name"
                    onChange={handleData}
                    value={store.uName}
                    name="uName"
                  />
                  {click && store.uName.length < 3 ? (
                    <div className="text-red-600">Name Must Be 3 letter</div>
                  ) : null}
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
                  {click && store.mobile.length < 10 ? (
                    <div className="text-red-600">
                      Mobile number is not valid
                    </div>
                  ) : null}
                  {click && store.mobile.length > 10 ? (
                    <div className="text-red-600">
                      Mobile number is not valid
                    </div>
                  ) : null}
                </div>
                <button
                  onClick={handleApi}
                  className="p-2 bg-red-600 mt-5 mb-10 w-full rounded-md text-white flex justify-center items-center text-2xl"
                >
                  <div>Next</div>
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
  );
}
