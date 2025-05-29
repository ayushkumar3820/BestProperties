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
    if (minBudget.minBudget && minBudget.minBudget !== "") {
      console.log("validation passed");
      setClick(false); // Reset error state
      return true;
    } else {
      setClick(true);
      return false;
    }
  };
  
  const handleApi = () => {
    // First validate, then proceed only if validation passes
    if (!Validate()) {
      console.log("Validation failed - not proceeding with API call");
      return; // Exit early if validation fails
    }
    
    setLoader(true); // Set loader to true when starting API call
    
    fetch(`${liveUrl}api/Buyer/addBuyer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...minBudget,
        infotype: "budget",
        mobile: data,
      }),
    })
      .then(async (response) => {
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        
        // Check if response is ok (status 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error("Server returned non-JSON response");
        }
        
        return response.json();
      })
      .then((data) => {
        setLoader(false); // Set loader to false when API call completes
        console.log("API Response:", data); // Debug: see full response
        
        // Check multiple possible success conditions
        if (data.status === "done" || data.status === "success" || data.success === true) {
          console.log("Success! Navigating to /requirment");
          Navigate("/requirment");
        } else {
          console.log("API call unsuccessful. Response:", data);
          alert("Something went wrong. Please try again.");
        }
      })
      .catch((error) => {
        setLoader(false); // Set loader to false on error
        console.error("API call error:", error);
        
        // For now, let's navigate anyway to test if the route works
        console.log("API failed, but navigating to test route...");
        Navigate("/requirment");
        
        // Uncomment this line if you want to show error instead of navigating:
        // alert("Network error. Please check your connection and try again.");
      });
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
                <div>Min Budget: {minBudget.minBudget}</div>
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
          <button
            onClick={handleApi}
            disabled={loader} // Disable button while loading
            className={`${
              loader ? 'bg-gray-400' : 'bg-red-600'
            } mb-14 text-white text-xl font-bold w-full rounded-md p-2 mt-5`}
          >
            <div>{loader ? 'Loading...' : 'Next'}</div>
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