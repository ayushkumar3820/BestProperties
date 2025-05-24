import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GalleryComponent from "./galleryComponent";
import AnimatedText from "./HeadingAnimation";
import { liveUrl, token } from "./url"; // Assuming these are defined

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    searchText: "",
    propertyType: "",
  });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loader, setLoader] = useState(false);

  // Fetch property types from API
  useEffect(() => {
    setLoader(true);
    fetch(`${liveUrl}property-property-type`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPropertyTypes(data.result || []);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching property types:", error);
        setLoader(false);
      });
  }, []);

  const handleInputChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchParams.searchText.trim()) {
      queryParams.append("keyword", searchParams.searchText.trim());
    }
    if (searchParams.propertyType) {
      queryParams.append("propertyType", searchParams.propertyType);
    }
    navigate(`/property?${queryParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const isSearchDisabled = !searchParams.searchText.trim() && !searchParams.propertyType;

  return (
    <div className="">
      {loader ? (
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
      ) : (
        <>
          <div className="flex justify-center items-center">
            <AnimatedText text="Find Your Dream Property" />
          </div>
          <div className="container px-6 mx-auto mt-5">
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
              <div className="flex items-center mt-4 space-x-3">
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.propertyType}
                  onChange={(e) => handleInputChange("propertyType", e.target.value)}
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Search property name, address, sector, or BHK type..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchParams.searchText}
                    onChange={(e) => handleInputChange("searchText", e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>
                <button
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    isSearchDisabled
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  onClick={handleSearch}
                  disabled={isSearchDisabled}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="">
              <section className="">
                <GalleryComponent properties={[]} selectedPropertyType={searchParams.propertyType} />
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}