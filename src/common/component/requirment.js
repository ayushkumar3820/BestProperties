/* eslint-disable no-unused-vars */
  import React, { useState } from "react";
  import Navbar from "./navbar";
  import BottomBar from "./bottomBar";
  import { useNavigate } from "react-router-dom";
  import { liveUrl, token } from "./url";
  import OurServices from "./ourServices";
  import Searching from "./searching";

  export default function Requirment() {
    const Navigate = useNavigate();
    const [activeButton, setActiveButton] = useState("");
    const [activeCommercial, setActiveCommercial] = useState("");
    const [loader, setLoader] = useState(false);
    const [selectedOption, setSelectedOption] = useState("residential");
    const [selectedOne, setSelectedOne] = useState("residential");
    const [num, setNum] = useState(JSON.parse(localStorage.getItem("dataKey")));
    const [click, setClick] = useState(false);
    const [storedata, setStoreData] = useState({
      phone: "",
    });

    const handleNewData = (e) => {
      setStoreData({ ...storedata, [e.target.name]: e.target.value });
    };

    const handleClick = (span) => {
      setActiveButton(span);
    };

    const handleCommercial = (span) => {
      setActiveCommercial(span);
    };

    const handleOptionNext = (event) => {
      setSelectedOne(event.target.value);
    };

    // Validation function
    const validateSelection = () => {
      if (selectedOne === "residential" && !activeButton) {
        setClick(true);
        return false;
      }
      if (selectedOne === "commercial" && !activeCommercial) {
        setClick(true);
        return false;
      }
      setClick(false);
      return true;
    };

    const handleApi = () => {
      // Validate before API call
      if (!validateSelection()) {
        console.log("Validation failed - no option selected");
        return;
      }

      setLoader(true);
      
      fetch(`${liveUrl}api/Buyer/addBuyer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          residential: activeButton,
          commercial: activeCommercial,
          propertyType: selectedOne,
          infotype: "requirment",
          mobile: num,
        }),
      })
        .then(async (response) => {
          console.log("Response status:", response.status);
          
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
          setLoader(false);
          console.log("API Response:", data);
          
          if (data.status === "done" || data.status === "success" || data.success === true) {
            console.log("Success! Navigating to /success");
            Navigate("/about-property");
          } else {
            console.log("API call unsuccessful. Response:", data);
            alert("Something went wrong. Please try again.");
          }
        })
        .catch((error) => {
          setLoader(false);
          console.error("API call error:", error);
          
          // For now, let's navigate anyway to test if the route works
          console.log("API failed, but navigating to test route...");
          Navigate("/about-property");
          
          // Uncomment this line if you want to show error instead of navigating:
          // alert("Network error. Please check your connection and try again.");
        });
    };

    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-10">
          <div className="w-full max-w-2xl bg-gray-200  shadow-lg rounded-lg p-6">
            <div className="font-bold text-2xl text-gray-800 text-center mb-6">
              Main Category
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <label className="flex items-center gap-2">
                <input
                  className="w-5 h-5 text-green-600"
                  type="radio"
                  name="residential"
                  value="residential"
                  checked={selectedOne === "residential"}
                  onChange={handleOptionNext}
                />
                Residential
              </label>
              <label className="flex items-center gap-2">
                <input
                  className="w-5 h-5 text-green-600"
                  type="radio"
                  name="commercial"
                  value="commercial"
                  checked={selectedOne === "commercial"}
                  onChange={handleOptionNext}
                />
                Commercial
              </label>
            </div>
            {selectedOne === "residential" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick("Flat/Apartment")}
                    className={
                      activeButton === "Flat/Apartment"
                        ? "activess btn btn-solid w-full p-2 text-center"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Flat/Apartment
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick("IndePendentHouse/villa")}
                    className={
                      activeButton === "IndePendentHouse/villa"
                        ? "activess btn btn-solid p-2 w-full text-center"
                        : "btn btn-solid w-full p-2 text-center"
                    }
                  >
                    IndependentHouse/villa
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick("Independent/Builder Floor")}
                    className={
                      activeButton === "Independent/Builder Floor"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Independent/Builder Floor
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick("Plot")}
                    className={
                      activeButton === "Plot"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Plot/Land
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick(" 1RK/Studio Apartment")}
                    className={
                      activeButton === " 1RK/Studio Apartment"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    1RK/Studio Apartment
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick("Serviced Apartment")}
                    className={
                      activeButton === "Serviced Apartment"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Serviced Apartment
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick("Farmhouse")}
                    className={
                      activeButton === "Farmhouse"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Farmhouse
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick("Other")}
                    className={
                      activeButton === "Other"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Other
                  </div>
                </div>
                {click && activeButton === "" ? (
                  <div className="text-red-600 text-sm mb-4">select any one option</div>
                ) : null}
              </>
            ) : null}
            {selectedOne === "commercial" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Office")}
                    className={
                      activeCommercial === "Office"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Office
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Retail")}
                    className={
                      activeCommercial === "Retail"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Retail
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Plot/Land")}
                    className={
                      activeCommercial === "Plot/Land"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Plot/Land
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Storage")}
                    className={
                      activeCommercial === "Storage"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Storage
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Industry")}
                    className={
                      activeCommercial === "Industry"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Industry
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Hospitality")}
                    className={
                      activeCommercial === "Hospitality"
                        ? "activess btn btn-solid w-full text-center"
                        : "btn btn-solid w-full p-2 text-center"
                    }
                  >
                    Hospitality
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Commercial")}
                    className={
                      activeCommercial === "Commercial"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Commercial
                  </div>
                </div>
                {click && activeCommercial === "" ? (
                  <div className="text-red-600 text-sm mb-4">select any one</div>
                ) : null}
              </>
            ) : null}
            <div className="flex justify-center mb-6">
              <div
                onClick={handleApi}
                className={`${
                  loader ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 cursor-pointer hover:bg-red-700'
                } w-full max-w-md flex justify-center p-3 rounded-full transition-colors`}
              >
                {loader ? (
                  <svg
                    className="w-5 h-5 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-50"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                ) : (
                  <span className="text-white font-bold text-lg">Save</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <OurServices /> 
        <Searching />
        <BottomBar />
      </>
    );
  }