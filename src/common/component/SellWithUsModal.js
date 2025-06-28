import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";
import BottomBar from "./bottomBar";

export default function SellWithUs() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Track current step
  const [click, setClick] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [activeCommercial, setActiveCommercial] = useState("");
  const [active, setActive] = useState("");
  const [selectedOption, setSelectedOption] = useState("residential");
  const [message, setMessage] = useState("");
  const [storedata, setStoreData] = useState({ phone: "" });
  const [selectedFiles, setSelectedFiles] = useState([]); // New state for file selection

  // State for detailed property information
  const [propertyDetails, setPropertyDetails] = useState({
    // Residential fields
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
    ownershipType: "",
    propertyAge: "",
    gatedCommunity: "",
    availableFrom: "",
    // Commercial fields
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
    // Location fields
    state: "",
    city: "",
    locality: "",
    landmark: "",
    pinCode: "",
    mapLink: "",
  });

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      navigate("/login");
    } else {
      const phone = localStorage.getItem("phone");
      if (phone && phone.length === 10) {
        setStoreData({ phone });
      }
    }
  }, [navigate]);

  const handleNewData = (e) => {
    setStoreData({ ...storedata, [e.target.name]: e.target.value });
  };

  const handlePropertyDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setPropertyDetails((prev) => ({
        ...prev,
        [name]: checked ? "yes" : "no",
      }));
    } else {
      setPropertyDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files)); // Store selected files
  };

  const handleClickButton = (type) => {
    setActive(type);
  };

  const handleCommercial = (type) => setActiveCommercial(type);
  const handlePropertyType = (type) => setActiveButton(type);
  const handleOptionChange = (e) => setSelectedOption(e.target.value);

  const validateStep = () => {
    setMessage("");
    setClick(true);

    if (step === 1) {
      if (!active) {
        setMessage("Please select a property action (Sell/Rent)");
        return false;
      }
      if (selectedOption === "residential" && !activeButton) {
        setMessage("Please select a residential property type");
        return false;
      }
      if (selectedOption === "commercial" && !activeCommercial) {
        setMessage("Please select a commercial property type");
        return false;
      }
    } else if (step === 3) {
      if (!propertyDetails.locality) {
        setMessage("Please fill in the required Locality field");
        return false;
      }
      if (selectedFiles.length === 0) {
        setMessage("Please select at least one file");
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
    setClick(true);
    setMessage("");

    const finalPhone = isLoggedIn
      ? localStorage.getItem("phone")
      : storedata.phone;

    if (!finalPhone || finalPhone.length !== 10) {
      setMessage("Please enter a valid 10-digit phone number");
      return;
    }

    const payload = {
      ...storedata,
      ...propertyDetails,
      phone: finalPhone,
      propertyType: active,
      residential: activeButton,
      commercial: activeCommercial,
      files: selectedFiles.map((file) => file.name), // Include file names in payload
    };

    // Simulate file upload and delayed navigation
    setMessage("Uploading files, please wait...");
    setTimeout(() => {
      fetch(`${liveUrl}api/Seller/addSeller`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("panelTitle");
            localStorage.removeItem("responseData");
            navigate("/login");
            throw new Error("Unauthorized");
          }
          return response.json();
        })
        .then((data) => {
          setMessage(data.message || "Submission successful!");
          localStorage.setItem("responseData", JSON.stringify(payload));
          if (data.status === "done") {
            navigate("/confirmation"); // Navigate to confirmation page
          } else {
            setMessage(data.message || "Registration failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error in handleSubmit:", error);
          if (error.message !== "Unauthorized") {
            setMessage("An error occurred. Please try again.");
          }
        });
    }, 2000); // 2-second delay
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
            <div className="grid grid-cols-2 gap-4">
              <button
                style={{
                  border: "2px solid #D3D3D3",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  height: "45px",
                  cursor: "pointer",
                }}
                onClick={() => handleClickButton("sale")}
                className={
                  active === "sale" ? "activess btn btn-solid" : "btn btn-solid"
                }
              >
                Sell
              </button>
              <button
                style={{
                  border: "2px solid #D3D3D3",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  height: "45px",
                  cursor: "pointer",
                }}
                onClick={() => handleClickButton("Rent/Lease")}
                className={
                  active === "Rent/Lease"
                    ? "activess btn btn-solid"
                    : "btn btn-solid"
                }
              >
                Rent/Lease
              </button>
            </div>
            {click && active === "" && (
              <div className="text-red-600 mt-2">Select any one option</div>
            )}
            <div className="flex gap-5 mt-4">
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
              <>
                <div className="grid grid-cols-2 gap-2 mt-5">
                  {[
                    "Flat/Apartment",
                    "Independent House / Kothi",
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
                      }}
                      onClick={() => handlePropertyType(type)}
                      className={
                        activeButton === type
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {click && activeButton === "" && (
                  <div className="text-red-600 mt-2">Select any one option</div>
                )}
                {activeButton === "Flat/Apartment" && (
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
                {activeButton === "Independent House / Kothi" && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        House / Kothi Type
                      </label>
                      <select
                        name="bhkType"
                        value={propertyDetails.bhkType}
                        onChange={handlePropertyDetailsChange}
                        className="h-10 rounded p-2 border border-black w-full"
                      >
                        <option value="">Select House / Kothi Type</option>
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
                        Covered Area
                      </label>
                      <input
                        name="coveredArea"
                        value={propertyDetails.coveredArea}
                        onChange={handlePropertyDetailsChange}
                        className="h-10 rounded p-2 border border-black w-full"
                        type="text"
                        placeholder="Covered Area (sq.ft)"
                      />
                    </div>
                  </div>
                )}
                {activeButton === "Independent/Builder Floor" && (
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
                        <option value="Ground Floors">Ground Floors</option>
                        <option value="1st Floors">1st Floors</option>
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
                {activeButton === "Plot" && (
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
                        <option value="Ground Floors">Ground Floors</option>
                        <option value="1st Floors">1st Floors</option>
                        <option value="2nd Floor">2nd Floor</option>
                        <option value="3rd Floor">3rd Floor</option>
                        <option value="Top Floor">Top Floor</option>
                      </select>
                    </div>
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
                {activeButton === "Farmhouse" && (
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
                   ទ
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Is it Agricultural Land?
                      </label>
                      <div className="flex gap-4">
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
                {activeButton === "Serviced Apartment" && (
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
                      <option value="">Apartment Type</option>
                      <option value="1RK/Studio">1RK / Studio</option>
                      <option value="1BHK">1 BHK</option>
                      <option value="2BHK">2 BHK</option>
                      <option value="3BHK">3 BHK</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                )}
                {activeButton === "Other" && (
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
              </>
            )}
            {selectedOption === "commercial" && (
              <>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    "Office",
                    "Retail",
                    "Plot/Land",
                    "Storage",
                    "Industry",
                    "Hospital",
                    "Other",
                  ].map((type) => (
                    <button
                      key={type}
                      style={{
                        border: "2px solid #D3D3D3",
                        borderRadius: "10px",
                        backgroundColor: "white",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCommercial(type)}
                      className={
                        activeCommercial === type
                          ? "activess btn btn-solid w-full p-2 text-center"
                          : "btn btn-solid w-full p-2 text-center"
                      }
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {click && activeCommercial === "" && (
                  <div className="text-red-600 mt-2">Select any one option</div>
                )}
                {(activeCommercial === "Office" ||
                  activeCommercial === "Retail") && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
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
                {activeCommercial === "Plot/Land" && (
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
                {(activeCommercial === "Storage" ||
                  activeCommercial === "Industry") && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Built Area
                      </label>
                      <input
                        name="builtArea"
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
                {activeCommercial === "Hospitality" && (
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
                {activeCommercial === "Other" && (
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
              </>
            )}
          </div>
        );
      case 2:
        return (
          <div>
            {selectedOption === "residential" && activeButton && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Furnishing Status
                  </label>
                  <select
                    name="furnishingStatus"
                    value={propertyDetails.furnishingStatus}
                    onChange={handlePropertyDetailsChange}
                    className="h-10 rounded p-2 border border-black w-full"
                  >
                    <option value="">Select</option>
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully-Furnished">Fully Furnished</option>
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
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Property Floor Number
                  </label>
                  <input
                    name="propertyFloor"
                    value={propertyDetails.propertyFloor}
                    onChange={handlePropertyDetailsChange}
                    className="h-10 rounded p-2 border border-black w-full"
                    type="text"
                    placeholder="Floor Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Carpet Area
                  </label>
                  <input
                    name="carpetArea"
                    value={propertyDetails.carpetArea}
                    onChange={handlePropertyDetailsChange}
                    className="h-10 rounded p-2 border border-black w-full"
                    type="text"
                    placeholder="Carpet Area (sq.ft)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Property Age
                  </label>
                  <select
                    name="propertyAge"
                    value={propertyDetails.propertyAge}
                    onChange={handlePropertyDetailsChange}
                    className="h-10 rounded p-2 border border-black w-full"
                  >
                    <option value="">Select Age</option>
                    <option value="0-1 year">0-1 year</option>
                    <option value="1-5 years">1-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gated Community?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gatedCommunity"
                        value="yes"
                        checked={propertyDetails.gatedCommunity === "yes"}
                        onChange={handlePropertyDetailsChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gatedCommunity"
                        value="no"
                        checked={propertyDetails.gatedCommunity === "no"}
                        onChange={handlePropertyDetailsChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Available From Date
                  </label>
                  <input
                    name="availableFrom"
                    value={propertyDetails.availableFrom}
                    onChange={handlePropertyDetailsChange}
                    className="h-10 rounded p-2 border border-black w-full"
                    type="date"
                  />
                </div>
              </div>
            )}
            {selectedOption === "commercial" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Furnishing Status
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
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Carpet Area
                  </label>
                  <input
                    name="carpetArea"
                    value={propertyDetails.carpetArea}
                    onChange={handlePropertyDetailsChange}
                    className="h-10 rounded p-2 border border-black w-full"
                    type="text"
                    placeholder="Carpet Area (sq.ft)"
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 3:
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
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Upload Property Documents *
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="h-10 rounded p-2 border border-black w-full"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {selectedFiles.length > 0 && (
                  <p className="mt-2 text-sm">
                    Selected files: {selectedFiles.map((file) => file.name).join(", ")}
                  </p>
                )}
              </div>
            </div>
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
            Posting your property is free, so get started.
          </h6>
        </div>
        <div>
          <p className="mt-3 text-lg font-semibold">
            Step {step} of 3
          </p>
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
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              onClick={handleSubmit}
            >
              Submit Property
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