import React, { useState, useEffect } from "react";
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
  const [data, setData] = useState(null);
  const [minBudget, setMinBudget] = useState({
    minBudget: "0",
    maxBudget: "1000000",
  });

  // Check localStorage on component mount
  useEffect(() => {
    console.log("Budget component mounted - checking localStorage...");
    
    // Check multiple possible keys
    const possibleKeys = ["dataKey", "mobile", "phoneNumber", "userMobile"];
    let foundData = null;
    
    possibleKeys.forEach(key => {
      const storedValue = localStorage.getItem(key);
      console.log(`Checking localStorage key '${key}':`, storedValue);
      if (storedValue && storedValue !== "" && storedValue !== "null" && storedValue !== "undefined") {
        foundData = storedValue;
        console.log(`Found data in localStorage with key '${key}':`, foundData);
      }
    });

    if (foundData) {
      setData(foundData);
      console.log("Data set successfully:", foundData);
    } else {
      console.error("No valid data found in localStorage");
      console.log("All localStorage items:", {...localStorage});
      
      // Alert user and redirect back to buyer page
      alert("Phone number not found. Please enter your details again.");
      Navigate("/buyer");
    }
  }, [Navigate]);

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    setMinBudget({
      minBudget: newValue.toString(),
      maxBudget: (1000000 + newValue).toString(), // Fixed: was 10000000, should be reasonable range
    });
    console.log("Updated minBudget:", { 
      minBudget: newValue.toString(), 
      maxBudget: (1000000 + newValue).toString() 
    });
  };

  const Validate = () => {
    if (!minBudget.minBudget || !minBudget.maxBudget) {
      setClick(true);
      return false;
    }
    if (!data || data === "" || data === "null" || data === "undefined") {
      console.error("No valid phone number found");
      alert("Phone number not found. Please go back and enter your details again.");
      Navigate("/buyer");
      return false;
    }
    setClick(false);
    return true;
  };

  const handleApi = () => {
    console.log("Handle API called");
    console.log("Current data (phone):", data);
    console.log("Current minBudget:", minBudget);
    
    if (!Validate()) {
      console.log("Validation failed - not proceeding with API call");
      return;
    }

    setLoader(true);
    const apiPayload = {
      ...minBudget,
      infotype: "budget",
      mobile: data,
    };
    
    console.log("API Payload:", apiPayload);
    console.log("API URL:", `${liveUrl}api/Buyer/addBuyer`);
    
    fetch(`${liveUrl}api/Buyer/addBuyer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiPayload),
    })
      .then(async (response) => {
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setLoader(false);
        console.log("Full API Response:", JSON.stringify(responseData, null, 2));
        console.log("Response status:", responseData.status);
        
        // Check for multiple success conditions
        if (
          responseData.status === "done" || 
          responseData.status === "success" || 
          responseData.success === true ||
          responseData.statusCode === 200
        ) {
          console.log("API call successful - navigating to requirement");
          Navigate("/requirment");
        } else {
          console.log("API call unsuccessful. Response:", responseData);
          
          // For testing - navigate anyway, remove this in production
          console.log("Navigating anyway for testing...");
          Navigate("/requirment");
          
          // Uncomment for production:
          // alert("Something went wrong. Please try again.");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.error("API call error:", error);
        console.error("Error message:", error.message);
        
        // For testing - navigate anyway, remove this in production
        console.log("Navigating despite error for testing...");
        Navigate("/requirment");
        
        // Uncomment for production:
        // alert("Network error. Please check your connection and try again.");
      });
  };

  // Show loading state while checking localStorage
  if (data === null) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center">
        <div className="container mt-14 mx-auto lg:w-[800px] shadow-lg border px-2 justify-center items-center">
          <h1 className="font-bold text-2xl text-center text-green-800 mt-2">Budget</h1>
          
         
          
          <div className="mt-5"></div>
          <div>
            {click && (!minBudget.minBudget || !minBudget.maxBudget) ? (
              <div className="text-red-500 mt-1">
                Both budget values are required
              </div>
            ) : null}
            <div className="mt-5">
              <div className="text-lg flex items-center justify-between">
                <div>Min Budget: ₹{parseInt(minBudget.minBudget).toLocaleString()}</div>
                <div>Max Budget: ₹{parseInt(minBudget.maxBudget).toLocaleString()}</div>
              </div>
            </div>
            <input
              type="range"
              className="w-full mt-2"
              name="budgetRange"
              min="0"
              max="10000000"
              step="100000"
              value={parseInt(minBudget.minBudget)}
              onChange={handleSliderChange}
            />
          </div>
          <button
            onClick={handleApi}
            disabled={loader}
            className={`${
              loader ? "bg-gray-400" : "bg-red-600"
            } mb-14 text-white text-xl font-bold w-full rounded-md p-2 mt-5`}
          >
            <div>{loader ? "Loading..." : "Next"}</div>
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