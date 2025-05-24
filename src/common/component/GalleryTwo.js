import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Bed from "../../assets/img/bed.png";
import AnimatedText from "./HeadingAnimation";
import Bath from "../../assets/img/bath.png";
import Modal from "react-modal";
import NoImage from "../../assets/img/image-not.jpg";
import { liveUrl, token } from "./url";
import OurServices from "./ourServices";
import '../../App.css';

// Set Modal appElement for accessibility
Modal.setAppElement('#root');

export default function GalleryComponentTwo({ initialPropertyType }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [newData, setNewData] = useState([]);
  const [showCount, setShowCount] = useState(16);
  const [modals, setModals] = useState(false);
  const [loader, setLoader] = useState(false);
  const [amnties, setAmnties] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPropertyType, setSelectedPropertType] = useState([]);
  const [propertyType, setPropertyType] = useState([]);
  const [filteredPropertyType, setFilteredPropertyType] = useState([]);
  const [showMoreData, setShowMoreData] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rangeValues, setRangeValues] = useState({
    min: 0,
    max: 20000000,
  });
  const [locationFilter, setLocationFilter] = useState('');

  // Extract query parameters and preselect property type
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword") || "";
    const propertyTypeParam = queryParams.get("propertyType") || "";

    setSearchQuery(keyword);

    // Preselect property type from URL
    if (propertyTypeParam && propertyType.includes(propertyTypeParam)) {
      setSelectedPropertType([propertyTypeParam]);
    } else {
      setSelectedPropertType([]);
    }

    // Show all property types without category filtering
    setFilteredPropertyType(propertyType);
  }, [location.search, propertyType]);

  const visibleData = showMore ? filteredPropertyType : filteredPropertyType.slice(0, 6);
  const AmenitiesData = showMoreData ? amnties : amnties.slice(0, 6);

  const handleRangeChange = (event) => {
    setRangeValues({
      min: parseInt(event.target.value),
      max: 1000000 + parseInt(event.target.value),
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
    if (selectedAmenities.includes(panel)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== panel));
    } else {
      setSelectedAmenities([...selectedAmenities, panel]);
    }
  };

  const handleChange = (main) => {
    if (selectedPropertyType.includes(main)) {
      setSelectedPropertType(selectedPropertyType.filter((item) => item !== main));
    } else {
      setSelectedPropertType([...selectedPropertyType, main]);
    }
  };

  const formatBudget = (value) => {
    const formattedValue = value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (value >= 10000000) {
      return (
        (value / 10000000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " Crore"
      );
    } else if (value >= 100000) {
      return (
        (value / 100000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " Lac"
      );
    } else if (value >= 1000) {
      return (
        (value / 1000).toLocaleString(undefined, { minimumFractionDigits: 2 }) +
        " Thousand"
      );
    } else {
      return formattedValue;
    }
  };

  const filterPanelsByBudget = (panel) => {
    const panelBudget = parseInt(panel.budget);
    const panelAmenities = panel.amenities ? panel.amenities.split('~-~') : [];
    const propertyCheck = panel.property_type;
    const searchLower = searchQuery.toLowerCase().trim();

    // Budget filter
    let isBudgetInRange = true;
    if (rangeValues.min !== null && rangeValues.max !== null) {
      isBudgetInRange = panelBudget >= rangeValues.min && panelBudget <= rangeValues.max;
    }

    // Search filter
    const matchesSearch = !searchQuery || 
      (panel.name && panel.name.toLowerCase().includes(searchLower)) ||
      (panel.property_name && panel.property_name.toLowerCase().includes(searchLower)) ||
      (panel.address && panel.address.toLowerCase().includes(searchLower)) ||
      (panel.property_type && panel.property_type.toLowerCase().includes(searchLower)) ||
      (panelAmenities.some(amenity => amenity.toLowerCase().includes(searchLower))) ||
      (panel.bedrooms && panel.bedrooms.toString().includes(searchLower)) ||
      (panel.bathrooms && panel.bathrooms.toString().includes(searchLower)) ||
      (panel.sqft && panel.sqft.toString().includes(searchLower)) ||
      (formatBudget(panelBudget).toLowerCase().includes(searchLower));

    // Location filter
    const matchesLocation = !locationFilter || panel.address.toLowerCase().includes(locationFilter.toLowerCase());

    // Amenities filter
    const hasSelectedAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.some((amenity) => panelAmenities.includes(amenity));

    // Property type filter
    const hasSelectedPropertyType = selectedPropertyType.length === 0 || 
      selectedPropertyType.some((property_type) => propertyCheck.includes(property_type));

    return isBudgetInRange && 
           matchesSearch && 
           matchesLocation && 
           hasSelectedAmenities && 
           hasSelectedPropertyType;
  };

  const filteredData = newData.filter(filterPanelsByBudget);

  const handleShowMore = () => {
    setShowCount(showCount + 8);
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
        console.log(data.result, "this is response");
        setNewData(data.result);
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
        setPropertyType(data.result);
        setFilteredPropertyType(data.result);
        console.log("Fetched Property Types:", data.result);
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
        setAmnties(data.result);
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

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedPropertType([]);
    setSelectedAmenities([]);
    setSortBy('');
    setRangeValues({ min: 0, max: 20000000 });
    setLocationFilter('');
    navigate('/property');
  };

  // Updated dynamicHeading to prioritize initialPropertyType from Home, then URL param
  const queryParams = new URLSearchParams(location.search);
  const propertyTypeParam = queryParams.get("propertyType") || "";
  const dynamicHeading = initialPropertyType ? `Property ${initialPropertyType}` : 
                        propertyTypeParam ? `Property ${propertyTypeParam}` : 
                        "Properties";

  return (
    <>
      <div className="">
        {loader ? (
          <>
            <div className="flex justify-center align-items-center p-2">
              <svg
                className="animate-spin h-10 w-10"
                fill="#014108"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M304 48a48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
              </svg>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center items-center my-4 gap-4">
              <div className="font-bold text-xl uppercase text-center text-green-800">
                <AnimatedText text={dynamicHeading} />
              </div>
              <div className="inline-block bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-md">
                {filteredData.length} {filteredData.length === 1 ? "Property" : "Properties"} Found
              </div>
            </div>
            <div className="lg:flex mb-4 sticky top-0 bg-white p-2 w-full shadow-md justify-start items-center gap-2" style={{ alignItems: 'center', zIndex: '999999' }}>
              <div>
                <input
                  placeholder="Search by name, address, type, amenities, bedrooms, etc."
                  className="border border-green-600 p-2"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="checkbox-dropdown bg-white border p-2 border-green-600 check-box-div">
                <button onClick={handleToggleDropdown} className="w-full text-left">
                  {selectedPropertyType.length > 0 ? (
                    <div className="selected-property-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }} title={selectedPropertyType.join(", ")}>
                      {selectedPropertyType.join(", ")}
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center items-center">
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
                    className="dropdown-content-div"
                  >
                    {visibleData.map((main) => (
                      <div className="flex gap-4" key={main}>
                        <input
                          type="checkbox"
                          id={main}
                          checked={selectedPropertyType.includes(main)}
                          onChange={() => handleChange(main)}
                        />
                        <label htmlFor={main}>{main}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <select
                className="bg-white border p-2 border-green-600"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="">Sort By:</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
              <div className="flex items-center gap-2">
                <select
                  className="bg-white border p-2 border-green-600"
                  value={locationFilter}
                  onChange={handleLocationChange}
                >
                  <option value="">All Locations</option>
                  <option value="Mohali">Mohali</option>
                  <option value="Zirakpur">Zirakpur</option>
                  <option value="Kharar">Kharar</option>
                  <option value="Chandigarh">Chandigarh</option>
                </select>
                {(searchQuery || selectedPropertyType.length > 0 || selectedAmenities.length > 0 || sortBy || locationFilter || (rangeValues.min !== 0 || rangeValues.max !== 20000000)) && (
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-10" style={{ alignItems: "flex-start" }}>
              <div className="lg:block hidden shadow-lg p-2">
                <div className="flex w-full gap-4 items-center">
                  {/* <div
                    onClick={() => navigate("/for-rent")}
                    className="border w-full the bg-red-600 text-white uppercase cursor-pointer text-center border-red-600 p-2 rounded-md"
                  >
                    Rent
                  </div> */}
                </div>
                <div className="font-bold text-lg mt-3 text-green-800">
                  Select Property
                </div>
                <div className="border mt-4 border-green-800 p-2 bg-white">
                  <div>
                    <div className="flex gap-2 justify-between">
                      <p>Budget: {formatBudget(rangeValues.max)}</p>
                    </div>
                    <input
                      type="range"
                      className="h-14 border border-black p-2 rounded"
                      min="1"
                      max="20000000"
                      value={rangeValues.min}
                      onChange={handleRangeChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="font-bold mb-2 mt-2">Property Type</div>
                  {visibleData.map((main) => (
                    <div key={main} className="flex gap-2">
                      <input
                        checked={selectedPropertyType.includes(main)}
                        onChange={() => handleChange(main)}
                        className="h-4 w-4"
                        type="checkbox"
                      />
                      <div>{main}</div>
                    </div>
                  ))}
                  {!showMore && filteredPropertyType.length > 6 && (
                    <button
                      className="text-blue-600"
                      onClick={() => setShowMore(true)}
                    >
                      Show More
                    </button>
                  )}
                </div>
                <div className="font-bold text-lg mt-2">Amenities</div>
                {AmenitiesData.map((panel) => (
                  <div className="flex gap-2 mt-2" key={panel}>
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
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 justify-items-center">
                {newData && Array.isArray(newData) && newData.length > 0 ? (
                  filteredData.length > 0 ? (
                    filteredData
                      .slice(0, showCount)
                      .sort((a, b) => {
                        if (sortBy === "lowToHigh") {
                          return a.budget - b.budget;
                        } else if (sortBy === "highToLow") {
                          return b.budget - a.budget;
                        }
                        return 0;
                      })
                      .map((panel) => (
                        <button className="property-div" key={panel.id}>
                          <div
                            onClick={() => {
                              const modifiedPanelName = panel.name
                                .replace(/\s/g, "-")
                                .replace(/[^\w\s]/g, "-")
                                .toLowerCase();
                              navigate(`/property/-${panel.id}-${modifiedPanelName}`);
                            }}
                            className="rounded-md cursor-pointer hover:scale-105 shadow-lg transition duration-300 ease-in-out"
                          >
                            {panel.image && typeof panel.image === "string" &&
                              (panel.image.endsWith(".jpg") || panel.image.endsWith(".jpeg") || panel.image.endsWith(".png") || panel.image.endsWith(".svg")) ? (
                              <img
                                className="rounded-t-md cursor-pointer h-52 w-full"
                                src={panel.image}
                                alt="Panel"
                              />
                            ) : (
                              <img
                                className="rounded-t-md cursor-pointer h-52 w-full"
                                src={NoImage}
                                alt="No Image"
                              />
                            )}
                            <div className="text-left min-h-[130px] bg-white border border-t leading-4 p-2">
                              <div className="mr-2">
                                <div>
                                  <div className="text-sm font-extralight">
                                    {panel.property_name}
                                  </div>
                                  <div className="flex items-center text-green-800 font-bold" style={{ flexWrap: 'wrap' }}>
                                    <svg
                                      fill="#14532D"
                                      className="w-5 h-5"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 320 512"
                                    >
                                      <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                    </svg>
                                    {formatBudget(panel.budget)}
                                    <div className="text-md text-sm ml-2">
                                      {panel.sqft > 0 ? (
                                        <>| {panel.sqft} {panel.measureUnit}</>
                                      ) : null}
                                    </div>
                                    {panel.type ? (
                                      <div className="text-md text-sm">
                                        | {panel.name}
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="flex gap-2 mt-2 items-center">
                                    <div>
                                      <svg
                                        fill="#808080"
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 384 512"
                                      >
                                        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                      </svg>
                                    </div>
                                    <div className="leading-6 font-semibold text-sm">
                                      {panel.address}
                                    </div>
                                  </div>
                                  <div className="flex items-center lg:gap-3 gap-3 mt-4">
                                    <div className="flex items-center gap-2">
                                      {panel.bedrooms ? (
                                        <img className="w-6" src={Bed} />
                                      ) : null}
                                      <div>{panel.bedrooms}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {panel.bathrooms ? (
                                        <img className="w-6" src={Bath} />
                                      ) : null}
                                      <div>{panel.bathrooms}</div>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                      <img className="w-5" src={panel.varifed} />
                                    </div>
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
                ) : null}
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