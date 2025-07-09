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
          name: "floor_no",
          label: "Which Floor Number",
          type: "text",
          placeholder: "Which Floor Number",
        },
        {
          name: "total_floors",
          label: "Total Number Floor",
          type: "text",
          placeholder: "Total Floor Number",
        },
        {
          name: "bedrooms",
          label: "Total Bedrooms",
          type: "select",
          placeholder: "Bedroom Number",
          options: ["1", "2", "3", "4", "5"],
        },
        {
          name: "bathrooms",
          label: "Total Bathrooms",
          type: "select",
          placeholder: "Bathroom Number",
          options: ["1", "2", "3", "4", "5"],
        },
      ],
      step2: [
        {
          name: "carpet",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.ft)",
          option: ["sq.ft", "sq.yard"],
        },
        {
          name: "built",
          label: "Built-Up Area",
          type: "selectOrText",
          placeholder: "Built-Up Area (sq.ft)",
          option: ["sq.ft", "sq.yard"],
        },
        {
          name: "land",
          label: "Land Area",
          type: "selectOrText",
          placeholder: "Land Area (sq.ft)",
          option: ["sq.ft", "sq.yard"],
        },
        {
          name: "construction_status",
          label: "Construction Status",
          type: "select",
          options: ["Ready To Move", "Re-Sale", "Under Construction"],
        },
        {
          name: "property_age",
          label: "Property Age",
          type: "select",
          options: ["0-1 year", "1-5 years", "5-10 years", "10+ years"],
          showIf: { field: "construction_status", value: "Re-Sale" },
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
          name: "gated_community",
          label: "Gated Community?",
          type: "radio",
          options: ["yes", "no"],
        },
        {
          name: "in_society",
          label: "Is this in a society?",
          type: "radio",
          options: ["yes", "no"],
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
      step2: [
        {
          name: "construction_status",
          label: "Construction Status",
          type: "select",
          options: ["Ready To Move", "Re-Sale", "Under Construction"],
        },
        {
          name: "property_age",
          label: "Property Age",
          type: "select",
          options: ["0-1 year", "1-5 years", "5-10 years", "10+ years"],
          showIf: { field: "construction_status", value: "Re-Sale" },
        },
        {
          name: "gated_community",
          label: "Gated Community?",
          type: "radio",
          options: ["yes", "no"],
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
      step2: [
        {
          name: "construction_status",
          label: "Construction Status",
          type: "select",
          options: ["Ready To Move", "Re-Sale", "Under Construction"],
        },
        {
          name: "carpet",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "property_age",
          label: "Property Age",
          type: "select",
          options: ["0-1 year", "1-5 years", "5-10 years", "10+ years"],
          showIf: { field: "construction_status", value: "Re-Sale" },
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
          name: "gated_community",
          label: "Gated Community?",
          type: "radio",
          options: ["yes", "no"],
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
          name: "bhk",
          label: "Serviced Apartment Type",
          type: "select",
          options: ["1RK/Studio", "1BHK", "2BHK", "3BHK", "Penthouse"],
        },
      ],
      step2: [
        {
          name: "construction_status",
          label: "Construction Status",
          type: "select",
          options: ["Ready To Move", "Re-Sale", "Under Construction"],
        },
        {
          name: "total_floors",
          label: "Total Floor Number",
          type: "text",
          placeholder: "Total Floor Number",
        },
        {
          name: "carpet",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
        },
        {
          name: "property_age",
          label: "Property Age",
          type: "select",
          options: ["0-1 year", "1-5 years", "5-10 years", "10+ years"],
          showIf: { field: "construction_status", value: "Re-Sale" },
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
          name: "gated_community",
          label: "Gated Community?",
          type: "radio",
          options: ["yes", "no"],
        },
        {
          name: "in_society",
          label: "Is this in a society?",
          type: "radio",
          options: ["yes", "no"],
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
      step2: [
        {
          name: "furnishing_status",
          label: "Furnishing Status",
          type: "select",
          options: ["Semi-Furnished", "Unfurnished", "Fully-Furnished"],
        },
        {
          name: "carpet",
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
          name: "property_age",
          label: "Property Age",
          type: "select",
          options: ["0-1 year", "1-5 years", "5-10 years", "10+ years"],
          showIf: { field: "construction_status", value: "Re-Sale" },
        },
        {
          name: "landmark",
          label: "Near By",
          type: "select",
          options: ["Hospital", "School", "Restaurant", "Store", "Other"],
        },
        {
          name: "gated_community",
          label: "Gated Community?",
          type: "radio",
          options: ["yes", "no"],
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
      step2: [], // No step2 fields for "Other"
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
        {
          name: "has_lift",
          label: "Is there lift?",
          type: "radio",
          options: ["yes", "no"],
        },
        {
          name: "parking_available",
          label: "Parking Available?",
          type: "radio",
          options: ["yes", "no"],
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
        {
          name: "floor_no",
          label: "Floor No",
          type: "text",
          placeholder: "Floor Number",
        },
        {
          name: "has_lift",
          label: "Is there lift?",
          type: "radio",
          options: ["yes", "no"],
        },
        {
          name: "parking_available",
          label: "Parking Available?",
          type: "radio",
          options: ["yes", "no"],
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
          type: "select",
          options: ["20ft", "30ft", "40ft", "50ft+"],
        },
        {
          name: "commercial_useType",
          label: "Use Type",
          type: "select",
          options: ["Industrial", "ShowRoom", "Shop"],
        },
        {
          name: "carpet",
          label: "Carpet Area",
          type: "selectOrText",
          placeholder: "Carpet Area (sq.yard)",
          option: ["sq.yard", "marla", "kanal"],
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
        {
          name: "shutters_count",
          label: "No. of Shutters",
          type: "text",
          placeholder: "Number of Shutters",
        },
        {
          name: "roof_height",
          label: "Height of Roof",
          type: "text",
          placeholder: "Height (ft)",
        },
        {
          name: "loading_bay",
          label: "Loading/Unloading Bay",
          type: "radio",
          options: ["yes", "no"],
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
        {
          name: "shutters_count",
          label: "No. of Shutters",
          type: "text",
          placeholder: "Number of Shutters",
        },
        {
          name: "roof_height",
          label: "Height of Roof",
          type: "text",
          placeholder: "Height (ft)",
        },
        {
          name: "loading_bay",
          label: "Loading/Unloading Bay",
          type: "radio",
          options: ["yes", "no"],
        },
      ],
    },
    Hospital: {
      step1: [
        {
          name: "hospital_type",
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
          name: "additional_value",
          label: "Number of Beds",
          type: "select",
          placeholder: "Enter total beds",
          options: ["10", "20", "30", "50", "100+"],
        },
        {
          name: "floor_available",
          label: "Available Floor",
          type: "select",
          options: ["Ground", "1st", "2nd", "3rd", "Full Building"],
        },
        {
          name: "furnishing_status",
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
          name: "medical_facilities",
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
          name: "amenities",
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
          name: "hospital_license",
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
          name: "property_age",
          label: "Property Age",
          type: "select",
          options: ["0-3 Years", "3-5 Years", "5-10 Years", "10+ Years"],
          showIf: { field: "construction_status", value: "Re-Sale" },
        },
        {
          name: "possession_status",
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
          name: "property_type",
          label: "Describe Property Type",
          type: "text",
          placeholder: "Describe the property type",
        },
      ],
      step2: [], // No step2 fields for "Other"
    },
  },
};

const step3Fields = [
  {
    name: "name",
    label: "Property Title",
    type: "text",
    placeholder: "Property Title",
    required: true,
  },
  {
    name: "description",
    label: "Property Description",
    type: "textarea",
    placeholder: "Property description",
    required: true,
  },
  {
    name: "budget",
    label: "Demand Price",
    type: "selectOrText",
    placeholder: "Enter the correct price",
    option: ["Lac", "Cr"],
    required: true,
  },
  {
    name: "city",
    label: "City",
    type: "select",
    placeholder: "City",
    options: ["Mohali", "Kharar", "Zirakpur", "Chandigarh", "Panchkula"],
    required: true,
  },
  {
    name: "address",
    label: "Location",
    type: "text",
    placeholder: "Location",
    required: true,
  },
  {
    name: "zip_code",
    label: "Pin Code",
    type: "text",
    placeholder: "Pin Code",
  },
  {
    name: "map_link",
    label: "Map Link",
    type: "text",
    placeholder: "Map Link",
  },
];

export default function SellProperty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [click, setClick] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [activeCommercial, setActiveCommercial] = useState("");
  const [active, setActive] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");
  const [errorModal, setErrorModal] = useState({ isOpen: false, messages: [] });
  const [storedata, setStoreData] = useState({ phone: "", person: "" });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    bhk: "",
    kothi_story_type: "",
    floor_no: "",
    total_floors: "",
    bedrooms: "",
    bathrooms: "",
    land: "",
    built: "",
    additional: "",
    furnishing_status: "",
    carpet: "",
    property_type: "",
    property_age: "",
    gated_community: "",
    sqft: "",
    has_lift: "",
    parking_available: "",
    width_length: "",
    road_width: "",
    commercial_useType: "",
    shutters_count: "",
    roof_height: "",
    loading_bay: "",
    city: "",
    address: "",
    landmark: "",
    zip_code: "",
    map_link: "",
    budget: "",
    construction_status: "",
    description: "",
    name: "",
    direction: "",
    facing: "",
    in_society: "",
    amenities: [],
    hospital_type: "",
    additional_value: "",
    floor_available: "",
    medical_facilities: [],
    hospital_license: "",
    possession_status: "",
    image_one: "",
    image_two: "",
    image_three: "",
    image_four: "",
  });

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      navigate("/success");
    } else {
      const phone = localStorage.getItem("phone");
      if (phone && phone.length === 10) {
        setStoreData((prev) => ({ ...prev, phone }));
      }
    }
  }, [navigate]);

  const handleNewData = (e) => {
    setStoreData({ ...storedata, [e.target.name]: e.target.value });
  };

  const handlePropertyDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setPropertyDetails((prev) => {
        const currentValues = Array.isArray(prev[name]) ? prev[name] : [];
        return {
          ...prev,
          [name]: checked
            ? [...currentValues, value]
            : currentValues.filter((item) => item !== value),
        };
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
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        setErrorModal({
          isOpen: true,
          messages: [
            `Invalid file type for ${file.name}. Only JPG, JPEG, and PNG are allowed.`,
          ],
        });
        return false;
      }
      if (file.size > maxSize) {
        setErrorModal({
          isOpen: true,
          messages: [`File ${file.name} is too large. Maximum size is 5MB.`],
        });
        return false;
      }
      return true;
    });

    const limitedFiles = validFiles.slice(0, 4);
    setSelectedFiles(limitedFiles);

    const previews = [];
    limitedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews[index] = e.target.result;
        if (previews.length === limitedFiles.length) {
          setImagePreviews([...previews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setPropertyDetails((prev) => ({
      ...prev,
      image_one: limitedFiles[0]?.name || "",
      image_two: limitedFiles[1]?.name || "",
      image_three: limitedFiles[2]?.name || "",
      image_four: limitedFiles[3]?.name || "",
    }));
  };

  const handleClickButton = (type) => setActive(type);
  const handleCommercial = (type) => setActiveCommercial(type);
  const handleproperty_type = (type) => setActiveButton(type);
  const handleOptionChange = (e) => setSelectedOption(e.target.value);

  const validateStep = () => {
    setMessage("");
    setClick(true);
    const errors = [];

    if (step === 1) {
      if (!active) {
        errors.push("Please select a property action (Sell or Rent/Lease)");
      }
      if (selectedOption === "residential" && !activeButton) {
        errors.push("Please select a residential property type");
      }
      if (selectedOption === "commercial" && !activeCommercial) {
        errors.push("Please select a commercial property type");
      }
      if (!isLoggedIn) {
        if (!storedata.phone || !/^\d{10}$/.test(storedata.phone)) {
          errors.push("Please enter a valid 10-digit phone number");
        }
        if (!storedata.person) {
          errors.push("Please enter your name");
        }
      }
      const fields =
        selectedOption === "residential"
          ? propertyConfig.residential[activeButton]?.step1 || []
          : propertyConfig.commercial[activeCommercial]?.step1 || [];
      fields.forEach((field) => {
        if (
          field.required &&
          !propertyDetails[field.name] &&
          (!field.showIf ||
            propertyDetails[field.showIf?.field] === field.showIf?.value)
        ) {
          errors.push(`Please fill in the required ${field.label} field`);
        }
      });
    } else if (step === 2) {
      const fields =
        selectedOption === "residential"
          ? propertyConfig.residential[activeButton]?.step2 || []
          : propertyConfig.commercial[activeCommercial]?.step2 || [];
      // Only validate step2 if fields exist
      if (fields.length > 0) {
        fields.forEach((field) => {
          if (
            field.required &&
            !propertyDetails[field.name] &&
            (!field.showIf ||
              propertyDetails[field.showIf?.field] === field.showIf?.value)
          ) {
            errors.push(`Please fill in the required ${field.label} field`);
          }
        });
      }
    } else if (step === 3) {
      const requiredFields = step3Fields.filter((field) => field.required);
      requiredFields.forEach((field) => {
        if (!propertyDetails[field.name]) {
          errors.push(`Please fill in the required ${field.label} field`);
        }
      });
      if (selectedFiles.length === 0) {
        errors.push("Please upload at least one image");
      }
    }

    if (errors.length > 0) {
      setErrorModal({ isOpen: true, messages: errors });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setClick(false);
      setMessage("");
      setErrorModal({ isOpen: false, messages: [] });
      // Check if step2 fields exist for the selected property type
      const step2Fields =
        selectedOption === "residential"
          ? propertyConfig.residential[activeButton]?.step2 || []
          : propertyConfig.commercial[activeCommercial]?.step2 || [];
      if (step === 1 && step2Fields.length === 0) {
        // Skip step2 if no fields are defined
        setStep(3);
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setClick(false);
    setMessage("");
    setErrorModal({ isOpen: false, messages: [] });
    // If on step3 and step2 is empty, go back to step1
    const step2Fields =
      selectedOption === "residential"
        ? propertyConfig.residential[activeButton]?.step2 || []
        : propertyConfig.commercial[activeCommercial]?.step2 || [];
    if (step === 3 && step2Fields.length === 0) {
      setStep(1);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setClick(true);
    setMessage("");
    setIsLoading(true);

    const finalPhone = isLoggedIn
      ? localStorage.getItem("phone")
      : storedata.phone;
    const finalPerson = isLoggedIn
      ? localStorage.getItem("person") || ""
      : storedata.person;

    if (!finalPhone || !/^\d{10}$/.test(finalPhone)) {
      setErrorModal({
        isOpen: true,
        messages: ["Please enter a valid 10-digit phone number"],
      });
      setIsLoading(false);
      return;
    }

    const property_type =
      selectedOption === "residential" ? activeButton : activeCommercial;
    const category = selectedOption;
    const property_for = active;

    if (!property_type || !category || !property_for) {
      setErrorModal({
        isOpen: true,
        messages: ["Please ensure all property details are selected"],
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      property_for,
      property_type,
      category,
      name: propertyDetails.name,
      description: propertyDetails.description,
      budget: parseFloat(propertyDetails.budget) || 0,
      budget_in_words: propertyDetails.budget
        ? `${propertyDetails.budget} ${propertyDetails.budget_unit || "Cr"}`
        : "",
      phone: finalPhone,
      person: finalPerson,
      city: propertyDetails.city,
      address: propertyDetails.address,
      zip_code: propertyDetails.zip_code,
      map_link: propertyDetails.map_link,
      bhk: propertyDetails.bhk,
      bedrooms: propertyDetails.bedrooms,
      bathrooms: propertyDetails.bathrooms,
      carpet: propertyDetails.carpet
        ? `${propertyDetails.carpet} ${propertyDetails.carpet_unit || "sqft"}`
        : "",
      built: propertyDetails.built
        ? `${propertyDetails.built} ${propertyDetails.built_unit || "sqft"}`
        : "",
      land: propertyDetails.land
        ? `${propertyDetails.land} ${propertyDetails.land_unit || "sqft"}`
        : "",
      additional: propertyDetails.additional,
      additional_value: propertyDetails.additional_value,
      amenities: JSON.stringify(propertyDetails.amenities),
      image_one: propertyDetails.image_one,
      image_two: propertyDetails.image_two,
      image_three: propertyDetails.image_three,
      image_four: propertyDetails.image_four,
      floor_no: parseInt(propertyDetails.floor_no) || null,
      total_floors: parseInt(propertyDetails.total_floors) || null,
      property_age: propertyDetails.property_age,
      kothi_story_type: propertyDetails.kothi_story_type,
      furnishing_status: propertyDetails.furnishing_status,
      gated_community: propertyDetails.gated_community === "yes" ? 1 : 0,
      has_lift: propertyDetails.has_lift === "yes" ? 1 : 0,
      parking_available: propertyDetails.parking_available === "yes" ? 1 : 0,
      width_length: propertyDetails.width_length,
      road_width: propertyDetails.road_width,
      commercial_useType: propertyDetails.commercial_useType,
      shutters_count: parseInt(propertyDetails.shutters_count) || null,
      roof_height: propertyDetails.roof_height,
      loading_bay: propertyDetails.loading_bay === "yes" ? 1 : 0,
      landmark: propertyDetails.landmark,
      direction: propertyDetails.direction,
      facing: propertyDetails.facing,
      in_society: propertyDetails.in_society,
      hospital_type: propertyDetails.hospital_type,
      floor_available: propertyDetails.floor_available,
      medical_facilities: JSON.stringify(propertyDetails.medical_facilities),
      hospital_license: propertyDetails.hospital_license === "yes" ? 1 : 0,
      possession_status: propertyDetails.possession_status,
      construction_status: propertyDetails.construction_status,
      image_files: selectedFiles.map((file) => file.name),
    };

    try {
      const authToken = token || localStorage.getItem("token");
      if (!authToken) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch(`${liveUrl}api/Properties/addProperty/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
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
      console.error("Error in handleSubmit:", error);
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
    const {
      name,
      label,
      type,
      placeholder,
      options,
      option,
      required,
      showIf,
    } = field;

    if (showIf && propertyDetails[showIf.field] !== showIf.value) {
      return null;
    }

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
            <option value="">{placeholder || `Select ${label}`}</option>
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
              required={required}
            />
            {option && (
              <select
                id={`${name}_unit`}
                name={`${name}_unit`}
                value={propertyDetails[`${name}_unit`] || option[0]}
                onChange={handlePropertyDetailsChange}
                className="h-10 px-3 border border-gray-300 rounded-r-md bg-gray-50 text-sm focus:ring-green-500 focus:border-green-500"
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
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
          <textarea
            id={name}
            name={name}
            value={propertyDetails[name] || ""}
            onChange={handlePropertyDetailsChange}
            className="block w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder={placeholder}
            required={required}
          />
        </div>
      );
    } else if (type === "file") {
      return (
        <div key={name} className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
          <div className="relative">
            <input
              id={name}
              name={name}
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              accept="image/jpeg,image/jpg,image/png"
              required={required}
            />
            <svg
              className="absolute right-3 top-2.5 w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Image Previews ({imagePreviews.length}/4):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md border border-gray-300"
                    />
                    {index === 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Main
                      </span>
                    )}
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {selectedFiles[index]?.name || ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">
                Selected files:
              </p>
              <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="hover:text-gray-800">
                    {index === 0 ? `${file.name} (Main Image)` : file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
            type="text"
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
              <>
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
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="person"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="person"
                    name="person"
                    value={storedata.person}
                    onChange={handleNewData}
                    className="block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleClickButton("Sell")}
                className={`w-full h-12 px-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                  active === "Sell"
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
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Rent/Lease
              </button>
            </div>
            {click && active === "" && (
              <div className="mt-2 text-sm text-red-600">
                Please select a property action (Sell or Rent/Lease)
              </div>
            )}
            <div className="flex gap-6 mt-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="residential"
                  checked={selectedOption === "residential"}
                  onChange={handleOptionChange}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                  required
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
                  required
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
                      onClick={() => handleproperty_type(type)}
                      className={`w-full h-12 px-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                        activeButton === type
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {click &&
                  selectedOption === "residential" &&
                  activeButton === "" && (
                    <div className="mt-2 text-sm text-red-600">
                      Please select a residential property type
                    </div>
                  )}
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
                {click &&
                  selectedOption === "commercial" &&
                  activeCommercial === "" && (
                    <div className="mt-2 text-sm text-red-600">
                      Please select a commercial property type
                    </div>
                  )}
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
      case 2:
        const step2Fields =
          selectedOption === "residential"
            ? propertyConfig.residential[activeButton]?.step2 || []
            : propertyConfig.commercial[activeCommercial]?.step2 || [];
        if (step2Fields.length === 0) {
          // If no step2 fields, automatically move to step3
          setStep(3);
          return null;
        }
        return (
          <div>
            {selectedOption === "residential" &&
              activeButton &&
              propertyConfig.residential[activeButton]?.step2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {propertyConfig.residential[activeButton].step2.map(
                    renderField
                  )}
                </div>
              )}
            {selectedOption === "commercial" &&
              activeCommercial &&
              propertyConfig.commercial[activeCommercial]?.step2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {propertyConfig.commercial[activeCommercial].step2.map(
                    renderField
                  )}
                </div>
              )}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {step3Fields.map(renderField)}
            <div className="mb-4 col-span-2">
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Images (Max 4, First image will be main image){" "}
                <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  accept="image/jpeg,image/jpg,image/png"
                  required
                />
                <svg
                  className="absolute right-3 top-2.5 w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Image Previews ({imagePreviews.length}/4):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-md border border-gray-300"
                        />
                        {index === 0 && (
                          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Main
                          </span>
                        )}
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {selectedFiles[index]?.name || ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">
                    Selected files:
                  </p>
                  <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="hover:text-gray-800">
                        {index === 0 ? `${file.name} (Main Image)` : file.name}
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
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 shadow rounded-lg">
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center">
            {message}
          </div>
        )}
        {errorModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-lg font-semibold text-red-600 mb-4">
                Validation Errors
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                {errorModal.messages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
              <button
                onClick={closeModal}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        )}
        <div>
          <div className="flex justify-between items-center text-sm font-medium">
            <div
              className={`flex flex-col items-center ${
                step >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <span
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  step >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <svg
                  className="w-6 h-6 "
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 6v12a1 1 0 001 1h16a1 1 0 001-1V6H3zm16 2v2h-4V8h4zm-6 0v2H5V8h8zm6 4v2h-4v-2h4zm-6 0v2H5v-2h8zm6 4v2h-4v-2h4zm-6 0v2H5v-2h8z" />
                </svg>
              </span>
              Property Category & Structure
            </div>
            <div
              className={`flex flex-col items-center ${
                step >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <span
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <svg
                  className="w-6 h-6 "
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm4 2h4v4h-4V8z" />
                </svg>
              </span>
              Area, Construction & Community Details
            </div>
            <div
              className={`flex flex-col items-center ${
                step >= 3 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <span
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <svg
                  className="w-6 h-6 "
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 4v3h14V4h2v16h-2v-3H5v3H3V4h2zm0 5v6h14V9H5z" />
                </svg>
              </span>
              Confirm Property Details & Submit
            </div>
          </div>
          <div className="my-4 bg-gray-200 h-2 rounded-full">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                step === 1
                  ? "w-1/3 bg-black"
                  : step === 2
                  ? "w-2/3 bg-black"
                  : "w-full bg-black"
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
              Update And Next
            </button>
          )}
          {step === 3 && (
            <button
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-blue-400 disabled:cursor-not-allowed"
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