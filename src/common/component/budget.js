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
  const [userType, setUserType] = useState(null);
  const [minBudget, setMinBudget] = useState({
    minBudget: "200000", // Default to 2 Lac for Individual
    maxBudget: "200000000", // Default to 20 Cr for Individual
  });

  // Function to format budget (e.g., 2000000 to "2 Cr")
  const formatBudget = (amount) => {
    const num = parseInt(amount, 10); // Ensure base-10 parsing
    if (isNaN(num)) return "₹0";
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(2).replace(/\.00$/, "")} Lac`;
    } else {
      return `₹${num.toLocaleString()}`;
    }
  };

  useEffect(() => {
    console.log("Budget component mounted - checking localStorage...");

    const possibleKeys = ["dataKey", "mobile", "phoneNumber", "userMobile"];
    let foundData = null;

    possibleKeys.forEach((key) => {
      const storedValue = localStorage.getItem(key);
      console.log(`Checking localStorage key '${key}':`, storedValue);
      if (
        storedValue &&
        storedValue !== "" &&
        storedValue !== "null" &&
        storedValue !== "undefined"
      ) {
        foundData = storedValue;
        console.log(`Found data in localStorage with key '${key}':`, foundData);
      }
    });

    const storedUserType = localStorage.getItem("userType");
    console.log("Stored userType:", storedUserType);

    if (foundData && storedUserType) {
      setData(foundData);
      setUserType(storedUserType);
      console.log("Data and userType set successfully:", foundData, storedUserType);

      if (storedUserType === "Individual Customer") {
        setMinBudget({
          minBudget: "200000",
          maxBudget: "200000000",
        });
      } else if (storedUserType === "Investor") {
        setMinBudget({
          minBudget: "10000000",
          maxBudget: "10000000000",
        });
      }
    } else {
      console.error("No valid data or userType found in localStorage");
      console.log("All localStorage items:", { ...localStorage });
      alert("Phone number or user type not found. Please enter your details again.");
      Navigate("/requirment");
    }
  }, [Navigate]);

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10); // Ensure base-10 parsing
    let maxBudget;

    if (userType === "Individual Customer") {
      maxBudget = Math.min(newValue + 198000000, 200000000); // Cap at 20 Cr
    } else if (userType === "Investor") {
      maxBudget = Math.min(newValue + 9900000000, 10000000000); // Cap at 1000 Cr
    } else {
      maxBudget = newValue + 1000000;
    }

    setMinBudget({
      minBudget: newValue.toString(),
      maxBudget: maxBudget.toString(),
    });
    console.log("Updated minBudget:", {
      minBudget: newValue.toString(),
      maxBudget: maxBudget.toString(),
    });
  };

  const Validate = () => {
    const minVal = parseInt(minBudget.minBudget, 10);
    const maxVal = parseInt(minBudget.maxBudget, 10);
    if (!minBudget.minBudget || !minBudget.maxBudget || isNaN(minVal) || isNaN(maxVal) || minVal >= maxVal) {
      setClick(true);
      return false;
    }
    if (
      !data ||
      data === "" ||
      data === "null" ||
      data === "undefined" ||
      !userType
    ) {
      console.error("No valid phone number or user type found");
      alert("Phone number or user type not found. Please go back and enter your details again.");
      Navigate("/buyer");
      return false;
    }
    setClick(false);
    return true;
  };

  const handleApi = () => {
    console.log("Handle API called");
    console.log("Current data (phone):", data);
    console.log("Current userType:", userType);
    console.log("Current minBudget:", minBudget);

    if (!Validate()) {
      console.log("Validation failed - not proceeding with API call");
      return;
    }

    setLoader(true);
    
    // API payload matching backend expectations
    const apiPayload = {
      minBudget: minBudget.minBudget.trim(), // Backend expects 'minBudget'
      maxBudget: minBudget.maxBudget.trim(), // Backend expects 'maxBudget'
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

        const text = await response.text();
        console.log("Raw response:", text);

        let responseData;
        try {
          responseData = text ? JSON.parse(text) : { status: "error", message: "Empty response from server" };
        } catch (e) {
          throw new Error("Invalid JSON response: " + (text.length > 0 ? text.substring(0, 100) : "No content"));
        }

        if (!response.ok || responseData.status !== "done") {
          throw new Error(`API error! status: ${response.status}, message: ${responseData.message || "Unknown error"}`);
        }
        return responseData;
      })
      .then((responseData) => {
        setLoader(false);
        console.log("Full API Response:", JSON.stringify(responseData, null, 2));
        console.log("Response status:", responseData.status);

        if (responseData.status === "done") {
          console.log("API call successful - navigating to requirement");
          Navigate("/requirment");
        } else {
          console.log("API call unsuccessful. Response:", responseData);
          alert(responseData.message || "Something went wrong. Please try again.");
          Navigate("/requirment");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.error("API call error:", error);
        console.error("Error message:", error.message);
        alert("Network error or invalid response. Please check your connection and try again.");
        Navigate("/requirment");
      });
  };

  if (data === null || userType === null) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  let sliderMin, sliderMax, sliderStep;
  if (userType === "Individual Customer") {
    sliderMin = 200000;
    sliderMax = 200000000;
    sliderStep = 100000;
  } else if (userType === "Investor") {
    sliderMin = 10000000;
    sliderMax = 10000000000;
    sliderStep = 1000000;
  } else {
    sliderMin = 0;
    sliderMax = 10000000;
    sliderStep = 100000;
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
              <div className="text-red-500 mt-1">Both budget values are required and min must be less than max</div>
            ) : null}
            <div className="mt-5">
              <div className="text-lg flex items-center justify-between">
                <div>Min Budget: {formatBudget(minBudget.minBudget)}</div>
                <div>Max Budget: {formatBudget(minBudget.maxBudget)}</div>
              </div>
            </div>
            <input
              type="range"
              className="w-full mt-2"
              name="budgetRange"
              min={sliderMin}
              max={sliderMax}
              step={sliderStep}
              value={parseInt(minBudget.minBudget, 10)}
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