/* eslint-disable no-unused-vars */
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
    <div className="min-h-screen">
      <div className="flex justify-center text-center px-4 py-2">
        <h1 className="text-xl sm:text-3xl font-bold text-green-900">
          <AnimatedText text="Find Your Dream Property" />
        </h1>
      </div>
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select
              className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchParams.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
            >
              <option value="All">All</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Others">Others</option>
            </select>
            <div className="relative w-full sm:flex-grow">
              <input
                type="text"
                placeholder="Search property name, address, sector, or BHK type..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchParams.searchText}
                onChange={(e) =>
                  handleInputChange("searchText", e.target.value)
                }
                onKeyPress={handleKeyPress}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
            <button
              className={`w-full sm:w-auto px-4 py-2 rounded-md transition-colors duration-200  text-gray-200  bg-green-600 hover:bg-green-700 cursor-pointer
              }`}
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        <section className="mt-6">
          <GalleryComponent properties={[]} />
        </section>
      </div>
    </div>
  );
}
