import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Bed from "../../assets/img/bed.png";
import AnimatedText from "./HeadingAnimation";
import Bath from "../../assets/img/bath.png";
import Modal from "react-modal";
import NoImage from "../../assets/img/image-not.jpg";
import { liveUrl, token } from "./url";
import OurServices from "./ourServices";
import "../../App.css";

// Set Modal appElement for accessibility
Modal.setAppElement("#root");

export default function GalleryComponentTwo({ initialPropertyType }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [newData, setNewData] = useState([]);
  const [showCount, setShowCount] = useState(12);
  const [modals, setModals] = useState(false);
  const [loader, setLoader] = useState(false);
  const [amnties, setAmnties] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPropertyType, setSelectedPropertType] = useState([]);
  const [propertyType, setPropertyType] = useState([]);
  const [showMoreData, setShowMoreData] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rangeValues, setRangeValues] = useState({
    min: 500000,
    max: 200000000,
  });
  const [locationFilter, setLocationFilter] = useState("");
  const [rentFilter, setRentFilter] = useState(false);

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedPropertType([]);
    setSelectedAmenities([]);
    setSortBy("");
    setRangeValues({ min: 500000, max: 200000000 });
    setLocationFilter("");
    setRentFilter(false);
    navigate("/property?category=All&propertyType=buy");
  };

  // Extract query parameters and pre-select property types
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword") || "";
    const category = queryParams.get("category") || "All";
    const propertyTypeParam = queryParams.get("propertyType") || "buy";

    setSearchQuery(keyword);

    if (category !== "All" && propertyType.length > 0) {
      const preSelectedTypes = propertyType.filter((type) =>
        type.toLowerCase().includes(category.toLowerCase())
      );
      setSelectedPropertType(preSelectedTypes);
      setRentFilter(propertyTypeParam === "rent");
    } else {
      setRentFilter(propertyTypeParam === "rent");
      setSelectedPropertType([]);
    }
  }, [location.search, propertyType]);

  const visibleDataSidebar = showMore ? propertyType : propertyType.slice(0, 6);
  const AmenitiesDataSidebar = showMoreData ? amnties : amnties.slice(0, 6);
  const visibleData = propertyType;
  const AmenitiesData = amnties;

  const handleRangeChange = (event) => {
    setRangeValues({
      min: parseInt(event.target.value),
      max: 200000000,
    });
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocationFilter(event.target.value);
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCheckboxChange = (panel) => {
    setSelectedAmenities((prev) =>
      prev.includes(panel)
        ? prev.filter((item) => item !== panel)
        : [...prev, panel]
    );
  };

  const handleChange = (main) => {
    setSelectedPropertType((prev) =>
      prev.includes(main)
        ? prev.filter((item) => item !== main)
        : [...prev, main]
    );
  };

  const formatBudget = (value) => {
    if (value >= 10000000) {
      return (
        (value / 10000000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " Cr"
      );
    } else if (value >= 100000) {
      return (
        (value / 100000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " Lac"
      );
    } else {
      return (
        (value / 1000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }) + " Thousand"
      );
    }
  };

  const filterPanelsByBudget = (panel) => {
    const panelBudget = parseInt(panel.budget) || 0;
    const panelAmenities = panel.amenities ? panel.amenities.split("~-~") : [];
    const propertyCheck = (panel.property_type || "").toLowerCase().trim();
    const searchLower = searchQuery.toLowerCase().trim();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category") || "All";

    const isBudgetInRange =
      panelBudget >= rangeValues.min && panelBudget <= rangeValues.max;

    const matchesSearch =
      !searchQuery ||
      (panel.name && panel.name.toLowerCase().includes(searchLower)) ||
      (panel.property_name &&
        panel.property_name.toLowerCase().includes(searchLower)) ||
      (panel.address && panel.address.toLowerCase().includes(searchLower)) ||
      (panel.property_type &&
        panel.property_type.toLowerCase().includes(searchLower)) ||
      panelAmenities.some((amenity) =>
        amenity.toLowerCase().includes(searchLower)
      ) ||
      (panel.bedrooms && panel.bedrooms.toString().includes(searchLower)) ||
      (panel.bathrooms && panel.bathrooms.toString().includes(searchLower)) ||
      (panel.sqft && panel.sqft.toString().includes(searchLower)) ||
      formatBudget(panelBudget).toLowerCase().includes(searchLower);

    const matchesCategory =
      category === "All" ||
      propertyCheck.includes(category.toLowerCase());

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
      !rentFilter ||
      propertyCheck.includes("rent");

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

  const handleShowMore = () => {
    setShowCount((prev) => prev + 12);
  };

  const handleSubmit = () => {
    setLoader(true);
    fetch(`${liveUrl}api/Reactjs/gallery`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNewData(data.result || []);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error:", error);
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
      .then((response) => response.json())
      .then((data) => {
        setPropertyType(data.result || []);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoader(false);
      });
  };

  const handleAmenties = () => {
    setLoader(true);
    fetch(`${liveUrl}api/Reactjs/amenities`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAmnties(data.result || []);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoader(false);
      });
  };

  useEffect(() => {
    handleSubmit();
    handlePropertyType();
    handleAmenties();
  }, []);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
    },
  };

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
      rangeValues.min !== 500000 ||
      rangeValues.max !== 200000000 ||
      rentFilter
    );
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
            <div className="flex justify-center items-center my-4 gap-4">
              <div className="font-bold text-xl uppercase text-center text-green-800">
                <AnimatedText text={dynamicHeading} />
              </div>
              <div className="inline-block bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-md">
                {filteredData.length}{" "}
                {filteredData.length === 1 ? "Property" : "Properties"} Found
              </div>
            </div>
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
                />
              </div>
              <div className="relative bg-white border border-green-600 p-2 rounded-md min-w-[200px] max-w-[200px]">
                <button
                  onClick={handleToggleDropdown}
                  className="w-full text-left flex justify-between items-center"
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
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    className="absolute bg-white border border-green-600 mt-2 p-2 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto min-w-[200px]"
                  >
                    {visibleData.map((main) => (
                      <div className="flex gap-2 items-center py-1" key={main}>
                        <input
                          type="checkbox"
                          id={main}
                          checked={selectedPropertyType.includes(main)}
                          onChange={() => handleChange(main)}
                          className="h-4 w-4 text-green-600 focus:ring-green-600"
                        />
                        <label htmlFor={main} className="text-sm">
                          {main}
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
              >
                <option value="">Sort By:</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
              <select
                className="bg-white border border-green-600 p-2 rounded-md min-w-[150px] focus:outline-none focus:ring-2 focus:ring-green-600"
                value={locationFilter}
                onChange={handleLocationChange}
              >
                <option value="">All Locations</option>
                <option value="Mohali">Mohali</option>
                <option value="Zirakpur">Zirakpur</option>
                <option value="Kharar">Kharar</option>
                <option value="Chandigarh">Chandigarh</option>
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
            <div className="flex gap-10" style={{ alignItems: "flex-start", justifyContent:"center" }}>
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
                      min="500000"
                      max="200000000"
                      value={rangeValues.min}
                      onChange={handleRangeChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="font-bold mb-2 mt-2">Property Type</div>
                  {visibleDataSidebar.map((main) => (
                    <div key={main} className="flex gap-2 mt-1">
                      <input
                        checked={selectedPropertyType.includes(main)}
                        onChange={() => handleChange(main)}
                        className="h-4 w-4"
                        type="checkbox"
                      />
                      <div>{main}</div>
                    </div>
                  ))}
                  {!showMore && propertyType.length > 6 && (
                    <button
                      className="text-blue-600"
                      onClick={() => setShowMore(true)}
                    >
                      Show More
                    </button>
                  )}
                </div>
                <div className="font-bold text-lg mt-2">Amenities</div>
                {AmenitiesDataSidebar.map((panel) => (
                  <div className="flex gap-2 mt-1" key={panel}>
                    <div className="text-md leading-2 text-black font-leading">
                      <div className="grid grid-cols-1">
                        <div className="flex items-center leading-6">
                          <div>
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={selectedAmenities.includes(panel)}
                              onChange={() => handleCheckboxChange(panel)}
                            />
                          </div>
                          <div className="ml-2 mr-2">{panel}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!showMoreData && amnties.length > 6 && (
                  <button
                    className="text-blue-600"
                    onClick={() => setShowMoreData(true)}
                  >
                    Show More
                  </button>
                )}
              </div>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 justify-items-center">
                {newData && Array.isArray(newData) && newData.length > 0 ? (
                  filteredData.length > 0 ? (
                    filteredData
                      .slice(0, showCount)
                      .sort((a, b) => {
                        if (sortBy === "lowToHigh") return a.budget - b.budget;
                        if (sortBy === "highToLow") return b.budget - a.budget;
                        return 0;
                      })
                      .map((panel) => (
                        <button
                          className={`property-div w-full max-w-[350px] h-[350px] rounded-md shadow-lg transition duration-300 ease-in-out ${
                            selectedPropertyType.includes(panel.property_type)
                              ? "border-2 "
                              : ""
                          }`}
                          key={panel.id}
                        >
                          <div
                            onClick={() => {
                              const modifiedPanelName = panel.name
                                .replace(/\s/g, "-")
                                .replace(/[^\w\s]/g, "-")
                                .toLowerCase();
                              navigate(
                                `/property/-${panel.id}-${modifiedPanelName}`
                              );
                            }}
                            className="flex flex-col h-full"
                          >
                            <div className="flex-shrink-0">
                              {panel.image &&
                              typeof panel.image === "string" &&
                              (panel.image.endsWith(".jpg") ||
                                panel.image.endsWith(".jpeg") ||
                                panel.image.endsWith(".png") ||
                                panel.image.endsWith(".svg")) ? (
                                <img
                                  className="rounded-t-md h-[200px] w-full object-cover"
                                  src={panel.image}
                                  alt="Panel"
                                />
                              ) : (
                                <img
                                  className="rounded-t-md h-[200px] w-full object-cover"
                                  src={NoImage}
                                  alt="No Image"
                                />
                              )}
                            </div>
                            <div className="flex-grow text-left bg-white border border-t leading-4 p-3">
                              <div className="mr-2">
                                <div className="text-sm font-extralight truncate">
                                  {panel.property_name}
                                </div>
                                <div className="flex items-center text-green-800 font-bold flex-wrap">
                                  <svg
                                    fill="#14532D"
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 512"
                                  >
                                    <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                  </svg>
                                  <span className="ml-1">
                                    {formatBudget(panel.budget)}
                                  </span>
                                  <div className="text-sm ml-2">
                                    {panel.sqft > 0
                                      ? `| ${panel.sqft} ${panel.measureUnit}`
                                      : null}
                                  </div>
                                  {panel.type ? (
                                    <div className="text-sm ml-2">
                                      | {panel.name}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="flex gap-2 mt-2 items-center text-green-800">
                                  <div>
                                    <svg
                                      fill="#15803d"
                                      className="h-5 w-5"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 384 512"
                                    >
                                      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                    </svg>
                                  </div>
                                  <div className="leading-6 font-semibold text-sm truncate">
                                    {panel.address}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 mt-4">
                                  <div className="flex items-center gap-2">
                                    {panel.bedrooms != null &&
                                      panel.bedrooms > 0 && (
                                        <img
                                          className="w-6"
                                          src={Bed}
                                          alt="Bed"
                                        />
                                      )}
                                    <div>
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
                                          alt="Bath"
                                        />
                                      )}
                                    <div>
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
                                          alt="Verified"
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
                        </button>
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
            <div className="flex justify-center mt-10 mb-14">
              {showCount < filteredData.length && (
                <button
                  className="font-bold p-2 w-52 rounded-md text-white bg-red-600"
                  onClick={handleShowMore}
                >
                  Show More
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <OurServices />
    </>
  );
}