import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AnimatedText from "./HeadingAnimation";
import { liveUrl, token } from "./url";
import OurServices from "./ourServices";
import PropertyCard from "./PropertyCard";
import "../../App.css";
import Cookies from "js-cookie";

const BUDGET_MIN = 500000;
const BUDGET_MAX = 200000000;

export default function GalleryComponentTwo() {
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
  const [wishlistIds, setWishlistIds] = useState(new Set());

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

  useEffect(() => {
    const storedUserId = Cookies.get("userId") || null;
    const storedToken = Cookies.get("authToken") || token;
    setUserId(storedUserId);
    setAuthToken(storedToken);
  }, []);

  useEffect(() => {
    const refetchWishlistOnMount = async () => {
      const storedUserId = Cookies.get("userId");
      const storedToken = Cookies.get("authToken") || token;
      if (storedUserId && storedToken) {
        try {
          console.log("Refetching wishlist on component mount/return");
          const response = await fetch(
            `${liveUrl}api/User/getWishlist_ids/?userid=${storedUserId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data.status === "success" && Array.isArray(data.result)) {
              const wishlistIds = data.result;
              console.log("fetched  wishlists IDs", wishlistIds);

              setWishlistIds(new Set(wishlistIds.map((id) => String(id))));

              const wishlistDetailsPromises = wishlistIds.map(async (id) => {
                const detailResponse = await fetch(
                  `${liveUrl}api/Reactjs/gallery/${id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${storedToken}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                if (detailResponse.ok) {
                  return detailResponse.json();
                }
                return null;
              });
              const wishlistDetails = await Promise.all(
                wishlistDetailsPromises
              );
              const wishlistItems = wishlistDetails
                .filter((item) => item !== null)
                .map((item) => ({
                  id: item.property_id || item.id,
                  property_id: item.property_id || item.id,
                  property_name:
                    item.property_name ||
                    item.property?.property_name ||
                    "Unknown Property",
                  address:
                    item.address ||
                    item.property?.address ||
                    "Unknown Location",
                  budget: item.budget || item.property?.budget || "N/A",
                  image: item.image || item.property?.image || "",
                  property_type:
                    item.property_type || item.property?.property_type || "N/A",
                  addedAt: item.addedAt || new Date().toISOString(),
                }));
              console.log("Wishlist restored on mount:", wishlistItems.length);
              setWishlist(wishlistItems);
            }
          }
        } catch (error) {
          console.error("Error refetching wishlist on mount:", error);
        }
      }
    };
    refetchWishlistOnMount();
  }, []);

  const isWishlist = (propertyId) => {
    if (!propertyId) {
      return false;
    }
    const searchId = String(propertyId || "");

    // First check the faster Set lookup
    if (wishlistIds.has(searchId)) {
      return true;
    }

    // Fallback to array check for backward compatibility
    if (!Array.isArray(wishlist) || wishlist.length === 0) {
      return false;
    }
    return wishlist.some((item) => {
      const itemId = String(item.id || "");
      const itemPropertyId = String(item.property_id || "");
      return itemId === searchId || itemPropertyId === searchId;
    });
  };

  const toggleWishlist = async (property) => {
    if (!userId || !authToken) {
      alert("Please log in to manage your wishlist.");
      navigate("/login");
      return;
    }

    const propertyId = property.id || property.property_id;
    if (wishlistLoading.has(propertyId)) {
      return;
    }

    setWishlistLoading((prev) => new Set(prev).add(propertyId));
    const isCurrentlyWishlisted = isWishlist(propertyId);
    const url = isCurrentlyWishlisted
      ? `${liveUrl}api/User/removefromwishlist`
      : `${liveUrl}api/User/addToWishlist`;
    const method = isCurrentlyWishlisted ? "DELETE" : "POST";

    try {
      console.log(
        `${isCurrentlyWishlisted ? "Removing from" : "Adding to"} wishlist:`,
        propertyId
      );
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

      const data = await response.json();
      console.log("API response:", data);

      if (
        data.status === "success" ||
        data.success === true ||
        data.message?.toLowerCase().includes("success") ||
        response.ok
      ) {
        const propertyIdStr = String(propertyId);

        setWishlistIds((prevIds) => {
          const newIds = new Set(prevIds);
          if (isCurrentlyWishlisted) {
            newIds.delete(propertyIdStr);
          } else {
            newIds.add(propertyIdStr);
          }
          return newIds;
        });

        setWishlist((prev) => {
          if (isCurrentlyWishlisted) {
            const newWishlist = prev.filter(
              (item) =>
                String(item.id || item.property_id) !== propertyIdStr &&
                String(item.property_id || item.id) !== propertyIdStr
            );
            console.log("Updated wishlist after remove:", newWishlist.length);
            return newWishlist;
          } else {
            const newItem = {
              id: propertyId,
              property_id: propertyId,
              property_name:
                property.property_name || property.name || "Unknown Property",
              address: property.address || "Unknown Location",
              budget: property.budget || "N/A",
              image: property.image || "",
              property_type: property.property_type || "N/A",
              addedAt: new Date().toISOString(),
            };
            console.log("Updated wishlist after add:", prev.length + 1);
            return [...prev, newItem];
          }
        });
        alert(
          `Property ${
            isCurrentlyWishlisted ? "removed from" : "added to"
          } wishlist successfully!`
        );
      } else {
        const errorMessage =
          data.message || data.error || "Unknown error occurred";
        alert(
          `Failed to ${
            isCurrentlyWishlisted ? "remove from" : "add to"
          } wishlist: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert(
        "Failed to update wishlist due to a network error. Please try again."
      );
    } finally {
      setWishlistLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
    }
  };

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

  const visiblePropertyTypes = showMorePropertyTypes
    ? propertyType
    : propertyType.slice(0, 6);
  const visibleAmenities = showMoreAmenities
    ? amenities
    : amenities.slice(0, 6);

  const handleRangeChange = (event) => {
    setRangeValues({
      min: parseInt(event.target.value),
      max: BUDGET_MAX,
    });
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocationFilter(event.target.value);
  };

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCheckboxChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleChange = (type) => {
    setSelectedPropertyType((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

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

  const isValidArea = (area) => area && !isNaN(area) && area > 0;

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

  const handleUnitChange = (panelId, unit, areaType) => {
    setUnitSelections((prev) => ({
      ...prev,
      [`${panelId}-${areaType}`]: unit,
    }));
  };

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

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex).sort((a, b) => {
    if (sortBy === "lowToHigh") return (a.budget || 0) - (b.budget || 0);
    if (sortBy === "highToLow") return (b.budget || 0) - (a.budget || 0);
    return 0;
  });

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

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
              <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
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
                      <PropertyCard
                        key={panel.id || index}
                        panel={panel}
                        index={index}
                        isWishlist={isWishlist}
                        toggleWishlist={toggleWishlist}
                        wishlistLoading={wishlistLoading}
                        formatBudget={formatBudget}
                        convertArea={convertArea}
                        unitSelections={unitSelections}
                        handleUnitChange={handleUnitChange}
                        sanitizePropertyName={sanitizePropertyName}
                      />
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
