/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Bath from "../assets/img/bath.png";
import Bed from "../assets/img/bed.png";
import NoImage from "../assets/img/image-not.jpg";
import { liveUrl, token } from "../common/component/url";
import Navbar from "../common/component/navbar";
import BottomBar from "../common/component/bottomBar";
import OurServices from "../common/component/ourServices";
import Searching from "../common/component/searching";
import AnimatedText from "../common/component/HeadingAnimation";
import { WhatsappShareButton } from "react-share";
import Varified from "../assets/img/varified.png";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";

export default function Rent() {
  const Navigate = useNavigate();
  const [newData, setNewData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [like, setLike] = useState(false);
  const [click, setClick] = useState(false);
  const [showCount, setShowCount] = useState(8); // Changed initial value to 8
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageshow, setImageShow] = useState("");
  const [amnties, setAmnties] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPropertyType, setSelectedPropertType] = useState([]);
  const [propertyType, setPropertyType] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showMoreData, setShowMoreData] = useState(false);
  const [activeView, setActiveView] = useState("grid");
  const [dataShow, setDataShow] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [rangeValues, setRangeValues] = useState({
    min: 5000,
    max: 100000,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  window.scroll(0, 0);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const designView = () => {
    setDataShow(false);
  };

  const handleSwitchView = (view) => {
    setActiveView(view);
    designView();
    setDataShow(!dataShow);
    setIsOpen(false);
  };

  const handleCheckboxChange = (panel) => {
    if (selectedAmenities.includes(panel)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== panel));
    } else {
      setSelectedAmenities([...selectedAmenities, panel]);
    }
  };

  const handleChange = (main) => {
    const normalizedMain = main.trim().toLowerCase();
    if (selectedPropertyType.includes(normalizedMain)) {
      setSelectedPropertType(
        selectedPropertyType.filter((item) => item.toLowerCase() !== normalizedMain)
      );
    } else {
      setSelectedPropertType([...selectedPropertyType, normalizedMain]);
      setIsOpen(false);
    }
  };

  const handleRangeChange = (event) => {
    const minValue = parseInt(event.target.value);
    setRangeValues({
      min: minValue,
      max: minValue + 1000,
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAmenities([]);
    setSelectedPropertType([]);
    setRangeValues({ min: 5000, max: 100000 });
    setSortBy("");
    setSelectedLocation("");
    setShowCount(8); // Reset to 8 when clearing filters
  };

  const [store, setStore] = useState({
    firstname: "",
    phone: "",
  });

  const handleText = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const custom = {
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

  function HandleApi() {
    if (!store || typeof store.phone === "undefined") {
      return;
    }
    setClick(true);
    fetch(`${liveUrl}api/Contact/contact`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...store,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        if (data.status === "done") {
          toast.success("We will Contact You Soon ");
          setModalIsOpen(false);
          setStore({ phone: "" });
          setIsLoading(true);
        } else {
          toast.error("Something Went Wrong");
          setStore({ phone: "" });
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error in API call:", error);
        toast.error("Error in API call. Please try again later.");
        setIsLoading(false);
      });
  }

  const handleSubmit = () => {
    setLoader(true);
    fetch(`${liveUrl}rent`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNewData(data.result);
        setImageShow(data.imgUrl);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error:", error);
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
      });
  };

  const handlePropertyType = () => {
    setLoader(true);
    fetch(`${liveUrl}all-property-types`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPropertyType(data.result);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    handleSubmit();
    handleAmenties();
    handlePropertyType();
    clearFilters();
  }, []);

  // Add this new useEffect after your existing useEffect hooks:
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(".rent-class.checkbox-dropdown");
      if (dropdown && !dropdown.contains(event.target)) {
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

  const LikeContainer = () => {
    setLike(true);
  };

  const disLikeContainer = () => {
    setLike(false);
  };

  const shareUrl = "https://bestpropertiesmohali.com/rent";

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
        }) + " Cr"
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
        (value / 1000).toLocaleString(undefined, { minimumFractionDigits: 0 }) +
        "K"
      );
    } else {
      return formattedValue;
    }
  };

  const visibleData = showMore ? propertyType : propertyType.slice(0, 6);
  const AmenitiesData = showMoreData ? amnties : amnties.slice(0, 6);

  const filterPanelsByBudget = (panel) => {
    const panelBudget = panel.budget;
    const panelAmenities = panel.amenities || [];
    const panelSector = (panel.sector || "").trim();
    const panelAddress = (panel.address || "").trim();
    const propertyCheck = (panel.property_type || "").trim().toLowerCase();

    let isBudgetInRange = true;
    if (rangeValues.min !== null && rangeValues.max !== null) {
      isBudgetInRange =
        panelBudget >= rangeValues.min && panelBudget <= rangeValues.max;
    }

    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      searchQuery === "" ||
      (panel.name && panel.name.toLowerCase().includes(searchLower)) ||
      (panel.address && panel.address.toLowerCase().includes(searchLower)) ||
      (panel.sector && panel.sector.toLowerCase().includes(searchLower)) ||
      (panel.property_type &&
        panel.property_type.toLowerCase().includes(searchLower));

    const matchesLocation =
      selectedLocation === "" ||
      (panelSector &&
        (panelSector
          .toLowerCase()
          .includes(selectedLocation.toLowerCase().trim()) ||
          panelSector
            .toLowerCase()
            .split(/[\s,-]+/)
            .some((part) => part === selectedLocation.toLowerCase().trim()))) ||
      (panelAddress &&
        (panelAddress
          .toLowerCase()
          .includes(selectedLocation.toLowerCase().trim()) ||
          panelAddress
            .toLowerCase()
            .split(/[\s,-]+/)
            .some((part) => part === selectedLocation.toLowerCase().trim())));

    const hasExactPropertyType = selectedPropertyType.length
      ? selectedPropertyType.includes(propertyCheck)
      : true;

    const hasAllSelectedAmenities = selectedAmenities.length
      ? selectedAmenities.every((amenity) => panelAmenities.includes(amenity))
      : true;

    return (
      isBudgetInRange &&
      hasAllSelectedAmenities &&
      hasExactPropertyType &&
      matchesSearch &&
      matchesLocation
    );
  };

  const areFiltersApplied =
    searchQuery !== "" ||
    selectedAmenities.length > 0 ||
    selectedPropertyType.length > 0 ||
    rangeValues.min !== 5000 ||
    rangeValues.max !== 100000 ||
    sortBy !== "" ||
    selectedLocation !== "";

  return (
    <div className="">
      <Navbar />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={custom}
      >
        <div className="lg:w-[400px] w-full">
          <div className="flex justify-center items-center rounded-lg">
            <div className="font-bold text-2xl text-green-800">Book Now!</div>
            <button
              onClick={() => setModalIsOpen(false)}
              className="bg-red-600 absolute top-0 right-0 w-8 h-8 flex justify-center items-center"
            >
              <svg
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 384 512"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </button>
          </div>
          <div className="w-full mt-4">
            <label className="block tracking-wide text-lg font-bold mb-2">
              Your Name
            </label>
            <input
              className="appearance-none outline-none block w-full h-12 border-2 border-green-600 rounded px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-green-600"
              id="firstname"
              name="firstname"
              value={store.firstname}
              onChange={handleText}
              placeholder="Please enter your firstname"
            />
            {click && store.firstname === "" ? (
              <div className="text-red-600">Required to fill firstName</div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3">
          <div className="w-full px-3">
            <label className="block tracking-wide text-lg font-bold mb-2">
              Phone
            </label>
            <input
              type="number"
              name="phone"
              value={store.phone}
              onChange={handleText}
              className="appearance-none outline-none block w-full border-2 h-12 border-green-600 rounded px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-green-600"
              id="phone"
              placeholder="Please enter your phone number"
            />
            {click && store.phone.length < 10 ? (
              <div className="text-red-600">Phone number is not valid</div>
            ) : null}
            {click && store.phone.length > 10 ? (
              <div className="text-red-600">Phone number is not valid</div>
            ) : null}
          </div>
        </div>
        <button
          onClick={() => HandleApi()}
          className={`bg-red-600 w-full text-white text-lg p-2 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </Modal>
      {loader ? (
        <div className="flex justify-center align-items-center p-2">
          <svg
            className="animate-spin h-10 w-10"
            fill="#014108"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
          </svg>
        </div>
      ) : (
        <>
          <div className="text-green-800 uppercase font-bold text-xl text-center py-4 flex flex-wrap justify-center items-center gap-4">
            <AnimatedText text="Properties for Rent" />
            <div className="gap-3 inline-block bg-green-100 text-green-800 font-semibold py-2 px-4 text-base rounded-md">
              {newData.filter(filterPanelsByBudget).length} Property Found
            </div>
          </div>

          <div className="container mx-auto">
           <div className=" bg-white p-2 lg:shadow-md flex flex-col lg:flex-row items-center gap-2 flex-wrap ">
  
  {/* Search Input - Full Width */}
  <div className="relative w-full min-w-[150px] lg:flex-1">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      🔍
    </span>
    <input
      placeholder="Search by name, address, or sector..."
      className="border-2 border-green-600 p-3 pl-10 text-lg rounded-md h-11 w-full"
      value={searchQuery}
      onChange={handleSearchChange}
    />
  </div>

  {/* Mobile: Property + Sort in one row, Desktop: separate */}
  <div className="flex gap-4 w-full lg:w-auto lg:contents">
    {/* Property Selector */}
    <div className="rent-class checkbox-dropdown bg-white border-2 border-green-600 p-3 text-lg rounded-md h-11 w-1/2 lg:w-[200px] relative">
      <button
        onClick={handleToggleDropdown}
        className="w-full h-full text-left flex items-center justify-between px-2"
      >
        <div className="truncate text-base
         lg:text-base">
          {selectedPropertyType.length > 0
            ? selectedPropertyType.join(", ")
            : "Select Property"}
        </div>
        <svg
          fill="black"
          className={`h-3 w-3 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 bg-white border border-green-600 rounded-md mt-1 z-10 w-full max-h-60 overflow-y-auto">
          {visibleData.map((main) => (
            <div
              className="flex cursor-pointer gap-4 px-2 py-1 hover:bg-gray-100"
              key={main}
            >
              <input
                type="checkbox"
                id={main}
                checked={selectedPropertyType.includes(main.toLowerCase())}
                onChange={() => handleChange(main)}
                className="h-4 w-4"
              />
              <label className="seach-label cursor-pointer" htmlFor={main}>
                {main}
              </label>
            </div>
          ))}
          {!showMore && propertyType.length > 6 && (
            <button
              className="text-blue-600 px-2 py-1 w-full text-left"
              onClick={() => setShowMore(true)}
            >
              Show More
            </button>
          )}
        </div>
      )}
    </div>

    {/* Sort By */}
    <select
      className="rent_class_point bg-white border-2 border-green-600 p-1 text-base lg:text-base rounded-md h-11 w-1/2 lg:w-[200px]"
      value={sortBy}
      onChange={handleSortChange}
    >
      <option value="">Sort By:</option>
      <option value="lowToHigh">Low to High</option>
      <option value="highToLow">High to Low</option>
    </select>
  </div>

  {/* Mobile: Location + Clear in one row, Desktop: separate */}
  <div className="flex gap-2 w-full lg:w-auto lg:contents">
    {/* Location */}
    <select
                  className="rent_class_point bg-white border-2 border-green-600 p-2 text-base rounded-md h-11 w-full lg:w-1/4 min-w-[200px]"
      value={selectedLocation}
      onChange={handleLocationChange}
    >
                  <option value="">Select Location</option>
      <option value="Mohali">Mohali</option>
      <option value="Zirakpur">Zirakpur</option>
      <option value="Kharar">Kharar</option>
      <option value="Chandigarh">Chandigarh</option>
    </select>

    {/* Clear Button */}
    {areFiltersApplied && (
      <button
        onClick={clearFilters}
                    className="clear-button bg-red-600 d-flex justify-center align-middle text-white p-3 text-lg rounded-md h-11 w-full lg:w-auto min-w-[100px] px-4"
      >
        Clear
      </button>
    )}
  </div>
              <div className="w-14 flex justify-center lg:ml-auto">
    <div
      className={`${
        activeView === "grid"
          ? "bg-[#e2e2e2] rounded-md p-2 cursor-pointer"
          : "bg-[#e2e2e2] rounded-md p-2 cursor-pointer"
      }`}
      onClick={() =>
        handleSwitchView(activeView === "grid" ? "list" : "grid")
      }
    >
                  {activeView === "grid" ? (
                    <svg
                      fill="green"
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" />
                    </svg>
                  ) : (
                    <svg
                      fill="green"
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M448 96V224H288V96H448zm0 192V416H288V288H448zM224 224H64V96H224V224zM64 288H224V416H64V288zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" />
                    </svg>
                  )}
    </div>
  </div>
</div>

            <div className="flex w-full justify-center gap-4 mb-10 p-2 items-start">
              <div className="w-1/4 lg:block hidden">
                <div className="shadow-lg p-2">
                  <div className="flex w-full gap-4 items-center">
                    <div
                      onClick={() => {
                        Navigate("/property");
                      }}
                      className="border text-white bg-red-600 w-full cursor-pointer text-center uppercase border-red-600 p-2 rounded-md"
                    >
                      Buy
                    </div>
                  </div>
                  <div className="font-bold text-lg mb-3 mt-3 text-green-800">
                    Select Property
                  </div>
                  <div className="border-2 border-green-600 p-2 rounded-md bg-white">
                    <div>
                      <div className="flex justify-between">
                        <p>Budget: {formatBudget(rangeValues.min)}</p>
                      </div>
                      <input
                        type="range"
                        className="w-full p-2 rounded"
                        min="5000"
                        max="100000"
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
                          checked={selectedPropertyType.includes(main.toLowerCase())}
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
                  {AmenitiesData.map((panel) => (
                    <div className="flex gap-2 mt-2" key={panel}>
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedAmenities.includes(panel)}
                        onChange={() => handleCheckboxChange(panel)}
                      />
                      <div className="ml-2 mr-2">{panel}</div>
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
              </div>
              {dataShow ? (
                <div className="w-full">
                  {newData &&
                    Array.isArray(newData) &&
                    newData.length > 0 &&
                    (newData.filter(filterPanelsByBudget).length > 0 ? (
                      <>
                        {newData
                          .filter(filterPanelsByBudget)
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
                            <div
                              className="border mb-2 lg:flex md:flex justify-between w-full rounded-md cursor-pointer shadow-lg"
                              key={panel.id}
                            >
                              <div
                                onClick={() => {
                                  const modifiedPanelName = panel.name
                                    .replace(/\s/g, "")
                                    .toLowerCase()
                                    .replace(/[^\w\s]/g, "");
                                  Navigate(
                                    `/rentDetails/-${panel.id}-${modifiedPanelName}`
                                  );
                                  window.scrollTo(0, 0);
                                }}
                                className="lg:flex cursor-pointer sm:flex items-center"
                              >
                                <div>
                                  {panel.image ? (
                                    <div className="flex justify-center items-center">
                                      <img
                                        className="cursor-pointer rounded-lg w-full lg:w-[200px] lg:min-h-[220px] lg:max-h-[200px] h-[200px]"
                                        src={imageshow + panel.image}
                                        alt={panel.name}
                                      />
                                    </div>
                                  ) : (
                                    <img
                                      className="cursor-pointer w-full lg:w-[200px] min-h-[250px] max-h-[200px]"
                                      src={NoImage}
                                      alt="No Image"
                                    />
                                  )}
                                </div>
                                <div className="text-left p-4 bg-white leading-4">
                                  <div className="mr-2">
                                    <div className="text-green-800 leading-6 font-medium py-2 text-md">
                                      {panel.name}
                                    </div>
                                    <div className="flex gap-2 mt-2 items-center">
                                      <div>Sector: {panel.address}</div>
                                    </div>
                                    <div className="flex gap-2 mt-2 items-center">
                                      <div>{panel.property_type}</div>
                                    </div>
                                    <div className="flex gap-2 mt-1 items-center">
                                      <div>
                                        {panel.sector && (
                                          <div className="flex gap-2">
                                            <div className="font-semibold text-green-800">
                                              Sector:
                                            </div>
                                            <div>{panel.sector}</div>
                                          </div>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                          {panel.property_status && (
                                            <div className="bg-slate-200 w-full rounded-md flex leading-3 gap-1 p-2">
                                              <img
                                                className="h-10 w-5"
                                                src={Bed}
                                                alt="Bed"
                                              />
                                              <div>
                                                <div className="leading-4 text-[12px]">
                                                  FURNISHING
                                                </div>
                                                <div className="text-md w-full text-[10px] font-bold mr-1 leading-5 text-green-800">
                                                  {panel.property_status}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex gap-2">
                                          {panel.bathrooms && (
                                            <div className="mt-4">
                                              <div className="bg-slate-200 p-2 w-14 rounded-md gap-2 flex">
                                                <img
                                                  className="h-5 w-5"
                                                  src={Bath}
                                                  alt="Bath"
                                                />
                                                <div>{panel.bathrooms}</div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex gap-10 mt-4 items-center">
                                          <div className="flex items-center gap-2">
                                            <div>Like</div>
                                            <div>
                                              {like ? (
                                                <svg
                                                  className="h-4 w-4"
                                                  fill="red"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  viewBox="0 0 512 512"
                                                  onClick={disLikeContainer}
                                                >
                                                  <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                                </svg>
                                              ) : (
                                                <svg
                                                  className="h-4 w-4"
                                                  fill="green"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  viewBox="0 0 512 512"
                                                  onClick={() =>
                                                    Navigate("/login")
                                                  }
                                                >
                                                  <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                                                </svg>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            <div>Share</div>
                                            <WhatsappShareButton url={shareUrl}>
                                              <svg
                                                fill="green"
                                                className="h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                              >
                                                <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-14.4-9.8-19.5-22.2-17.2C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
                                              </svg>
                                            </WhatsappShareButton>
                                          </div>
                                          {panel.verified === "Yes" && (
                                            <div className="rounded-md gap-2 flex items-center">
                                              <div>Verified</div>
                                              <img
                                                className="h-6 w-10"
                                                src={Varified}
                                                alt="Verified"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="lg:w-1/3 bg-green-100 p-2">
                                  <div className="mt-4">
                                    <div className="flex lg:items-center justify-center">
                                      <svg
                                        fill="black"
                                        className="w-4 h-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 320 512"
                                      >
                                        <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                      </svg>
                                      <div className="font-bold lg:text-xl text-md">
                                        {formatBudget(panel.budget)}
                                      </div>
                                    </div>
                                    {panel.security_deposit && (
                                      <div className="flex items-center justify-center gap-2">
                                        <div className="font-bold text-center">
                                          Security Deposit
                                        </div>
                                        <div>{panel.security_deposit}</div>
                                      </div>
                                    )}
                                    <div className="flex justify-center items-center">
                                      <button
                                        onClick={() => setModalIsOpen(true)}
                                        className="bg-red-600 p-1 mt-2 px-2 text-white rounded-md mb-2"
                                      >
                                        Book Now!
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        {newData.filter(filterPanelsByBudget).length > showCount && (
                          <div className="flex justify-center mt-4">
                            <button
                              onClick={() => setShowCount(showCount + 8)} // Increment by 8
                              className="font-bold p-2 w-52 rounded-md text-white bg-red-600"
                            >
                              Load More
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-center mt-24 mb-24 font-bold text-lg text-red-600">
                        No Data Match
                      </p>
                    ))}
                </div>
              ) : (
                <div className="min-h-[350px] grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8 w-full mt-8 items-start">
                  {newData &&
                    Array.isArray(newData) &&
                    newData.length > 0 &&
                    (newData.filter(filterPanelsByBudget).length > 0 ? (
                      <>
                        {newData
                          .filter(filterPanelsByBudget)
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
                            <div
                              onClick={() => {
                                const modifiedPanelName = panel.name
                                  .replace(/\s/g, "-")
                                  .toLowerCase()
                                  .replace(/[^\w\s]/g, "-");
                                Navigate(
                                  `/rentDetails/-${panel.id}-${modifiedPanelName}`
                                );
                                window.scrollTo(0, 0);
                              }}
                              className="cursor-pointer"
                              key={panel.id}
                            >
                              <div className="border rounded-md cursor-pointer hover:scale-110 shadow-lg transition duration-300 ease-in-out">
                                <div className="rent-image-div">
                                  {panel.image ? (
                                    <div className="flex justify-center gap-6">
                                      <img
                                        className="rounded-t-md cursor-pointer h-52 w-full"
                                        src={imageshow + panel.image}
                                        alt={panel.name}
                                      />
                                    </div>
                                  ) : (
                                    <img
                                      className="cursor-pointer w-full h-52"
                                      src={NoImage}
                                      alt="No Image"
                                    />
                                  )}
                                  <div className="flex items-center gap-2 justify-center text-green-800 leading-6 font-medium text-md rent-inner-heading">
                                    <div>{panel.property_status}</div>
                                  </div>
                                </div>
                                <div className="p-1">
                                  <div className="flex mt-4">
                                    <div className="prize-div flex">
                                      <svg
                                        fill="#14532d"
                                        className="w-5 h-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 320 512"
                                      >
                                        <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                      </svg>
                                      <div>{formatBudget(panel.budget)}</div>
                                    </div>
                                    {panel.budget && (
                                      <div className="px-2"> || </div>
                                    )}
                                    <div className="text-green-800 leading-6 font-medium text-md">
                                      Sector: {panel.sector}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 items-center content-center">
                                    <div>
                                      <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 384 512"
                                        fill="#14532d"
                                      >
                                        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                      </svg>
                                    </div>
                                    <div className="property-address-div">
                                      {panel.address}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-6 font-bold items-center">
                                    <div>{panel.property_type}</div>
                                  </div>
                                  <div className="flex items-center lg:gap-3 gap-3 mt-4">
                                    {panel.bedrooms && (
                                      <div className="flex items-center gap-2">
                                        <img
                                          className="w-6"
                                          src={Bed}
                                          alt="Bed"
                                        />
                                        <div className="font-semibold text-green-800">
                                          {panel.bedrooms}
                                        </div>
                                      </div>
                                    )}
                                    {panel.bathrooms && (
                                      <div className="flex items-center gap-2">
                                        <img
                                          className="w-6"
                                          src={Bath}
                                          alt="Bath"
                                        />
                                        <div className="font-semibold text-green-800">
                                          {panel.bathrooms}
                                        </div>
                                      </div>
                                    )}
                                    {panel.verified === "Yes" && (
                                      <div className="flex gap-2 items-center">
                                        <img
                                          className="w-5"
                                          src={Varified}
                                          alt="Verified"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        {newData.filter(filterPanelsByBudget).length > showCount && (
                          <div className="flex justify-center mt-4 col-span-full">
                            <button
                              onClick={() => setShowCount(showCount + 8)} // Increment by 8
                              className="font-bold p-2 w-52 rounded-md text-white bg-red-600"
                            >
                              Show More
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-center mt-24 mb-24 font-bold text-lg text-red-600 col-span-full">
                        No Data Available
                      </p>
                    ))}
                </div>
              )}
              <div
                onClick={() => Navigate("/")}
                className="cursor-pointer lg:block hidden"
              >
                {/* <img className="shadow-lg lg:w-[400px] p-2" src={Ads} /> */}
              </div>
            </div>
          </div>
        </>
      )}
      <OurServices />
      <Searching />
      <ToastContainer />
      <BottomBar />
    </div>
  );
}