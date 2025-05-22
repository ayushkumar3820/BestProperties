import React, { useState } from "react";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import { useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";
import OurServices from "./ourServices";
import Searching from "./searching";

export default function Budget() {
  const Navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(JSON.parse(localStorage.getItem("dataKey")));
  const [minBudget, setMinBudget] = useState({
    minBudget: "0",
    maxBudget: "1000000",
  });
  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    setMinBudget({
      minBudget: newValue.toString(),
      maxBudget: (10000000 + newValue).toString(),
    });
  };
  const Validate = () => {
    if (minBudget.minBudget) {
      console.log("false");
      return true;
    } else setClick(true);
    {
      return false;
    }
  };
  const handleApi = () => {
    setLoader(false);
    Validate();
    fetch(`${liveUrl}api/Buyer/addBuyer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Add any other headers you need
      },
      body: JSON.stringify({
        ...minBudget,
        infotype: "budget",
        mobile: data,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "done") {
          setLoader(true);
          Navigate("/requirment");
          console.log(data);
        } else {
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <Navbar />
    
      <div className=" flex justify-center items-center">
        <div className="container mt-14 mx-auto lg:w-[800px] shadow-lg border px-2 justify-center items-center">
          <h1 className="font-bold text-2xl text-center  text-green-800 mt-2">Budget</h1>
          <div className="mt-5"></div>
          <div>
            {click &&
            (minBudget.minBudget === "" || minBudget.maxBudget === "") ? (
              <div className="text-red-500 mt-1">
                Both values are required to fill
              </div>
            ) : null}
            <div className="mt-5">
              <div className="text-lg flex items-center justify-between">
                <div>Min Budget:0</div>
                <div>Max Budget: {minBudget.maxBudget}</div>
              </div>
            </div>
            <input
              type="range"
              className="w-full mt-2"
              name="budgetRange"
              min="0"
              max="10000000"
              value={parseInt(minBudget.minBudget)}
              onChange={handleSliderChange}
            />
          </div>
          {/* <div className="flex gap-1">
            <input type="checkbox" />
            <div className="text-green-600">
              I agree to the term and condition
            </div>
          </div> */}
          <button
            onClick={handleApi}
            className="bg-red-600 mb-14 text-white text-xl font-bold w-full rounded-md p-2 mt-5"
          >
            <div>Next</div>
          </button>
        </div>
      </div>
      <div className="">
        <OurServices />
        <Searching />
        <BottomBar />
      </div>
    </div>
  );
}
