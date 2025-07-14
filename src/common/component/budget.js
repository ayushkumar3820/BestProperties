import { useState, useEffect } from "react";
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
  const [location, setLocation] = useState("");
  const [minBudget, setMinBudget] = useState({
    minBudget: "",
    maxBudget: "",
  });
  const [city, setCity] = useState("Mohali");
  const [isLoading, setIsLoading] = useState(true); // for initial localStorage check

  const formatBudget = (amount) => {
    const num = parseInt(amount, 10);
    if (isNaN(num)) return "₹0";
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
    return `₹${num.toLocaleString()}`;
  };

  const budgetRanges = {
    "Individual Customer": [
      { label: "Below ₹50 Lac", min: "0", max: "5000000" },
      { label: "₹50 Lac – ₹1 Cr", min: "5000000", max: "10000000" },
      { label: "₹1 Cr – ₹2 Cr", min: "10000000", max: "20000000" },
      { label: "₹2 Cr – ₹5 Cr", min: "20000000", max: "50000000" },
      { label: "₹5 Cr – ₹10 Cr", min: "50000000", max: "100000000" },
      { label: "₹10 Cr – ₹20 Cr", min: "100000000", max: "200000000" },
    ],
    Investor: [
      { label: "₹2 Cr – ₹5 Cr", min: "20000000", max: "50000000" },
      { label: "₹5 Cr – ₹10 Cr", min: "50000000", max: "100000000" },
      { label: "₹10 Cr – ₹20 Cr", min: "100000000", max: "200000000" },
      { label: "₹20 Cr – ₹50 Cr", min: "200000000", max: "500000000" },
      { label: "₹50 Cr – ₹100 Cr", min: "500000000", max: "1000000000" },
      { label: "Above ₹100 Cr", min: "1000000000", max: "10000000000" },
    ],
      Dealer: [
      { label: "Below ₹50 Lac", min: "0", max: "5000000" },
      { label: "₹50 Lac – ₹1 Cr", min: "5000000", max: "10000000" },
      { label: "₹1 Cr – ₹2 Cr", min: "10000000", max: "20000000" },
      { label: "₹2 Cr – ₹5 Cr", min: "20000000", max: "50000000" },
      { label: "₹5 Cr – ₹10 Cr", min: "50000000", max: "100000000" },
      { label: "₹10 Cr – ₹20 Cr", min: "100000000", max: "200000000" },
    ],
  };

  useEffect(() => {
    const possibleKeys = ["dataKey", "mobile", "phoneNumber", "userMobile"];
    let foundData = null;

    possibleKeys.forEach((key) => {
      const storedValue = localStorage.getItem(key);
      if (
        storedValue &&
        storedValue !== "" &&
        storedValue !== "null" &&
        storedValue !== "undefined"
      ) {
        foundData = storedValue;
      }
    });

    const storedUserType = localStorage.getItem("userType");

    if (foundData && storedUserType) {
      setData(foundData);
      setUserType(storedUserType);

      const savedMin = localStorage.getItem("minBudget");
      const savedMax = localStorage.getItem("maxBudget");
      const savedLocation = localStorage.getItem("location");

      if (savedMin && savedMax) {
        setMinBudget({ minBudget: savedMin, maxBudget: savedMax });
      }

      if (savedLocation) {
        setLocation(savedLocation);
      }

      const savedCity = localStorage.getItem("city");
      if (savedCity) setCity(savedCity);

      setIsLoading(false);
    } else {
      Navigate("/requirment");
    }
  }, [Navigate]);

  const handleBudgetChange = (e) => {
    const selectedRange = budgetRanges[userType]?.find(
      (range) => range.label === e.target.value
    );
    if (selectedRange) {
      setMinBudget({
        minBudget: selectedRange.min,
        maxBudget: selectedRange.max,
      });

      localStorage.setItem("minBudget", selectedRange.min);
      localStorage.setItem("maxBudget", selectedRange.max);
      localStorage.setItem("location", e.target.value); 
    }
  };

  useEffect(() => {
    localStorage.setItem("city", city);
  }, [city]);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    localStorage.setItem("location", e.target.value);
  };

  const Validate = () => {
    if (!location || location.trim().length === 0 || !city) {
      setClick(true);
      return false;
    }
    setClick(false);
    return true;
  };

  const handleApi = () => {
    if (!Validate()) return;

    setLoader(true);

    const apiPayload = {
      minBudget: minBudget.minBudget.trim(),
      maxBudget: minBudget.maxBudget.trim(),
      infotype: "budget",
      mobile: data,
      location: location.trim(),
      city: city,
    };

    fetch(`${liveUrl}api/Buyer/addBuyer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiPayload),
    })
      .then(async (response) => {
        const text = await response.text();
        let responseData;
        try {
          responseData = text
            ? JSON.parse(text)
            : { status: "error", message: "Empty response" };
        } catch (e) {
          throw new Error("Invalid JSON response: " + text);
        }

        if (!response.ok || responseData.status !== "done") {
          throw new Error(
            `API error! status: ${response.status}, message: ${responseData.message}`
          );
        }
        return responseData;
      })
      .then(() => {
        setLoader(false);
        Navigate("/requirment");
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
        alert("Something went wrong. Please try again.");
        Navigate("/requirment");
      });
  };

  if (isLoading) {
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
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border p-6 mt-10 mx-auto">
          <h1 className="font-bold text-2xl text-center text-green-800 mb-3">
            Budget
          </h1>

          {click && (
            <div className="text-red-500 mb-3">
              Please select a valid budget range and enter your location.
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Select Budget Range <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={
                budgetRanges[userType]?.find(
                  (range) =>
                    range.min === minBudget.minBudget &&
                    range.max === minBudget.maxBudget
                )?.label || ""
              }
              onChange={handleBudgetChange}
            >
              <option value="">Select Budget Range</option>
              {budgetRanges[userType]?.map((range) => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>

            <div className="text-sm text-gray-600 mt-2 flex justify-between">
              <span>Min: {formatBudget(minBudget.minBudget || 0)}</span>
              <span>Max: {formatBudget(minBudget.maxBudget || 0)}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Preferred Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter preferred location"
              className="w-full p-2 border rounded-md"
              value={location}
              onChange={handleLocationChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Select City <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="Mohali">Mohali</option>
              <option value="Zirakpur">Zirakpur</option>
              <option value="Kharar">Kharar</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Panchkula">Panchkula</option>
            </select>
          </div>

          <button
            onClick={handleApi}
            disabled={loader}
            className={`${
              loader
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            } text-white text-xl font-bold w-full rounded-md p-3 transition mt-4`}
          >
            {loader ? "Loading..." : "Next"}
          </button>
        </div>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </div>
  );
}
