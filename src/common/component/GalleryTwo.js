/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Bed from "../../assets/img/bed.png";
import AnimatedText from "./HeadingAnimation";
import Bath from "../../assets/img/bath.png";
import NoImage from "../../assets/img/image-not.jpg";
import { liveUrl, token } from "./url";
import OurServices from "./ourServices";
import "../../App.css";

// Constants for budget range
const BUDGET_MIN = 500000;
const BUDGET_MAX = 200000000;

export default function GalleryComponentTwo({ initialPropertyType }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [newData, setNewData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState([]);
  const [propertyType, setPropertyType] = useState([]);
  const [showMorePropertyTypes, setShowMorePropertyTypes] = useState(false);
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rangeValues, setRangeValues] = useState({
    min: BUDGET_MIN,
    max: BUDGET_MAX,
  });
  const [locationFilter, setLocationFilter] = useState("");
  const [rentFilter, setRentFilter] = useState(false);
  const [unitSelections, setUnitSelections] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(token);
  const [wishlistLoading, setWishlistLoading] = useState(new Set());

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedPropertyType([]);
    setSelectedAmenities([]);
    setSortBy("");
    setRangeValues({ min: BUDGET_MIN, max: BUDGET_MAX });
    setLocationFilter("");
    setRentFilter(false);
    setUnitSelections({});
    setCurrentPage(1);
    navigate("/property?category=All&propertyType=buy");
  };

  // Fetch user ID from storage
  useEffect(() => {
    const storedUserId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId") || null;
    setUserId(storedUserId);
  }, []);

  // Fetch wishlist from API
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId || !authToken) {
        console.log("User not logged in or no token available");
        setWishlist([]);
        return;
      }

      try {
        const response = await fetch(`${liveUrl}api/User/getWishlist`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === "success" && Array.isArray(data.result)) {
          setWishlist(data.result.map((item) => ({
            id: item.property_id,
            property_name: item.property_name || "Unknown Property",
            address: item.address || "Unknown Location",
            budget: item.budget || "N/A",
            image: item.image || NoImage,
            property_type: item.property_type || "N/A",
            addedAt: item.addedAt || new Date().toISOString(),
          })));
        } else {
          console.error("Invalid wishlist data:", data);
          setWishlist([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlist([]);
      }
    };

    fetchWishlist();
  }, [userId, authToken]);

  // Wishlist management with API calls
  const toggleWishlist = async (property) => {
    if (!userId || !authToken) {
      alert("Please log in to manage your wishlist.");
      navigate("/login"); // Redirect to login page
      return;
    }

    const propertyId = property.id;
    if (wishlistLoading.has(propertyId)) {
      return; // Prevent multiple simultaneous requests
    }

    setWishlistLoading((prev) => new Set(prev).add(propertyId));

    const isCurrentlyWishlisted = isWishlist(propertyId);
    const url = isCurrentlyWishlisted
      ? `${liveUrl}api/User/removefromwishlist`
      : `${liveUrl}api/User/addToWishlist`;
    const method = isCurrentlyWishlisted ? "DELETE" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userId,
          property_id: propertyId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setWishlist((prev) =>
          isCurrentlyWishlisted
            ? prev.filter((item) => item.id !== propertyId)
            : [
                ...prev,
                {
                  id: propertyId,
                  property_name: property.property_name || property.name || "Unknown Property",
                  address: property.address || "Unknown Location",
                  budget: property.budget || "N/A",
                  image: property.image || NoImage,
                  property_type: property.property_type || "N/A",
                  addedAt: new Date().toISOString(),
                },
              ]
        );
        alert(`Property ${isCurrentlyWishlisted ? "removed from" : "added to"} wishlist successfully!`);
      } else {
        console.error("API error:", data);
        alert("wishlist successfully!");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("Failed to update wishlist due to a network error. Please try again.");
    } finally {
      setWishlistLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
    }
  };

  // Check if property is in wishlist
  const isWishlist = (propertyId) => {
    return wishlist.some((item) => item.id === propertyId);
  };

  // Extract query parameters and pre-select property types
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword") || "";
    const category = queryParams.get("category") || "All";
    const propertyTypeParam = queryParams.get("propertyType") || "buy";

    setSearchQuery(keyword);
    setRentFilter(propertyTypeParam === "rent");

    if (category !== "All" && propertyType.length > 0) {
      const preSelectedTypes = propertyType.filter((type) =>
        type.toLowerCase().includes(category.toLowerCase())
      );
      setSelectedPropertyType(preSelectedTypes);
    } else {
      setSelectedPropertyType([]);
    }
  }, [location.search, propertyType]);

  // Handle outside clicks for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Limit visible items in sidebar
  const visiblePropertyTypes = showMorePropertyTypes
    ? propertyType
    : propertyType.slice(0, 6);
  const visibleAmenities = showMoreAmenities
    ? amenities
    : amenities.slice(0, 6);

  // Handle range input for budget
  const handleRangeChange = (event) => {
    setRangeValues({
      min: parseInt(event.target.value),
      max: BUDGET_MAX,
    });
  };

  // Handle sort selection
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Handle location filter
  const handleLocationChange = (event) => {
    setLocationFilter(event.target.value);
  };

  // Toggle dropdown visibility
  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle amenities checkbox
  const handleCheckboxChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  // Handle property type checkbox
  const handleChange = (type) => {
    setSelectedPropertyType((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  // Format budget for display
  const formatBudget = (value) => {
    if (!value || isNaN(value)) return "N/A";
    if (value >= 10000000) {
      return (
        "₹" +
        (value / 10000000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) +
        " Cr"
      );
    } else if (value >= 100000) {
      return (
        "₹" +
        (value / 100000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) +
        " Lac"
      );
    } else {
      return (
        "₹" +
        (value / 1000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }) +
        " Thousand"
      );
    }
  };

  // Check if area value is valid
  const isValidArea = (area) => area && !isNaN(area) && area > 0;

  // Convert area based on selected unit
  const convertArea = (area, unit, panelId, areaType) => {
    if (!isValidArea(area)) return "N/A";
    const effectiveArea = area;
    const conversions = {
      "sq.ft.": effectiveArea,
      "sq.m.": effectiveArea * 0.092903,
      "sq.yards": effectiveArea / 9,
      hectares: effectiveArea / 107639,
    };
    const convertedValue = conversions[unit] || effectiveArea;
    return `${Math.round(convertedValue).toLocaleString()} ${unit}`;
  };

  // Handle unit change for a specific property and area type
  const handleUnitChange = (panelId, unit, areaType) => {
    setUnitSelections((prev) => ({
      ...prev,
      [`${panelId}-${areaType}`]: unit,
    }));
  };

  // Filter properties based on budget, search, category, location, amenities, and property type
  const filterPanelsByBudget = (panel) => {
    const panelBudget = parseInt(panel.budget) || 0;
    const panelAmenities = panel.amenities ? panel.amenities.split("~-~") : [];
    const propertyCheck = (panel.property_type || "").toLowerCase().trim();
    const propertyName = (panel.property_name || panel.name || "")
      .toLowerCase()
      .trim();
    const searchLower = searchQuery.toLowerCase().trim();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category") || "All";

    const isBudgetInRange =
      panelBudget >= rangeValues.min && panelBudget <= rangeValues.max;

    const matchesSearch =
      !searchQuery ||
      (panel.name && panel.name.toLowerCase().includes(searchLower)) ||
      (panel.property_name && propertyName.includes(searchLower)) ||
      (panel.address && panel.address.toLowerCase().includes(searchLower)) ||
      (panel.property_type && propertyCheck.includes(searchLower)) ||
      panelAmenities.some((amenity) =>
        amenity.toLowerCase().includes(searchLower)
      ) ||
      (panel.bedrooms && panel.bedrooms.toString().includes(searchLower)) ||
      (panel.bathrooms && panel.bathrooms.toString().includes(searchLower)) ||
      (panel.sqft && panel.sqft.toString().includes(searchLower)) ||
      formatBudget(panelBudget).toLowerCase().includes(searchLower);

    const matchesCategory =
      category === "All" || propertyCheck.includes(category.toLowerCase());

    const matchesLocation =
      !locationFilter ||
      (panel.address &&
        panel.address.toLowerCase().includes(locationFilter.toLowerCase()));

    const hasSelectedAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => panelAmenities.includes(amenity));

    const hasSelectedPropertyType =
      selectedPropertyType.length === 0 ||
      selectedPropertyType.some((type) =>
        propertyCheck.includes(type.toLowerCase())
      );

    const matchesRentFilter =
      !rentFilter || (rentFilter && propertyCheck.includes("rent"));

    return (
      isBudgetInRange &&
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      hasSelectedAmenities &&
      hasSelectedPropertyType &&
      matchesRentFilter
    );
  };

  const filteredData = newData.filter(filterPanelsByBudget);

  // Pagination logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex).sort((a, b) => {
    if (sortBy === "lowToHigh") return (a.budget || 0) - (b.budget || 0);
    if (sortBy === "highToLow") return (b.budget || 0) - (a.budget || 0);
    return 0;
  });

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  // Fetch properties
  const handleSubmit = () => {
    setLoader(true);
    fetch(`${liveUrl}api/Reactjs/gallery`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response (Properties):", data);
        const properties = Array.isArray(data.result) ? data.result : [];
        setNewData(properties);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setLoader(false);
      });
  };

  // Fetch property types
  const handlePropertyType = () => {
    setLoader(true);
    fetch(`${liveUrl}property-property-type`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response (Property Types):", data);
        setPropertyType(Array.isArray(data.result) ? data.result : []);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching property types:", error);
        setLoader(false);
      });
  };

  // Fetch amenities
  const handleAmenities = () => {
    setLoader(true);
    fetch(`${liveUrl}api/Reactjs/amenities`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response (Amenities):", data);
        setAmenities(Array.isArray(data.result) ? data.result : []);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching amenities:", error);
        setLoader(false);
      });
  };

  // Initial data fetch
  useEffect(() => {
    handleSubmit();
    handlePropertyType();
    handleAmenities();
  }, []);

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category") || "All";
  const dynamicHeading = `Property ${category}`;

  const isAnyFilterActive = () => {
    return (
      searchQuery !== "" ||
      selectedPropertyType.length > 0 ||
      selectedAmenities.length > 0 ||
      sortBy !== "" ||
      locationFilter !== "" ||
      rangeValues.min !== BUDGET_MIN ||
      rangeValues.max !== BUDGET_MAX ||
      rentFilter ||
      Object.keys(unitSelections).length > 0
    );
  };

  // Sanitize property name for URL
  const sanitizePropertyName = (name) => {
    return (name || "property")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  return (
    <>
      <div className="">
        {loader ? (
          <div className="flex justify-center items-center p-2">
            <svg
              className="animate-spin h-10 w-10"
              fill="#014108"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M304 48a48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
            </svg>
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className="flex justify-center items-center my-4 gap-4">
                <div className="font-bold text-xl uppercase text-center text-green-800">
                  <AnimatedText text={dynamicHeading} />
                </div>
                <div className="inline-block bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-md">
                  {filteredData.length}{" "}
                  {filteredData.length === 1 ? "Property" : "Properties"} Found
                </div>
              </div>
            )}
            <div className="w-full bg-white shadow-md p-4 mb-4 flex flex-wrap justify-start items-center gap-4">
              <div className="max-w-[400px] w-full relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  placeholder="Search by name, address, type, amenities, bedrooms, etc."
                  className="w-full border border-green-600 p-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Search properties"
                />
              </div>
              <div
                className="relative bg-white border border-green-600 p-2 rounded-md min-w-[200px] max-w-[200px]"
                ref={dropdownRef}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleDropdown();
                  }}
                  className="w-full text-left flex justify-between items-center"
                  role="button"
                  aria-expanded={isOpen}
                >
                  {selectedPropertyType.length > 0 ? (
                    <div
                      className="truncate max-w-[160px]"
                      title={selectedPropertyType.join(", ")}
                    >
                      {selectedPropertyType.join(", ")}
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-between items-center w-full">
                      <div>Select Property</div>
                      <svg
                        fill="black"
                        className="h-3 w-3"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                      </svg>
                    </div>
                  )}
                </button>
                {isOpen && (
                  <div
                    className="absolute bg-white border border-green-600 mt-2 p-2 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto min-w-[200px]"
                    role="menu"
                  >
                    {visiblePropertyTypes.map((type) => (
                      <div className="flex gap-2 items-center py-1" key={type}>
                        <input
                          type="checkbox"
                          id={`property-type-${type}`}
                          checked={selectedPropertyType.includes(type)}
                          onChange={() => handleChange(type)}
                          className="h-4 w-4 text-green-600 focus:ring-green-600"
                        />
                        <label
                          htmlFor={`property-type-${type}`}
                          className="text-sm"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <select
                className="bg-white border border-green-600 p-2 rounded-md min-w-[150px] focus:outline-none focus:ring-2 focus:ring-green-600"
                value={sortBy}
                onChange={handleSortChange}
                aria-label="Sort properties"
              >
                <option value="">Sort By:</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
              <select
                className="bg-white border border-green-600 p-2 rounded-md min-w-[100px] focus:outline-none focus:ring-2 focus:ring-green-600"
                value={locationFilter}
                onChange={handleLocationChange}
                aria-label="Filter by location"
              >
                <option value="">All Locations</option>
                <option value="Mohali">Mohali</option>
                <option value="Zirakpur">Zirakpur</option>
                <option value="Kharar">Kharar</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Panchkula">Panchkula</option>
              </select>
              {isAnyFilterActive() && (
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 min-w-[100px]"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              )}
            </div>
            <div
              className="myPoint flex gap-10"
              style={{ alignItems: "flex-start", justifyContent: "start" }}
            >
              <div className="lg:block hidden shadow-lg p-2 min-w-[250px]">
                <div className="font-bold text-xl mt-3 text-green-800">
                  Select Property
                </div>
                <div className="border mt-4 border-green-800 p-2 bg-white min-h-[50px] max-w-[200px] rounded-lg">
                  <div>
                    <div className="flex gap-2 mt-2 justify-between">
                      <p>Budget: {formatBudget(rangeValues.min)}</p>
                    </div>
                    <input
                      type="range"
                      className="h-14 border border-black p-2 rounded"
                      min={BUDGET_MIN}
                      max={BUDGET_MAX}
                      value={rangeValues.min}
                      onChange={handleRangeChange}
                      aria-label="Filter by budget"
                    />
                  </div>
                </div>
                <div>
                  <div className="font-bold mb-2 mt-2">Property Type</div>
                  {visiblePropertyTypes.map((type) => (
                    <div key={type} className="flex gap-2 mt-1">
                      <input
                        type="checkbox"
                        id={`sidebar-property-type-${type}`}
                        checked={selectedPropertyType.includes(type)}
                        onChange={() => handleChange(type)}
                        className="h-4 w-4 text-green-600 focus:ring-green-600"
                      />
                      <label
                        htmlFor={`sidebar-property-type-${type}`}
                        className="text-sm"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                  {!showMorePropertyTypes && propertyType.length > 6 && (
                    <button
                      className="text-blue-600"
                      onClick={() => setShowMorePropertyTypes(true)}
                    >
                      Show More
                    </button>
                  )}
                </div>
                <div className="font-bold text-lg mt-2">Amenities</div>
                {visibleAmenities.map((amenity) => (
                  <div className="flex gap-2 mt-1" key={amenity}>
                    <input
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleCheckboxChange(amenity)}
                      className="h-4 w-4 text-green-600 focus:ring-green-600"
                    />
                    <label htmlFor={`amenity-${amenity}`} className="text-sm">
                      {amenity}
                    </label>
                  </div>
                ))}
                {!showMoreAmenities && amenities.length > 6 && (
                  <button
                    className="text-blue-600"
                    onClick={() => setShowMoreAmenities(true)}
                  >
                    Show More
                  </button>
                )}
              </div>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 justify-items-center">
                {newData && Array.isArray(newData) && newData.length > 0 ? (
                  currentItems.length > 0 ? (
                    currentItems.map((panel, index) => (
                      <div
                        className={`property-div w-full max-w-[350px] rounded-md shadow-lg transition duration-300 ease-in-out ${
                          selectedPropertyType.includes(panel.property_type)
                            ? "border-2"
                            : ""
                        }`}
                        key={panel.id || index}
                      >
                        <div className="flex flex-col h-full">
                          <div
                            className="flex-shrink-0 relative cursor-pointer"
                            onClick={() => {
                              const modifiedPanelName = sanitizePropertyName(
                                panel.property_name || panel.name
                              );
                              navigate(
                                `/property/-${
                                  panel.id || index
                                }-${modifiedPanelName}`
                              );
                            }}
                          >
                            {panel.image &&
                            typeof panel.image === "string" &&
                            (panel.image.endsWith(".jpg") ||
                              panel.image.endsWith(".jpeg") ||
                              panel.image.endsWith(".png") ||
                              panel.image.endsWith(".svg")) ? (
                              <img
                                className="rounded-t-md h-[200px] w-full object-cover"
                                src={panel.image}
                                alt={`Property ${
                                  panel.property_name || panel.name || "Image"
                                }`}
                              />
                            ) : (
                              <img
                                className="rounded-t-md h-[200px] w-full object-cover"
                                src={NoImage}
                                alt="No image available for this property"
                              />
                            )}
                            <div className="absolute bottom-0 left-0 bg-[#d7dde5] text-[#303030] px-2 py-1 text-xs">
                              ID: {panel.unique_id || "N/A"}
                            </div>
                            <div
                              className="absolute top-2 right-2 cursor-pointer z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(panel);
                              }}
                            >
                              {wishlistLoading.has(panel.id) ? (
                                <svg
                                  className="animate-spin h-6 w-6 text-gray-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                  ></path>
                                </svg>
                              ) : (
                                <svg
                                  className={`h-6 w-6 cursor-pointer transition duration-300 transform ${
                                    isWishlist(panel.id)
                                      ? "fill-red-600 scale-110"
                                      : "fill-black"
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="flex-grow text-left bg-white border border-t leading-4 p-3">
                            <div className="mr-2">
                              <div className="flex items-center justify-between whitespace-nowrap text-lg text-red-800 pr-3">
                                <div className="flex items-center space-x-4">
                                  <span
                                    className="cursor-pointer font-bold"
                                    onClick={() => {
                                      const modifiedPanelName =
                                        sanitizePropertyName(
                                          panel.property_name || panel.name
                                        );
                                      navigate(
                                        `/property/-${
                                          panel.id || index
                                        }-${modifiedPanelName}`
                                      );
                                    }}
                                  >
                                    {formatBudget(panel.budget)}
                                  </span>
                                  {isValidArea(panel.sqft) && (
                                    <div className="flex items-center space-x-2">
                                      <span
                                        className="text-[#303030] text-sm cursor-pointer"
                                        onClick={() => {
                                          const modifiedPanelName =
                                            sanitizePropertyName(
                                              panel.property_name || panel.name
                                            );
                                          navigate(
                                            `/property/-${
                                              panel.id || index
                                            }-${modifiedPanelName}`
                                          );
                                        }}
                                      >
                                        {convertArea(
                                          panel.sqft,
                                          unitSelections[
                                            `${panel.id || index}-main`
                                          ] || "sq.ft.",
                                          panel.id || index,
                                          "main"
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {isValidArea(panel.built_up_area) && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <span
                                    className="text-[#303030] text-sm cursor-pointer"
                                    onClick={() => {
                                      const modifiedPanelName =
                                        sanitizePropertyName(
                                          panel.property_name || panel.name
                                        );
                                      navigate(
                                        `/property/-${
                                          panel.id || index
                                        }-${modifiedPanelName}`
                                      );
                                    }}
                                  >
                                    Built-Up:{" "}
                                    {convertArea(
                                      panel.built_up_area,
                                      unitSelections[
                                        `${panel.id || index}-built`
                                      ] || "sq.ft.",
                                      panel.id || index,
                                      "built"
                                    )}
                                  </span>
                                  <div className="relative">
                                    <select
                                      value={
                                        unitSelections[
                                          `${panel.id || index}-built`
                                        ] || "sq.ft."
                                      }
                                      onChange={(e) =>
                                        handleUnitChange(
                                          panel.id || index,
                                          e.target.value,
                                          "built"
                                        )
                                      }
                                      className="appearance-none bg-white border text-[#303030] p-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#050505]"
                                      aria-label="Select area unit for built-up area"
                                    >
                                      <option value="sq.ft.">sq.ft.</option>
                                      <option value="sq.m.">sq.m.</option>
                                      <option value="sq.yards">sq.yards</option>
                                    </select>
                                    <svg
                                      fill="black"
                                      className="h-3 w-3 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#303030]"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 512 512"
                                    >
                                      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                              {isValidArea(panel.land_area) && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <span
                                    className="text-[#303030] text-sm cursor-pointer"
                                    onClick={() => {
                                      const modifiedPanelName =
                                        sanitizePropertyName(
                                          panel.property_name || panel.name
                                        );
                                      navigate(
                                        `/property/-${
                                          panel.id || index
                                        }-${modifiedPanelName}`
                                      );
                                    }}
                                  >
                                    Land Area:{" "}
                                    {convertArea(
                                      panel.land_area,
                                      unitSelections[
                                        `${panel.id || index}-land`
                                      ] || "sq.ft.",
                                      panel.id || index,
                                      "land"
                                    )}
                                  </span>
                                  <div className="relative">
                                    <select
                                      value={
                                        unitSelections[
                                          `${panel.id || index}-land`
                                        ] || "sq.ft."
                                      }
                                      onChange={(e) =>
                                        handleUnitChange(
                                          panel.id || index,
                                          e.target.value,
                                          "land"
                                        )
                                      }
                                      className="appearance-none bg-white border text-[#303030] p-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#050505]"
                                      aria-label="Select area unit for land area"
                                    >
                                      <option value="sq.ft.">sq.ft.</option>
                                      <option value="sq.m.">sq.m.</option>
                                      <option value="sq.yards">sq.yards</option>
                                    </select>
                                    <svg
                                      fill="black"
                                      className="h-3 w-3 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#303030]"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 512 512"
                                    >
                                      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                              <div
                                className="flex gap-2 mt-2 items-center text-[#303030] cursor-pointer"
                                onClick={() => {
                                  const modifiedPanelName =
                                    sanitizePropertyName(
                                      panel.property_name || panel.name
                                    );
                                  navigate(
                                    `/property/-${
                                      panel.id || index
                                    }-${modifiedPanelName}`
                                  );
                                }}
                              >
                                <div>
                                  <svg
                                    fill="#15803d"
                                    className="h-4 w-4 fill-[#303030]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                  >
                                    <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 88.4c0 8-1.5 15.8-4.5 23.1l-88 0c-2.9 0-5.6-.6-8-1.7l-191-95c-5.6-2.8-9.2-8.3-9.8-14.3l-4-160.2c0-17.7 14.3-32 32-32l31.1 0 0-80.2c0-26.5 21.5-48 48-48l32 0 0-63.9c0-8.7 3.5-17 10-23.6c6.4-6.6 15.2-10.3 24.2-10.3l96 0c9.1 0 17.8 3.7 24.2 10.3c6.5 6.6 10 14.9 10 23.6l0 63.9 32 0c26.5 0 48 21.5 48 48l0 80.2 0 31.9zM272 192a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm-48 256l0-112 96 48 0 112-96-48z" />
                                  </svg>
                                </div>
                                <div className="leading-6 text-[#303030] text-sm truncate">
                                  {panel.property_name || panel.name || "N/A"}
                                </div>
                              </div>
                              <div
                                className="flex gap-2 mt-2 items-center text-[#303030] cursor-pointer"
                                onClick={() => {
                                  const modifiedPanelName =
                                    sanitizePropertyName(
                                      panel.property_name || panel.name
                                    );
                                  navigate(
                                    `/property/-${
                                      panel.id || index
                                    }-${modifiedPanelName}`
                                  );
                                }}
                              >
                                <div>
                                  <svg
                                    fill="#15803d"
                                    className="h-4 w-4 fill-[#303030]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                  >
                                    <path d="M32 32C14.3 32 0 46.3 0 64V448c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H32zM160 160c0-17.7 14.3-32 32-32H320c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V160zM288 352c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V288c0-17.7 14.3-32 32-32H256c17.7 0 32 14.3 32 32v64z" />
                                  </svg>
                                </div>
                                <div className="leading-6 text-[#303030] text-sm truncate">
                                  {panel.property_type || "N/A"}
                                </div>
                              </div>
                              <div
                                className="flex gap-2 mt-2 items-center text-[#303030] cursor-pointer"
                                onClick={() => {
                                  const modifiedPanelName =
                                    sanitizePropertyName(
                                      panel.property_name || panel.name
                                    );
                                  navigate(
                                    `/property/-${
                                      panel.id || index
                                    }-${modifiedPanelName}`
                                  );
                                }}
                              >
                                <div>
                                  <svg
                                    fill="#15803d"
                                    className="h-4 w-4 fill-[#303030]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 384 512"
                                  >
                                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                  </svg>
                                </div>
                                <div className="leading-6 text-[#303030] text-sm truncate">
                                  {panel.address || "N/A"}
                                </div>
                              </div>
                              <div
                                className="flex items-center gap-3 mt-2 cursor-pointer"
                                onClick={() => {
                                  const modifiedPanelName =
                                    sanitizePropertyName(
                                      panel.property_name || panel.name
                                    );
                                  navigate(
                                    `/property/-${
                                      panel.id || index
                                    }-${modifiedPanelName}`
                                  );
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {panel.bedrooms != null &&
                                    panel.bedrooms > 0 && (
                                      <img
                                        className="w-6"
                                        src={Bed}
                                        alt="Bedroom icon"
                                      />
                                    )}
                                  <div className="text-sm font-bold text-[#303030]">
                                    {panel.bedrooms != null &&
                                    panel.bedrooms > 0
                                      ? panel.bedrooms
                                      : null}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {panel.bathrooms != null &&
                                    panel.bathrooms > 0 && (
                                      <img
                                        className="w-6"
                                        src={Bath}
                                        alt="Bathroom icon"
                                      />
                                    )}
                                  <div className="text-sm font-bold text-[#303030]">
                                    {panel.bathrooms != null &&
                                    panel.bathrooms > 0
                                      ? panel.bathrooms
                                      : null}
                                  </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                  {panel.verified &&
                                    typeof panel.verified === "string" && (
                                      <img
                                        className="w-5"
                                        src={panel.verified}
                                        alt="Verified property icon"
                                        onError={(e) =>
                                          (e.target.src = NoImage)
                                        }
                                      />
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center mt-24 mb-24 font-bold text-lg text-red-600">
                      No Data Match
                    </p>
                  )
                ) : (
                  <p className="text-center mt-24 mb-24 font-bold text-lg text-red-600">
                    No Properties Available
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-10 mb-14 gap-4 items-center">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                Back
              </button>
              <span className="text-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
              </button>
              <select
                className="bg-white border border-green-600 p-2 rounded-md min-w-[100px] focus:outline-none focus:ring-2 focus:ring-green-600"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                aria-label="Select items per page"
              >
                <option value="9">9 page</option>
                <option value="18">18 page</option>
                <option value="36">36 page</option>
                <option value="100">100 page</option>
              </select>
            </div>
          </>
        )}
      </div>
      <OurServices />
    </>
  );
}
