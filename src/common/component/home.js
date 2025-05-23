import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GalleryComponent from "./galleryComponent";
import AnimatedText from "./HeadingAnimation";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    category: "All",
    searchText: "",
    propertyType: "buy",
  });

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
    if (searchParams.category && searchParams.category !== "All") {
      queryParams.append("category", searchParams.category);
    }
    queryParams.append("propertyType", searchParams.propertyType);
    navigate(`/property?${queryParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Determine if the search button should be disabled
  const isSearchDisabled = !searchParams.searchText.trim();

  return (
    <div className="">
      <div className="flex justify-center items-center">
              <AnimatedText text="Find Your Dream Property" />
            </div>
      <div className="container px-6 mx-auto mt-5">
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex items-center mt-4 space-x-3">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchParams.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
            >
              <option value="All">All</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Others">Others</option>
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
            <GalleryComponent properties={[]} />
          </section>
        </div>
      </div>
    </div>
  );
} 