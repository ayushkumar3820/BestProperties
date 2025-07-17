import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";
import BottomBar from "./bottomBar";
import { liveUrl, token } from "./url";

const propertyConfig = {
  residential: {
    "Flat/Apartment": {
      step1: [
        {
          name: "bhk",
          label: "Flat/Apartment Type",
          type: "select",
          placeholder: "Enter Flat/Apartment Type...",
          options: [
            "2BHK",
            "3BHK",
            "4BHK",
            "4+1BHK",
            "1BHK",
            "1RK/Studio",
            "3+1BHK",
            "2+1BHK",
            "Other",
          ],
        },
      ],
    },
    "Independent House / Kothi": {
      step1: [
        {
          name: "land",
          label: "Plot Area",
          type: "selectOrText",
          placeholder: "Plot Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "built",
          label: "Covered Area",
          type: "selectOrText",
          placeholder: "Covered Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "kothi_story_type",
          label: "Independent House / Kothi Type",
          type: "select",
          options: [
            "Single Story",
            "Double Story",
            "Duplex Story",
            "Triplex Story",
            "Villa Style",
          ],
        },
      ],
    },
    "Independent/Builder Floor": {
      step1: [
        {
          name: "floor_no",
          label: "Independent/Builder Floor Type",
          type: "select",
          options: [
            "Ground Floor",
            "1st Floor",
            "2nd Floor",
            "3rd Floor",
            "Top Floor",
          ],
        },
      ],
    },
    Plot: {
      step1: [
        {
          name: "land",
          label: "Plot Area",
          type: "selectOrText",
          placeholder: "Plot Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "width_length",
          label: "Width x Length",
          type: "text",
          placeholder: "e.g., 30x40",
        },
        {
          name: "road_width",
          label: "Road Width",
          type: "selectOrText",
          option: ["20ft", "30ft", "40ft", "50ft+"],
        },
      ],
    },
    "Serviced Apartment": {
      step1: [
        {
          name: "bhk",
          label: "Serviced Apartment Type",
          type: "select",
          options: ["1RK/Studio", "1BHK", "2BHK", "3BHK", "Penthouse"],
        },
      ],
    },
    Farmhouse: {
      step1: [
        {
          name: "land",
          label: "Plot Area",
          type: "selectOrText",
          placeholder: "Plot Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "additional",
          label: "Farm Area (Optional)",
          type: "selectOrText",
          placeholder: "Farm Area (acres)",
          option: ["sq.yard", "marla", "kanal", "acres"],
        },
      ],
    },
    Other: {
      step1: [
        {
          name: "property_type",
          label: "Describe Property Type",
          type: "text",
          placeholder: "Describe the property type",
        },
      ],
    },
  },
  commercial: {
    Office: {
      step1: [
        {
          name: "carpet",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.ft)",
          option: ["sq.ft", "marla", "kanal"],
        },
        {
          name: "furnishing_status",
          label: "Furnishing",
          type: "select",
          options: ["Bare Shell", "Semi-Furnished", "Furnished"],
        },
        {
          name: "sqft",
          label: "Area in sq.ft",
          type: "selectOrText",
          placeholder: "Area in sq.ft",
          option: ["sq.ft", "marla", "kanal"],
        },
      ],
    },
    Retail: {
      step1: [
        {
          name: "furnishing_status",
          label: "Furnishing",
          type: "select",
          options: ["Bare Shell", "Semi-Furnished", "Furnished"],
        },
        {
          name: "sqft",
          label: "Area in sq.ft",
          type: "selectOrText",
          placeholder: "Area in sq.ft",
          option: ["sq.ft", "marla", "kanal"],
        },
      ],
    },
    "Plot/Land": {
      step1: [
        {
          name: "land",
          label: "Plot Area",
          type: "selectOrText",
          placeholder: "Plot Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "width_length",
          label: "Width x Length",
          type: "text",
          placeholder: "e.g., 30x40",
        },
        {
          name: "road_width",
          label: "Road Width",
          type: "selectOrText",
          option: ["20ft", "30ft", "40ft", "50ft+"],
        },
        {
          name: "carpet",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.ft)",
          option: ["sq.ft", "marla", "kanal"],
        },
      ],
    },
    Storage: {
      step1: [
        {
          name: "built",
          label: "Built-Up Area",
          type: "selectOrText",
          placeholder: "Built Area (sq.ft)",
          option: ["sq.ft", "marla", "kanal"],
        },
        {
          name: "land",
          label: "Land Area",
          type: "selectOrText",
          placeholder: "Land Area (sq.ft)",
          option: ["sq.ft", "marla", "kanal"],
        },
      ],
    },
    Industry: {
      step1: [
        {
          name: "built",
          label: "Built Area",
          type: "selectOrText",
          placeholder: "Built Area (sq.ft)",
          option: ["sq.ft", "marla", "kanal"],
        },
        {
          name: "land",
          label: "Land Area",
          type: "selectOrText",
          placeholder: "Land Area (sq.ft)",
          option: ["sq.ft", "marla", "kanal"],
        },
      ],
    },
    Hospital: {
      step1: [
        {
          name: "property_type",
          label: "Describe Property Type",
          type: "text",
          placeholder: "Describe the property type",
        },
      ],
    },
    Other: {
      step1: [
        {
          name: "property_type",
          label: "Describe Property Type",
          type: "text",
          placeholder: "Describe the property type",
        },
      ],
    },
  },
};

