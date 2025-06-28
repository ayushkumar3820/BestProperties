/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";
import BottomBar from "./bottomBar";

export default function Requirement() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [activeButton, setActiveButton] = useState("");
  const [activeCommercial, setActiveCommercial] = useState("");
  const [selectedOption, setSelectedOption] = useState("residential");
  const [click, setClick] = useState(false);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [storedata, setStoreData] = useState({ phone: "" });
  const [propertyDetails, setPropertyDetails] = useState({
    bhkType: "",
    floors: "",
    plotArea: "",
    coveredArea: "",
    farmArea: "",
    isAgricultural: "",
    furnishingStatus: "",
    totalFloors: "",
    propertyFloor: "",
    carpetArea: "",
    propertyAge: "",
    gatedCommunity: "",
    availableFrom: "",
    areaInSqft: "",
    floorNo: "",
    commercialFurnishing: "",
    hasLift: "",
    parkingAvailable: "",
    commercialApproval: "",
    widthLength: "",
    roadWidth: "",
    useType: "",
    builtArea: "",
    landArea: "",
    shutters: "",
    roofHeight: "",
    loadingBay: "",
    state: "",
    city: "",
    locality: "",
    landmark: "",
    pinCode: "",
    mapLink: "",
    budgetMin: "",
    budgetMax: "",
    buyerName: "",
    buyerEmail: "",
    buyerType: "",
    contactTime: "",
  });

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (authToken) {
      const phone = localStorage.getItem("phone");
      if (phone && phone.length === 10) {
        setStoreData({ phone });
      }
    }
  }, []);

  const handleNewData = (e) => {
    setStoreData({ ...storedata, [e.target.name]: e.target.value });
  };

  const handlePropertyDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropertyDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "yes" : "no") : value,
    }));
  };

  const handleClickButton = (type) => {
    setActiveButton(type);
  };

  const handleCommercial = (type) => {
    setActiveCommercial(type);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setActiveButton("");
    setActiveCommercial("");
  };

  const validateStep = () => {
    setMessage("");
    setClick(true);

    if (step === 1) {
      if (
        !isLoggedIn &&
        (!storedata.phone || !/^\d{10}$/.test(storedata.phone))
      ) {
        setMessage("Please enter a valid 10-digit phone number");
        return false;
      }
      if (!activeButton && selectedOption === "residential") {
        setMessage("Please select a residential property type");
        return false;
      }
      if (!activeCommercial && selectedOption === "commercial") {
        setMessage("Please select a commercial property type");
        return false;
      }
    } else if (step === 2) {
      if (!propertyDetails.locality) {
        setMessage("Please fill in the required Locality field");
        return false;
      }
    } else if (step === 3) {
      if (!propertyDetails.budgetMax) {
        setMessage("Please fill in the required Maximum Budget field");
        return false;
      }
      if (!propertyDetails.buyerName) {
        setMessage("Please fill in the required Buyer Name field");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setClick(false);
      setMessage("");
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setClick(false);
    setMessage("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (!validateStep()) {
      setLoader(false);
      return;
    }

    setClick(true);
    setMessage("");
    setLoader(true);

    const finalPhone = isLoggedIn
      ? localStorage.getItem("phone")
      : storedata.phone;

    if (!finalPhone || !/^\d{10}$/.test(finalPhone)) {
      setMessage("Please enter a valid 10-digit phone number");
      setLoader(false);
      return;
    }

    const payload = {
      ...storedata,
      ...propertyDetails,
      phone: finalPhone,
      residential: activeButton,
      commercial: activeCommercial,
      propertyType: selectedOption,
      infotype: "requirement",
    };

    fetch(`${liveUrl}api/Buyer/addBuyer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("panelTitle");
          localStorage.removeItem("responseData");
          navigate("/login");
          throw new Error("Unauthorized");
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(`Non-JSON response: ${text}`);
        }
        return response.json();
      })
      .then((data) => {
        setLoader(false);
        if (
          data.status === "done" ||
          data.status === "success" ||
          data.success === true
        ) {
          localStorage.setItem("responseData", JSON.stringify(payload));
          navigate("/success");
        } else {
          setMessage(data.message || "Submission failed. Please try again.");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.error("Error in handleSubmit:", error);
        if (error.message !== "Unauthorized") {
          setMessage("An error occurred. Please try again.");
        }
      });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            {!isLoggedIn && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  name="phone"
                  value={storedata.phone}
                  onChange={handleNewData}
                  className="h-10 rounded p-2 border border-black w-full"
                  type="text"
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
              </div>
            )}
            <div className="flex gap-5 mb-4">
              <label className="flex items-center">
                <input
                  className="w-5 h-5 mr-2"
                  type="radio"
                  name="propertyCategory"
                  value="residential"
                  checked={selectedOption === "residential"}
                  onChange={handleOptionChange}
                />
                Residential
              </label>
              <label className="flex items-center">
                <input
                  className="w-5 h-5 mr-2"
                  type="radio"
                  name="propertyCategory"
                  value="commercial"
                  checked={selectedOption === "commercial"}
                  onChange={handleOptionChange}
                />
                Commercial
              </label>
            </div>
            {selectedOption === "residential" && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Flat/Apartment",
                  "IndependentHouse/villa",
                  "Independent/Builder Floor",
                  "Plot",
                  "Serviced Apartment",
                  "Farmhouse",
                  "Other",
                ].map((type) => (
                  <button
                    key={type}
                    style={{
                      border: "2px solid #D3D3D3",
                      borderRadius: "10px",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClickButton(type)}
                    className={
                      activeButton === type
                        ? "active btn btn-solid w-full p-2 text-center"
                        : "btn btn-solid w-full p-2 text-center"
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
            {selectedOption === "commercial" && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Office",
                  "Retail",
                  "Plot/Land",
                  "Storage",
                  "Industry",
                  "Hospitality",
                  "Commercial",
                  "Other",
                ].map((type) => (
                  <button
                    key={type}
                    style={{
                      border: "2px solid #D3D3D3",
                      borderRadius: "10px",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial(type)}
                    className={
                      activeCommercial === type
                        ? "active btn btn-solid w-full p-2 text-center"
                        : "btn btn-solid w-full p-2 text-center"
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
            {click && message && (
              <div className="text-red-600 mt-2">{message}</div>
            )}
            {selectedOption === "residential" &&
              activeButton === "Flat/Apartment" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    BHK Type
                  </label>
                  <select
                    name="bhkType"
                    value={propertyDetails.bhkType}
                    onChange={handlePropertyDetailsChange}
                    className="h-10 rounded p-2 border border-black w-full"
                  >
                    <option value="">Select BHK Type</option>
                    <option value="1RK/Studio">1RK / Studio</option>
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="4BHK">4 BHK</option>
                    <option value="5BHK+">5 BHK +</option>
                  </select>
                </div>
              )}
            {selectedOption === "residential" &&
              activeButton === "IndependentHouse/villa" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      House / Villa Type
                    </label>
                    <select
                      name="bhkType"
                      value={propertyDetails.bhkType}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                    >
                      <option value="">Select House / Villa Type</option>
                      <option value="Single Story">Single Story</option>
                      <option value="Double Story">Double Story</option>
                      <option value="Duplex">Duplex</option>
                      <option value="Triplex">Triplex</option>
                      <option value="Villa Style">Villa Style</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Number of Floors
                    </label>
                    <input
                      name="floors"
                      value={propertyDetails.floors}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Number of Floors"
                    />
                  </div>
                </div>
              )}
            {selectedOption === "residential" &&
              activeButton === "Independent/Builder Floor" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Number of Floors
                    </label>
                    <select
                      name="bhkType"
                      value={propertyDetails.bhkType}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                    >
                      <option value="">Number of Floors</option>
                      <option value="Ground Floor">Ground Floor</option>
                      <option value="1st Floor">1st Floor</option>
                      <option value="2nd Floor">2nd Floor</option>
                      <option value="3rd Floor">3rd Floor</option>
                      <option value="Top Floor">Top Floor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Total Floors in Building
                    </label>
                    <input
                      name="totalFloors"
                      value={propertyDetails.totalFloors}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Total Floors"
                    />
                  </div>
                </div>
              )}
            {selectedOption === "residential" && activeButton === "Plot" && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Plot Area
                  </label>
                  <input
                    name="plotArea"
                    value={propertyDetails.plotArea}
                    onChange={handlePropertyDetailsChange}
                    className="h-10 rounded p-2 border border-black w-full"
                    type="text"
                    placeholder="Plot Area (sq.ft)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Width x Length
                  </label>
                  <input
                    name="widthLength"
                    value={propertyDetails.widthLength}
                    onChange={handlePropertyDetailsChange}
                    className="h-10 rounded p-2 border border-black w-full"
                    type="text"
                    placeholder="e.g., 30x40"
                  />
                </div>
              </div>
            )}
            {selectedOption === "residential" &&
              activeButton === "Farmhouse" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Plot Area
                    </label>
                    <input
                      name="plotArea"
                      value={propertyDetails.plotArea}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Plot Area (sq.ft)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Farm Area (Optional)
                    </label>
                    <input
                      name="farmArea"
                      value={propertyDetails.farmArea}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Farm Area (acres)"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Is it Agricultural Land?
                    </label>
                    <div class ="pedag-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isAgricultural"
                          value="yes"
                          checked={propertyDetails.isAgricultural === "yes"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isAgricultural"
                          value="no"
                          checked={propertyDetails.isAgricultural === "no"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              )}
            {selectedOption === "residential" &&
              activeButton === "Serviced Apartment" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Apartment Type
                  </label>
                  <select
                    name="bhkType"
                    value={propertyDetails.bhkType}
                    onChange={handlePropertyDetailsChange}
                    className="h-10 rounded p-2 border border-black w-full"
                  >
                    <option value="">Select Apartment Type</option>
                    <option value="1RK/Studio">1RK / Studio</option>
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
              )}
            {selectedOption === "residential" && activeButton === "Other" && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  Describe Property Type
                </label>
                <input
                  name="ownershipType"
                  value={propertyDetails.ownershipType}
                  onChange={handlePropertyDetailsChange}
                  className="h-10 rounded p-2 border border-black w-full"
                  type="text"
                  placeholder="Describe the property type"
                />
              </div>
            )}
            {selectedOption === "commercial" &&
              (activeCommercial === "Office" ) && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Office
                    </label>
                    <select
                      name="commercialFurnishing"
                      value={propertyDetails.commercialFurnishing}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                    >
                      <option value="">Select</option>
                      <option value="Bare Shell">Bare Shell</option>
                      <option value="Warm Shell">Warm Shell</option>
                      <option value="Fully Furnished">Fully Furnished</option>
                      <option value="Co-working Space">Co-working Space</option>
                      <option value="Managed Office">Managed Office</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Area in sq.ft
                    </label>
                    <input
                      name="areaInSqft"
                      value={propertyDetails.areaInSqft}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Area in sq.ft"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Floor No
                    </label>
                    <input
                      name="floorNo"
                      value={propertyDetails.floorNo}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Floor Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Is there a lift?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hasLift"
                          value="yes"
                          checked={propertyDetails.hasLift === "yes"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hasLift"
                          value="no"
                          checked={propertyDetails.hasLift === "no"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Parking Available?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="parkingAvailable"
                          value="yes"
                          checked={propertyDetails.parkingAvailable === "yes"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="parkingAvailable"
                          value="no"
                          checked={propertyDetails.parkingAvailable === "no"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Commercial Approval
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="commercialApproval"
                          value="yes"
                          checked={propertyDetails.commercialApproval === "yes"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="commercialApproval"
                          value="no"
                          checked={propertyDetails.commercialApproval === "no"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              )}
            {selectedOption === "commercial" &&
              activeCommercial === "Retail" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                     <select
                      name="commercialFurnishing"
                      value={propertyDetails.commercialFurnishing}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                    >
                      <option value="">Select</option>
                      <option value="Showroom">Showroom</option>
                      <option value="shop">Shop</option>
                      <option value="High-Street Retail">High-Street Retail</option>
                      <option value="Retail Space in Mall">Retail Space in Mall</option>
                      <option value="Managed Office">Managed Office</option>
                    </select>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Plot Area
                    </label>
                    <input
                      name="plotArea"
                      value={propertyDetails.plotArea}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Plot Area (sq.ft)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Width x Length
                    </label>
                    <input
                      name="widthLength"
                      value={propertyDetails.widthLength}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="e.g., 30x40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Road Width
                    </label>
                    <input
                      name="roadWidth"
                      value={propertyDetails.roadWidth}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Road Width (ft)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Use Type
                    </label>
                    <select
                      name="useType"
                      value={propertyDetails.useType}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                    >
                      <option value="">Select</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                </div>
              )}
               {selectedOption === "commercial" &&
              activeCommercial === "Plot/Land" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Plot Area
                    </label>
                    <input
                      name="plotArea"
                      value={propertyDetails.plotArea}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Plot Area (sq.ft)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Width x Length
                    </label>
                    <input
                      name="widthLength"
                      value={propertyDetails.widthLength}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="e.g., 30x40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Road Width
                    </label>
                    <input
                      name="roadWidth"
                      value={propertyDetails.roadWidth}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Road Width (ft)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Use Type
                    </label>
                    <select
                      name="useType"
                      value={propertyDetails.useType}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                    >
                      <option value="">Select</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                </div>
              )}
            {selectedOption === "commercial" &&
              (activeCommercial === "Storage" ||
                activeCommercial === "Industry") && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Built Area
                    </label>
                    <input
                      what is name="builtArea"
                      value={propertyDetails.builtArea}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Built Area (sq.ft)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Land Area
                    </label>
                    <input
                      name="landArea"
                      value={propertyDetails.landArea}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Land Area (sq.ft)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      No. of Shutters
                    </label>
                    <input
                      name="shutters"
                      value={propertyDetails.shutters}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Number of Shutters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Height of Roof
                    </label>
                    <input
                      name="roofHeight"
                      value={propertyDetails.roofHeight}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Height (ft)"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Loading/Unloading Bay
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="loadingBay"
                          value="yes"
                          checked={propertyDetails.loadingBay === "yes"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="loadingBay"
                          value="no"
                          checked={propertyDetails.loadingBay === "no"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              )}
            {selectedOption === "commercial" &&
              activeCommercial === "Hospitality" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Area in sq.ft
                    </label>
                    <input
                      name="areaInSqft"
                      value={propertyDetails.areaInSqft}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Area in sq.ft"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Furnishing
                    </label>
                    <select
                      name="commercialFurnishing"
                      value={propertyDetails.commercialFurnishing}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                    >
                      <option value="">Select</option>
                      <option value="Bare Shell">Bare Shell</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Furnished">Furnished</option>
                    </select>
                  </div>
                </div>
              )}
            {selectedOption === "commercial" &&
              (activeCommercial === "Storage" ||
                activeCommercial === "Industry") && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Built Area
                    </label>
                    <input
                      what is name="builtArea"
                      value={propertyDetails.builtArea}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Built Area (sq.ft)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Land Area
                    </label>
                    <input
                      name="landArea"
                      value={propertyDetails.landArea}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Land Area (sq.ft)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      No. of Shutters
                    </label>
                    <input
                      name="shutters"
                      value={propertyDetails.shutters}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Number of Shutters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Height of Roof
                    </label>
                    <input
                      name="roofHeight"
                      value={propertyDetails.roofHeight}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Height (ft)"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Loading/Unloading Bay
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="loadingBay"
                          value="yes"
                          checked={propertyDetails.loadingBay === "yes"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="loadingBay"
                          value="no"
                          checked={propertyDetails.loadingBay === "no"}
                          onChange={handlePropertyDetailsChange}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              )}
            {selectedOption === "commercial" &&
              activeCommercial === "Hospitality" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Area in sq.ft
                    </label>
                    <input
                      name="areaInSqft"
                      value={propertyDetails.areaInSqft}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                      type="text"
                      placeholder="Area in sq.ft"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Furnishing
                    </label>
                    <select
                      name="commercialFurnishing"
                      value={propertyDetails.commercialFurnishing}
                      onChange={handlePropertyDetailsChange}
                      className="h-10 rounded p-2 border border-black w-full"
                    >
                      <option value="">Select</option>
                      <option value="Bare Shell">Bare Shell</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Furnished">Furnished</option>
                    </select>
                  </div>
                </div>
              )}
            {selectedOption === "commercial" &&
              activeCommercial === "Other" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Describe Property Type
                  </label>
                  <input
                    name="ownershipType"
                    value={propertyDetails.ownershipType}
                    onChange={handlePropertyDetailsChange}
                    className="h-10 rounded p-2 border border-black w-full"
                    type="text"
                    placeholder="Describe the property type"
                  />
                </div>
              )}
          </div>
        );
      case 2:
        return (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  name="state"
                  value={propertyDetails.state}
                  onChange={handlePropertyDetailsChange}
                  className="h-10 rounded p-2 border border-black w-full"
                  type="text"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  name="city"
                  value={propertyDetails.city}
                  onChange={handlePropertyDetailsChange}
                  className="h-10 rounded p-2 border border-black w-full"
                  type="text"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Locality *
                </label>
                <input
                  name="locality"
                  value={propertyDetails.locality}
                  onChange={handlePropertyDetailsChange}
                  className="h-10 rounded p-2 border border-black w-full"
                  type="text"
                  placeholder="Locality"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Landmark
                </label>
                <input
                  name="landmark"
                  value={propertyDetails.landmark}
                  onChange={handlePropertyDetailsChange}
                  className="h-10 rounded p-2 border border-black w-full"
                  type="text"
                  placeholder="Landmark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pin Code
                </label>
                <input
                  name="pinCode"
                  value={propertyDetails.pinCode}
                  onChange={handlePropertyDetailsChange}
                  className="h-10 rounded p-2 border border-black w-full"
                  type="text"
                  placeholder="Pin Code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Map Link
                </label>
                <input
                  name="mapLink"
                  value={propertyDetails.mapLink}
                  onChange={handlePropertyDetailsChange}
                  className="h-10 rounded p-2 border border-black w-full"
                  type="text"
                  placeholder="Google Maps Link"
                />
              </div>
            </div>
            {click && message && (
              <div className="text-red-600 mt-2">{message}</div>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Buyer Name *
                </label>
                <input
                  name="buyerName"
                  value={propertyDetails.buyerName}
                  onChange={handlePropertyDetailsChange}
                  className="h-10 rounded p-2 border border-black w-full"
                  type="text"
                  placeholder="Buyer Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Buyer Email
                </label>
                <input
                  name="buyerEmail"
                  value={propertyDetails.buyerEmail}
                  onChange={handlePropertyDetailsChange}
                  className="h-10 rounded p-2 border border-black w-full"
                  type="email"
                  placeholder="Buyer Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Buyer Type
                </label>
                <select
                  name="buyerType"
                  value={propertyDetails.buyerType}
                  onChange={handlePropertyDetailsChange}
                  className="h-10 rounded p-2 border border-black w-full"
                >
                  <option value="">Select</option>
                  <option value="Individual">Individual</option>
                  <option value="Agent">Agent</option>
                  <option value="Investor">Investor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Preferred Contact Time
                </label>
                <input
                  name="contactTime"
                  value={propertyDetails.contactTime}
                  onChange={handlePropertyDetailsChange}
                  className="h-10 rounded p-2 border border-black w-full"
                  type="text"
                  placeholder="e.g., 10 AM - 6 PM"
                />
              </div>
            </div>
            {click && message && (
              <div className="text-red-600 mt-2">{message}</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full p-4 max-w-3xl mx-auto mt-8">
        <div className="text-red-600 text-center mb-4">{message}</div>
        <div className="flex justify-between items-center">
          <h6 className="text-2xl font-semibold text-green-600">
            Main Category
          </h6>
        </div>
        <div>
          <p className="mt-3 text-lg font-semibold">Step {step} of 3</p>
        </div>
        {renderStep()}
        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          {step < 3 && (
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              onClick={handleNext}
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              className={`${
                loader
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 cursor-pointer hover:bg-green-700"
              } text-white px-6 py-2 rounded-lg`}
              onClick={handleSubmit}
              disabled={loader}
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
                "Submit Requirement"
              )}
            </button>
          )}
        </div>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}