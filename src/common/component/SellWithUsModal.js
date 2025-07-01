import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { liveUrl } from "./url";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";
import BottomBar from "./bottomBar";

const propertyConfig = {
  residential: {
    "Flat/Apartment": {
      step1: [
        {
          name: "bhkType",
          label: "Flat/Apartment Type",
          type: "select",
          placeholder: "Enter Flat/Apartment Type...",
          options: [
            "1RK/Studio",
            "1BHK",
            "2BHK",
            "2+1BHK",
            "3BHK",
            "3+1BHK",
            "4BHK",
            "4+1BHK",
            "5BHK",
            "5+1BHK",
            "Other",
          ],
        },

        {
          name: "Which Floor Number",
          label: "Which Floor Number",
          type: "text",
          placeholder: "Which Floor Number",
        },
        {
          name: "Total number floor",
          label: "total Number floor",
          type: "text",
          placeholder: "which Floor Number",
        },
        {
          name: "BedRoom",
          label: "Total BedRoom",
          type: "select",
          placeholder: "BedRoom Number",
          options: ["1", "2", "3", "4", "5"],
        },
        {
          name: "BathRoom",
          label: "Total BathRoom",
          type: "select",
          placeholder: "BathRoom Number",
          options: ["1", "2", "3", "4", "5"],
        },
      ],
      step2: [
        {
          name: "carpetArea",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.ft)",
          option: ["sq.ft", "sq.yard"],
        },
        {
          name: "buildUpArea",
          label: "BuildUp Area",
          type: "selectOrText",
          placeholder: "BuildUp Area (sq.ft)",
          option: ["sq.ft", "sq.yard"],
        },
        {
          name: "landArea",
          label: "Land Area",
          type: "selectOrText",
          placeholder: "Land Area (sq.ft)",
          option: ["sq.ft", "sq.yard"],
        },
        {
          name: "constructionStatus",
          label: "Construction Status",
          type: "select",
          options: ["Ready To Move", "Re-Sale", "Under Construction"],
        },
        {
          name: "propertyAge",
          label: "Property Age",
          type: "select",
          options: ["0-1 year", "1-5 years", "5-10 years", "10+ years"],
        },
        {
          name: "amenities",
          label: "Amenities",
          type: "checkbox",
          options: [
            "Car Parking",
            "Security Services",
            "Water Supply",
            "Elevators",
            "Power Backup",
            "Gym",
            "Play Area",
            "Swimming Pool",
            "Restaurants",
            "Party Hall",
            "Temple and Religious Activity Place",
            "Cinema Hall",
            "Walking/Jogging Track",
          ],
        },

        {
          name: "gatedCommunity",
          label: "Gated Community?",
          type: "radio",
          options: ["yes", "no"],
        },
        {
          name: "inSociety",
          label: "Is this in a society?",
          type: "radio",
          options: ["yes", "no"],
        },
      ],
    },
    "Independent House / Kothi": {
      step1: [
        {
          name: "plotArea",
          label: "Plot Area",
          type: "selectOrText",
          placeholder: "Plot Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "coveredArea",
          label: "Covered Area",
          type: "selectOrText",
          placeholder: "Covered Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "houseType",
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
      step2: [
        {
          name: "constructionStatus",
          label: "Construction Status",
          type: "select",
          options: ["Ready To Move", "Re-Sale", "Under Construction"],
        },
        {
          name: "propertyAge",
          label: "Property Age",
          type: "select",
          options: ["0-1 year", "1-5 years", "5-10 years", "10+ years"],
        },
        {
          name: "gatedCommunity",
          label: "Gated Community?",
          type: "radio",
          options: ["yes", "no"],
        },
      ],
    },
    "Independent/Builder Floor": {
      step1: [
        {
          name: "floorType",
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
      step2: [
        {
          name: "constructionStatus",
          label: "Construction Status",
          type: "select",
          options: ["Ready To Move", "Re-Sale", "Under Construction"],
        },
        {
          name: "carpetArea",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "propertyAge",
          label: "Property Age",
          type: "select",
          options: ["0-1 year", "1-5 years", "5-10 years", "10+ years"],
        },
        {
          name: "direction",
          label: "Direction",
          type: "select",
          options: [
            "East",
            "West",
            "North",
            "South",
            "North-East",
            "North-West",
            "South-East",
            "South-West",
            "Other",
          ],
        },
        {
          name: "facing",
          label: "Facing",
          type: "select",
          options: [
            "Park Facing",
            "Main Road Facing",
            "Corner Facing",
            "Parking Facing",
            "Garden Facing",
            "Open Area Facing",
            "Club House Facing",
            "Market Facing",
            "Lake Facing",
            "Highway Facing",
            "Temple Facing",
            "School Facing",
            "Pool Facing",
            "other",
          ],
        },
        {
          name: "gatedCommunity",
          label: "Gated Community?",
          type: "radio",
          options: ["yes", "no"],
        },
      ],
    },
    Plot: {
      step1: [
        {
          name: "plotArea",
          label: "Plot Area",
          type: "selectOrText",
          placeholder: "Plot Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "widthLength",
          label: "Width x Length",
          type: "text",
          placeholder: "e.g., 30x40",
        },
        {
          name: "roadWidth",
          label: "Road Width",
          type: "select",
          options: ["20ft", "30ft", "40ft", "50ft+"],
        },
      ],
      step2: [
        {
          name: "direction",
          label: "Direction",
          type: "select",
          options: [
            "East",
            "West",
            "North",
            "South",
            "North-East",
            "North-West",
            "South-East",
            "South-West",
            "Other",
          ],
        },
        {
          name: "facing",
          label: "Facing",
          type: "select",
          options: [
            "Park Facing",
            "Main Road Facing",
            "Corner Facing",
            "Parking Facing",
            "Garden Facing",
            "Open Area Facing",
            "Club House Facing",
            "Market Facing",
            "Lake Facing",
            "Highway Facing",
            "Temple Facing",
            "School Facing",
            "Pool Facing",
            "other",
          ],
        },
      ],
    },
    "Serviced Apartment": {
      step1: [
        {
          name: "bhkType",
          label: "Serviced Apartment Type",
          type: "select",
          options: ["1RK/Studio", "1BHK", "2BHK", "3BHK", "Penthouse"],
        },
      ],
      step2: [
        {
          name: "constructionStatus",
          label: "Construction Status",
          type: "select",
          options: ["Ready To Move", "Re-Sale", "Under Construction"],
        },
        {
          name: "TotalFloor",
          label: "Total  Floor Number",
          type: "text",
          placeholder: "Total Floor Number",
        },
        {
          name: "carpetArea",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "propertyAge",
          label: "Property Age",
          type: "select",
          options: ["0-1 year", "1-5 years", "5-10 years", "10+ years"],
        },
        {
          name: "direction",
          label: "Direction",
          type: "select",
          options: [
            "East",
            "West",
            "North",
            "South",
            "North-East",
            "North-West",
            "South-East",
            "South-West",
            "Other",
          ],
        },
        {
          name: "facing",
          label: "Facing",
          type: "select",
          options: [
            "Park Facing",
            "Main Road Facing",
            "Corner Facing",
            "Parking Facing",
            "Garden Facing",
            "Open Area Facing",
            "Club House Facing",
            "Market Facing",
            "Lake Facing",
            "Highway Facing",
            "Temple Facing",
            "School Facing",
            "Pool Facing",
            "other",
          ],
        },
        {
          name: "gatedCommunity",
          label: "Gated Community?",
          type: "radio",
          options: ["yes", "no"],
        },
        {
          name: "inSociety",
          label: "Is this in a society?",
          type: "radio",
          options: ["yes", "no"],
        },
      ],
    },
    Farmhouse: {
      step1: [
        {
          name: "plotArea",
          label: "Plot Area",
          type: "selectOrText",
          placeholder: "Plot Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "farmArea",
          label: "Farm Area (Optional)",
          type: "selectOrText",
          placeholder: "Farm Area (acres)",
          option: ["sq.yard", "marla", "kanal","acres"],
        },
      ],
      step2: [
        {
          name: "furnishingStatus",
          label: "Furnishing Status",
          type: "select",
          options: ["Semi-Furnished", "Unfurnished", "Fully-Furnished"],
        },
        {
          name: "carpetArea",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "amenities",
          label: "Amenities",
          type: "checkbox",
          options: [
            "Car Parking",
            "Security Services",
            "Water Supply",
            "Elevators",
            "Power Backup",
            "Gym",
            "Play Area",
            "Swimming Pool",
            "Restaurants",
            "Party Hall",
            "Temple and Religious Activity Place",
            "Cinema Hall",
            "Walking/Jogging Track",
          ],
        },
        {
          name: "propertyAge",
          label: "Property Age",
          type: "select",
          options: ["0-1 year", "1-5 years", "5-10 years", "10+ years"],
        },
        {
          name: "nearBy",
          label: "Near By",
          type: "select",
          options: ["Hospital", "School", "Restaurant", "Store", "Other"],
        },
        {
          name: "gatedCommunity",
          label: "Gated Community?",
          type: "radio",
          options: ["yes", "no"],
        },
      ],
    },
    Other: {
      step1: [
        {
          name: "ownershipType",
          label: "Describe Property Type",
          type: "text",
          placeholder: "Describe the property type",
        },
      ],
      step2: [
        {
          name: "furnishingStatus",
          label: "Furnishing Status",
          type: "select",
          options: ["Semi-Furnished", "Unfurnished", "Fully-Furnished"],
        },
        {
          name: "carpetArea",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "propertyAge",
          label: "Property Age",
          type: "select",
          options: ["0-1 year", "1-5 years", "5-10 years", "10+ years"],
        },
      ],
    },
  },
  commercial: {
    Office: {
      step1: [
        {
          name: "carpetArea",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.ft)",
          option: ["sq.ft", "marla", "kanal"],
        },
        {
          name: "commercialFurnishing",
          label: "Furnishing",
          type: "select",
          options: ["Bare Shell", "Semi-Furnished", "Furnished"],
        },
        {
          name: "areaInSqft",
          label: "Area in sq.ft",
          type: "selectOrText",
          placeholder: "Area in sq.ft",
          option: ["sq.ft", "marla", "kanal"],
        },
        {
          name: "hasLift",
          label: "Is there lift?",
          type: "radio",
          options: ["yes", "no"],
        },
        {
          name: "parkingAvailable",
          label: "Parking Available?",
          type: "radio",
          options: ["yes", "no"],
        },
      ],
      step2: [],
    },
    Retail: {
      step1: [
        {
          name: "commercialFurnishing",
          label: "Furnishing",
          type: "select",
          options: ["Bare Shell", "Semi-Furnished", "Furnished"],
        },
        {
          name: "areaInSqft",
          label: "Area in sq.ft",
          type: "selectOrText",
          placeholder: "Area in sq.ft",
          option: ["sq.ft", "marla", "kanal"],
        },
        {
          name: "floorNo",
          label: "Floor No",
          type: "text",
          placeholder: "Floor Number",
        },
        {
          name: "hasLift",
          label: "Is there lift?",
          type: "radio",
          options: ["yes", "no"],
        },
        {
          name: "parkingAvailable",
          label: "Parking Available?",
          type: "radio",
          options: ["yes", "no"],
        },
      ],
      step2: [],
    },
    "Plot/Land": {
      step1: [
        {
          name: "plotArea",
          label: "Plot Area",
          type: "selectOrText",
          placeholder: "Plot Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "widthLength",
          label: "Width x Length",
          type: "text",
          placeholder: "e.g., 30x40",
        },
        {
          name: "roadWidth",
          label: "Road Width",
          type: "select",
          options: ["20ft", "30ft", "40ft", "50ft+"],
        },
        {
          name: "useType",
          label: "Use Type",
          type: "select",
          options: ["Industrial", "ShowRoom", "Shop"],
        },
        {
          name: "carpetArea",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
      ],
      step2: [],
    },
    Storage: {
      step1: [
        {
          name: "builtArea",
          label: "Built Area",
          type: "selectOrText",
          placeholder: "Built Area (sq.ft)",
          option: ["sq.ft", "marla", "kanal"],
        },
        {
          name: "landArea",
          label: "Land Area",
          type: "selectOrText",
          placeholder: "Land Area (sq.ft)",
          option: ["sq.ft", "marla", "kanal"],
        },
        {
          name: "shutters",
          label: "No. of Shutters",
          type: "text",
          placeholder: "Number of Shutters",
        },
        {
          name: "roofHeight",
          label: "Height of Roof",
          type: "text",
          placeholder: "Height (ft)",
        },
        {
          name: "loadingBay",
          label: "Loading/Unloading Bay",
          type: "radio",
          options: ["yes", "no"],
        },
      ],
      step2: [],
    },
    Industry: {
      step1: [
        {
          name: "builtArea",
          label: "Built Area",
          type: "selectOrText",
          placeholder: "Built Area (sq.ft)",
          option: ["sq.ft", "marla", "kanal"],
        },
        {
          name: "landArea",
          label: "Land Area",
          type: "selectOrText",
          placeholder: "Land Area (sq.ft)",
          option: ["sq.ft", "marla", "kanal"],
        },
        {
          name: "shutters",
          label: "No. of Shutters",
          type: "text",
          placeholder: "Number of Shutters",
        },
        {
          name: "roofHeight",
          label: "Height of Roof",
          type: "text",
          placeholder: "Height (ft)",
        },
        {
          name: "loadingBay",
          label: "Loading/Unloading Bay",
          type: "radio",
          options: ["yes", "no"],
        },
      ],
      step2: [],
    },
    Hospital: {
      step1: [
        {
          name: "hospitalType",
          label: "Hospital Type",
          type: "select",
          options: [
            "Multispecialty",
            "Clinic",
            "Diagnostic Centre",
            "Dental",
            "Orthopedic",
            "Maternity",
            "Eye Hospital",
          ],
        },
        {
          name: "noOfBeds",
          label: "Number of Beds",
          type: "select",
          placeholder: "Enter total beds",
          options: ["10", "20", "30", "50", "100+"],
        },
        {
          name: "floorAvailable",
          label: "Available Floor",
          type: "select",
          options: ["Ground", "1st", "2nd", "3rd", "Full Building"],
        },
        {
          name: "furnishing",
          label: "Furnishing Type",
          type: "select",
          options: [
            "Fully Furnished (Operational)",
            "Semi-Furnished",
            "Bare Shell",
          ],
        },
      ],
      step2: [
        {
          name: "medicalFacilities",
          label: "Medical Facilities Available",
          type: "checkbox",
          options: [
            "ICU Room",
            "Operation Theatre",
            "Emergency Room",
            "OPD Rooms",
            "Ambulance Parking",
            "Pharmacy Setup",
            "Doctor's Cabins",
            "Pathology Lab",
            "Radiology Room",
          ],
        },
        {
          name: "generalAmenities",
          label: "Building Amenities",
          type: "checkbox",
          options: [
            "Power Backup",
            "Lift",
            "Water Supply",
            "Fire Safety",
            "CCTV Surveillance",
            "Reception Area",
            "Parking",
          ],
        },
        {
          name: "hospitalLicense",
          label: "Hospital License Type",
          type: "select",
          options: [
            "Registered under Clinical Establishment Act",
            "Private Limited",
            "Proprietorship",
            "Other",
          ],
        },
        {
          name: "propertyAge",
          label: "Property Age",
          type: "select",
          options: ["0-3 Years", "3-5 Years", "5-10 Years", "10+ Years"],
        },
        {
          name: "possessionStatus",
          label: "Possession Status",
          type: "select",
          options: [
            "Operational",
            "Vacant",
            "Under Renovation",
            "Under Construction",
          ],
        },
      ],
    },
    Other: {
      step1: [
        {
          name: "ownershipType",
          label: "Describe Property Type",
          type: "text",
          placeholder: "Describe the property type",
        },
      ],
      step2: [],
    },
  },
};

// Common fields for step 3
const step3Fields = [
  {
    name: "Property Title",
    label: "Property Title",
    type: "text",
    placeholder: "Property Title",
  },
  {
    name: "propertyDesecration",
    label: "Property Description",
    type: "text",
    placeholder: "property description",
  },
  {
    name: "demandedPrice",
    label: "Demand Price",
    type: "text",
    placeholder: "Enter the correct price",
  },

  {
    name: "Location",
    label: "Location",
    type: "text",
    placeholder: "Location",
    required: true,
  },
];

export default function SellWithUs() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [click, setClick] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [activeCommercial, setActiveCommercial] = useState("");
  const [active, setActive] = useState("");
  const [selectedOption, setSelectedOption] = useState("residential");
  const [message, setMessage] = useState("");
  const [storedata, setStoreData] = useState({ phone: "" });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    bhkType: "",
    houseType: "",
    floorType: "",
    floors: "",
    plotArea: "",
    coveredArea: "",
    farmArea: "",
    furnishingStatus: "",
    totalFloors: "",
    propertyFloor: "",
    carpetArea: "",
    ownershipType: "",
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
    city: "",
    locality: "",
    landmark: "",
    pinCode: "",
    mapLink: "",
    demandedPrice: "",
    constructionStatus: "",
    propertyDescription: "",
    direction: "",
    facing: "",
    nearBy: "",
    inSociety: "",
    amenities: [],
    medicalFacilities: [],
    generalAmenities: [],
    hospitalLicense: "",
    possessionStatus: "",
    noOfBeds: "",
    floorAvailable: "",
  });
  const [additionalData, setAdditionalData] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      navigate("/sucess");
    } else {
      const phone = localStorage.getItem("phone");
      if (phone && phone.length === 10) {
        setStoreData({ phone });
      }
    }

    const dataUrl = process.env.REACT_APP_DATA_URL || "/data/sellwithus.json";
    fetch(dataUrl)
      .then((response) => response.json())
      .then((data) => setAdditionalData(data))
      .catch((error) =>
        console.error("Error fetching additional data:", error)
      );
  }, [navigate]);

  const handleNewData = (e) => {
    setStoreData({ ...storedata, [e.target.name]: e.target.value });
  };

  const handlePropertyDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setPropertyDetails((prev) => {
        const currentValues = Array.isArray(prev[name]) ? prev[name] : [];
        if (checked) {
          return { ...prev, [name]: [...currentValues, value] };
        } else {
          return {
            ...prev,
            [name]: currentValues.filter((item) => item !== value),
          };
        }
      });
    } else {
      setPropertyDetails((prev) => ({
        ...prev,
        [name]: type === "radio" ? value : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        setMessage(
          `Invalid file type for ${file.name}. Only PDF, JPG, and PNG are allowed.`
        );
        return false;
      }
      if (file.size > maxSize) {
        setMessage(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });
    setSelectedFiles(validFiles);
  };

  const handleClickButton = (type) => setActive(type);
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
      const fields =
        selectedOption === "residential"
          ? propertyConfig.residential[activeButton]?.step1 || []
          : propertyConfig.commercial[activeCommercial]?.step1 || [];
      for (const field of fields) {
        if (field.required && !propertyDetails[field.name]) {
          setMessage(`Please fill in the required ${field.label} field`);
          return false;
        }
      }
    } else if (step === 2) {
      const fields =
        selectedOption === "residential"
          ? propertyConfig.residential[activeButton]?.step2 || []
          : propertyConfig.commercial[activeCommercial]?.step2 || [];
      for (const field of fields) {
        if (field.required && !propertyDetails[field.name]) {
          setMessage(`Please fill in the required ${field.label} field`);
          return false;
        }
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

  const handleSubmit = async () => {
    setClick(true);
    setMessage("");
    setIsLoading(true);

    const finalPhone = isLoggedIn
      ? localStorage.getItem("phone")
      : storedata.phone;
    if (!finalPhone || !/^\d{10}$/.test(finalPhone)) {
      setMessage("Please enter a valid 10-digit phone number");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("phone", finalPhone);
    formData.append("propertyType", active);
    formData.append("residential", activeButton);
    formData.append("commercial", activeCommercial);
    formData.append(
      "submissionMessage",
      message || "Property details submitted"
    );
    Object.entries(propertyDetails).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    selectedFiles.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    if (additionalData) {
      formData.append("additionalData", JSON.stringify(additionalData));
    }
    formData.append("timestamp", new Date().toISOString());

    // Create JSON for download, excluding files
    const jsonData = {
      phone: finalPhone,
      propertyType: active,
      residential: activeButton,
      commercial: activeCommercial,
      submissionMessage: message || "Property details submitted",
      ...propertyDetails,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${liveUrl}api/Seller/addSeller`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("panelTitle");
          localStorage.removeItem("responseData");
          navigate("/sucess");
          throw new Error("Unauthorized");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message || "Submission successful!");
      localStorage.setItem("responseData", JSON.stringify(jsonData));

      const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(jsonBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "combinedData.json";
      link.click();
      URL.revokeObjectURL(url);

      if (data.status === "done") {
        navigate("/success");
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field) => {
    const { name, label, type, placeholder, options, option, required } = field;
    if (type === "select") {
      return (
        <div key={name} className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
          <select
            id={name}
            name={name}
            value={propertyDetails[name] || ""}
            onChange={handlePropertyDetailsChange}
            className="block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            required={required}
          >
            <option value="">{label}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    } else if (type === "radio") {
      return (
        <div key={name} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
          <div className="flex flex-wrap gap-4">
            {options.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={propertyDetails[name] === option}
                  onChange={handlePropertyDetailsChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  required={required}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
      );
    } else if (type === "checkbox") {
      return (
        <div key={name} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  name={name}
                  value={option}
                  checked={propertyDetails[name]?.includes(option) || false}
                  onChange={handlePropertyDetailsChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    } else if (type === "selectOrText") {
      return (
        <div key={name} className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
          <div className="flex w-full">
            {option && (
              <select
                id={`${name}_unit`}
                name={`${name}_unit`}
                value={propertyDetails[`${name}_unit`] || option[0]}
                onChange={handlePropertyDetailsChange}
                className="h-10 px-3 border border-gray-300 rounded-l-md bg-gray-50 text-sm focus:ring-green-500 focus:border-green-500"
              >
                {option.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            )}
            <input
              id={name}
              name={name}
              value={propertyDetails[name] || ""}
              onChange={handlePropertyDetailsChange}
              className={`h-10 px-3 border border-gray-300 ${
                option ? "rounded-r-md" : "rounded-md"
              } flex-1 focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              type="text"
              placeholder={placeholder}
              required={required}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div key={name} className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
          <input
            id={name}
            name={name}
            value={propertyDetails[name] || ""}
            onChange={handlePropertyDetailsChange}
            className="block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            type={type === "textarea" ? "text" : type}
            placeholder={placeholder}
            required={required}
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
            {!isLoggedIn && (
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={storedata.phone}
                  onChange={handleNewData}
                  className="block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  type="text"
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleClickButton("sale")}
                className={`w-full h-12 px-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                  active === "sale"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Sell
              </button>
              <button
                onClick={() => handleClickButton("Rent/Lease")}
                className={`w-full h-12 px-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                  active === "Rent/Lease"
                    ? "bg-black text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Rent/Lease
              </button>
            </div>
            {click && active === "" && (
              <div className="mt-2 text-sm text-red-600">
                Select any one option
              </div>
            )}
            <div className="flex gap-6 mt-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="propertyCategory"
                  value="residential"
                  checked={selectedOption === "residential"}
                  onChange={handleOptionChange}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Residential</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="propertyCategory"
                  value="commercial"
                  checked={selectedOption === "commercial"}
                  onChange={handleOptionChange}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Commercial</span>
              </label>
            </div>
            {selectedOption === "residential" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {Object.keys(propertyConfig.residential).map((type) => (
                    <button
                      key={type}
                      onClick={() => handlePropertyType(type)}
                      className={`w-full h-12 px-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                        activeButton === type
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {click && activeButton === "" && (
                  <div className="mt-2 text-sm text-red-600">
                    Select any one option
                  </div>
                )}
                {activeButton && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {propertyConfig.residential[activeButton].step1.map(
                      renderField
                    )}
                  </div>
                )}
              </>
            )}
            {selectedOption === "commercial" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {Object.keys(propertyConfig.commercial).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleCommercial(type)}
                      className={`w-full h-12 px-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                        activeCommercial === type
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {click && activeCommercial === "" && (
                  <div className="mt-2 text-sm text-red-600">
                    Select any one option
                  </div>
                )}
                {activeCommercial && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {propertyConfig.commercial[activeCommercial].step1.map(
                      renderField
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedOption === "residential" &&
              activeButton &&
              propertyConfig.residential[activeButton].step2.map(renderField)}
            {selectedOption === "commercial" &&
              activeCommercial &&
              propertyConfig.commercial[activeCommercial].step2.map(
                renderField
              )}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {step3Fields.map(renderField)}
            <div className="col-span-1 sm:col-span-2">
              <label
                htmlFor="fileUpload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Property Documents{" "}
                <span className="text-red-600">*</span>
              </label>
              <input
                id="fileUpload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">
                    Selected files:
                  </p>
                  <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="hover:text-gray-800">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        {message && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {message}
          </div>
        )}
        <div className="flex justify-between items-center">
          <h6 className="text-xl sm:text-2xl font-semibold text-green-600">
            Posting your property is free, so get started.
          </h6>
        </div>
        <div>
          <p className="mt-3 text-lg font-semibold text-gray-800">
            Step {step} of 3
          </p>
        </div>
        {renderStep()}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
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
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
              onClick={handleNext}
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-green-400 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Property"}
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