const step3Fields = [
  {
    name: "timeline",
    label: "Timeline",
    type: "select",
    placeholder: "Select Timeline",
    options: [
      "Immediate",
      "Within Week",
      "Within Month",
      "1-3 Months",
      "3-6 Months",
      "6+ Months",
    ],
  },
  {
    name: "requirement",
    label: "Any Specific Requirements",
    type: "textarea",
    placeholder: "Specify any specific requirements (max 200 characters)",
    maxLength: 200,
  },
];

export default function BuyProperty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState("residential");
  const [activeButton, setActiveButton] = useState("");
  const [activeCommercial, setActiveCommercial] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");
  const [message, setMessage] = useState("");
  const [errorModal, setErrorModal] = useState({ isOpen: false, messages: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [storedata, setStoreData] = useState({
    userMobile: "",
    person: "",
  });

  const [propertyDetails, setPropertyDetails] = useState({
    bhk: "",
    kothi_story_type: "",
    floor_no: "",
    total_floors: "",
    land: "",
    land_unit: "",
    built: "",
    built_unit: "",
    additional: "",
    additional_unit: "",
    furnishing_status: "",
    carpet: "",
    carpet_unit: "",
    property_type: "",
    sqft: "",
    sqft_unit: "",
    width_length: "",
    road_width: "",
    road_width_unit: "",
    address: "",
    requirement: "",
    timeline: "",
  });

  useEffect(() => {
    const buyerData = localStorage.getItem("buyerFormData");
    if (buyerData) {
      try {
        const parsedBuyerData = JSON.parse(buyerData);
        const userMobile = parsedBuyerData.mobile || "";
        const person = parsedBuyerData.uName || "";
        setStoreData({ userMobile, person });
      } catch (err) {
        console.error("Invalid buyerFormData format", err);
        setStoreData({ userMobile: "", person: "" });
      }
    }
  }, []);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setCurrentCategory(e.target.value);
    setPropertyDetails((prev) => ({
      ...prev,
      property_type: e.target.value,
    }));
    setActiveButton("");
    setActiveCommercial("");
    setShowBackButton(false);
  };

  const handlePropertyDetailsChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResidentialProperty = (type) => {
    setActiveButton(type);
    setActiveCommercial("");
    setCurrentCategory("residential");
    setSelectedOption("residential");
    setPropertyDetails((prev) => ({
      ...prev,
      property_type: "residential",
      property_type_sub: type,
    }));
    setShowBackButton(true);
  };

  const handleCommercialProperty = (type) => {
    setActiveCommercial(type);
    setActiveButton("");
    setCurrentCategory("commercial");
    setSelectedOption("commercial");
    setPropertyDetails((prev) => ({
      ...prev,
      property_type: "commercial",
      property_type_sub: type,
    }));
    setShowBackButton(true);
  };



  const handleNext = () => {
    const errors = [];
    if (!selectedOption) {
      errors.push(
        "Please select a property category (Residential or Commercial)."
      );
    }
    if (selectedOption && !propertyDetails.property_type_sub) {
      errors.push(`Please select a ${selectedOption} property type.`);
    }
    if (errors.length > 0) {
      setErrorModal({ isOpen: true, messages: errors });
      return;
    }
    setErrorModal({ isOpen: false, messages: [] });
    setStep(3);
  };

  const handleBack = () => {
    setErrorModal({ isOpen: false, messages: [] });
    if (step === 3) {
      setStep(1);
      setShowBackButton(true);
    } else if (step === 1) {
      navigate("/budget");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("");
    setErrorModal({ isOpen: false, messages: [] });

    const { userMobile, person } = storedata;
    const errors = [];
    if (!userMobile) {
      errors.push(
        "Mobile number is required. Please ensure it is stored in your profile."
      );
    }
    if (!person) {
      errors.push(
        "Name is required. Please ensure it is stored in your profile."
      );
    }
    if (!propertyDetails.timeline) {
      errors.push("Please select a timeline.");
    }
    if (errors.length > 0) {
      setErrorModal({ isOpen: true, messages: errors });
      setIsLoading(false);
      return;
    }

    const property_type_sub =
      currentCategory === "residential" ? activeButton : activeCommercial;
    const category = currentCategory;
    const property_for = "Buy";

const hotTimelineOptions = ["Immediate", "Within Week", "Within Month", "1-3 Months"];
const priority = hotTimelineOptions.includes(propertyDetails.timeline) ? "Hot" : "Cold";


    const payload = {
      infotype: "requirement",
      property_for,
      property_type: category,
      property_type_sub,
      uName: person,
      mobile: userMobile,
      address: propertyDetails.address,
      requirement: propertyDetails.requirement,
      status: "Pending",
      leads_type: "Buyer",
      priority:priority,
      rDate: new Date().toISOString(),
      userid: sessionStorage.getItem("userId") || 0,
      timeline: propertyDetails.timeline,
      bhk: propertyDetails.bhk,
      carpet: propertyDetails.carpet
        ? `${propertyDetails.carpet} ${propertyDetails.carpet_unit || "sq.ft"}`
        : "",
      built: propertyDetails.built
        ? `${propertyDetails.built} ${propertyDetails.built_unit || "sq.ft"}`
        : "",
      land: propertyDetails.land
        ? `${propertyDetails.land} ${propertyDetails.land_unit || "sq.ft"}`
        : "",
      additional: propertyDetails.additional
        ? `${propertyDetails.additional} ${
            propertyDetails.additional_unit || "acres"
          }`
        : "",
      floor_no: propertyDetails.floor_no,
      total_floors: parseInt(propertyDetails.total_floors) || null,
      kothi_story_type: propertyDetails.kothi_story_type,
      furnishing_status: propertyDetails.furnishing_status,
      width_length: propertyDetails.width_length,
      road_width: propertyDetails.road_width
        ? `${propertyDetails.road_width} ${
            propertyDetails.road_width_unit || "ft"
          }`
        : "",
      sqft: propertyDetails.sqft
        ? `${propertyDetails.sqft} ${propertyDetails.sqft_unit || "sq.ft"}`
        : "",
    };

    console.log("Submitting payload:", payload);

    try {
      const authToken = token || localStorage.getItem("token");
      const response = await fetch(`${liveUrl}api/Buyer/addBuyer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("panelTitle");
          localStorage.removeItem("responseData");
          navigate("/success");
          throw new Error("Unauthorized: Please log in again");
        }
        throw new Error(data.message || "Something went wrong.");
      }

      setMessage(data.message || "Property submitted successfully!");
      navigate("/success");
    } catch (error) {
      setErrorModal({
        isOpen: true,
        messages: [error.message || "An error occurred. Please try again."],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setErrorModal({ isOpen: false, messages: [] });
  };

  const renderField = (field) => {
    const { name, label, type, placeholder, options, option, maxLength } =
      field;

    if (type === "select" && selectedOption && step === 1) {
      return (
        <div key={name} className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
            aria-label={label}
          >
            {label}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {options.map((option) => (
              <button
                key={option}
                onClick={() =>
                  handlePropertyDetailsChange({
                    target: { name, value: option },
                  })
                }
                className={`w-full px-3 py-2 border-2 rounded-lg text-sm font-medium text-center break-words transition-colors ${
                  propertyDetails[name] === option
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                }`}
                aria-pressed={propertyDetails[name] === option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (type === "select") {
      return (
        <div key={name} className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
            aria-label={label}
          >
            {label}
          </label>
          <select
            id={name}
            name={name}
            value={propertyDetails[name] || ""}
            onChange={handlePropertyDetailsChange}
            className="block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    } else if (type === "selectOrText") {
      return (
        <div key={name} className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
            aria-label={label}
          >
            {label}
          </label>
          <div className="flex w-full">
            <input
              id={name}
              name={name}
              value={propertyDetails[name] || ""}
              onChange={handlePropertyDetailsChange}
              className={`h-10 px-3 border border-gray-300 ${
                option ? "rounded-l-md" : "rounded-md"
              } flex-1 focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              type="text"
              placeholder={placeholder}
              maxLength={maxLength}
            />
            {option && (
              <select
                id={`${name}_unit`}
                name={`${name}_unit`}
                value={propertyDetails[`${name}_unit`] || option[0]}
                onChange={handlePropertyDetailsChange}
                className="h-10 px-3 border border-gray-300 rounded-r-md bg-gray-50 text-sm focus:ring-green-500 focus:border-green-500"
                aria-label={`${label} unit`}
              >
                {option.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      );
    } else if (type === "textarea") {
      return (
        <div key={name} className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
            aria-label={label}
          >
            {label}
          </label>
          <textarea
            id={name}
            name={name}
            value={propertyDetails[name] || ""}
            onChange={handlePropertyDetailsChange}
            className="block w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder={placeholder}
            maxLength={maxLength}
          />
        </div>
      );
    } else {
      return (
        <div key={name} className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
            aria-label={label}
          >
            {label}
          </label>
          <input
            id={name}
            name={name}
            value={propertyDetails[name] || ""}
            onChange={handlePropertyDetailsChange}
            className="block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            type={type}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        </div>
      );
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="flex gap-6 mt-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="residential"
                  checked={selectedOption === "residential"}
                  onChange={handleOptionChange}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                  aria-label="Residential property category"
                />
                <span className="ml-2 text-sm text-gray-600">Residential</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="commercial"
                  checked={selectedOption === "commercial"}
                  onChange={handleOptionChange}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                  aria-label="Commercial property category"
                />
                <span className="ml-2 text-sm text-gray-600">Commercial</span>
              </label>
            </div>
            {selectedOption === "residential" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {Object.keys(propertyConfig.residential).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleResidentialProperty(type)}
                      className={`w-full h-12 px-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                        activeButton === type
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                      } ${
                        activeButton && activeButton !== type ? "hidden" : ""
                      }`}
                      aria-label={`Select ${type} residential property`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {activeButton &&
                  propertyConfig.residential[activeButton]?.step1 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {propertyConfig.residential[activeButton].step1.map(
                        renderField
                      )}
                    </div>
                  )}
              </>
            )}
            {selectedOption === "commercial" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {Object.keys(propertyConfig.commercial).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleCommercialProperty(type)}
                      className={`w-full h-12 px-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                        activeCommercial === type
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      } ${
                        activeCommercial && activeCommercial !== type
                          ? "hidden"
                          : ""
                      }`}
                      aria-label={`Select ${type} commercial property`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {activeCommercial &&
                  propertyConfig.commercial[activeCommercial]?.step1 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {propertyConfig.commercial[activeCommercial].step1.map(
                        renderField
                      )}
                    </div>
                  )}
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {step3Fields.map(renderField)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 shadow rounded-lg">
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center">
            {message}
          </div>
        )}
        {errorModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-lg font-semibold text-red-600 mb-4">Error</h2>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                {errorModal.messages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
              <button
                onClick={closeModal}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Close error modal"
              >
                Close
              </button>
            </div>
          </div>
        )}
        <div>
          <div className="my-4 bg-gray-200 h-2 rounded-full">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                step === 1 ? "w-1/2 bg-black" : "w-full bg-black"
              }`}
            ></div>
          </div>
        </div>
        {renderStep()}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2">
          {step > 1 && (
            <button
              className="w-full sm:w-auto bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          {step < 3 && (
            <button
              className="w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              onClick={handleNext}
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-blue-400 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Details"}
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
