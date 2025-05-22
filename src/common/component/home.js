import React, { useState, useEffect } from "react";
import GalleryComponent from "./galleryComponent";
import AnimatedText from "./HeadingAnimation";
import { liveUrl, token } from "./url";

export default function Home() {
  const [searchParams, setSearchParams] = useState({
    category: "All",
    searchText: "",
    propertyType: "rent"
  });
  
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // Call API when component mounts
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Using the correct API endpoint based on property type
      let apiUrl = '';
      if (searchParams.propertyType === 'rent') {
        apiUrl = `${liveUrl}rent-search/?keyword=&sort_by=desc`;
      } else if (searchParams.propertyType === 'buy') {
        apiUrl = `${liveUrl}sale-search/?keyword=&sort_by=desc`;
      } else {
        // Default to rent
        apiUrl = `${liveUrl}rent-search/?keyword=&sort_by=desc`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // If token is needed
        }
      });
      
      const data = await response.json();
      
      if (data.result) {
        setAllProperties(data.result);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch properties when property type changes
  useEffect(() => {
    fetchProperties();
  }, [searchParams.propertyType]);

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Construct API URL based on search parameters
      let apiUrl = '';
      const keyword = searchParams.searchText.trim();
      
      if (searchParams.propertyType === 'rent') {
        apiUrl = `${liveUrl}rent-search/?keyword=${encodeURIComponent(keyword)}&sort_by=desc`;
      } else if (searchParams.propertyType === 'buy') {
        apiUrl = `${liveUrl}sale-search/?keyword=${encodeURIComponent(keyword)}&sort_by=desc`;
      } else {
        apiUrl = `${liveUrl}rent-search/?keyword=${encodeURIComponent(keyword)}&sort_by=desc`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // If token is needed
        }
      });
      
      const data = await response.json();
      let filteredProperties = data.result || [];

      // Additional client-side filtering by category
      if (searchParams.category && searchParams.category !== "All") {
        if (searchParams.category === "Residential") {
          filteredProperties = filteredProperties.filter(property => 
            property.property_type?.toLowerCase().includes('bhk') ||
            property.property_type?.toLowerCase().includes('apartment') ||
            property.property_type?.toLowerCase().includes('flat') ||
            property.property_type?.toLowerCase().includes('residential')
          );
        } else if (searchParams.category === "Commercial") {
          filteredProperties = filteredProperties.filter(property => 
            property.property_type?.toLowerCase().includes('commercial') ||
            property.property_type?.toLowerCase().includes('office') ||
            property.property_type?.toLowerCase().includes('shop') ||
            property.property_type?.toLowerCase().includes('showroom')
          );
        }
      }

      // If no search text provided, get all properties
      if (!keyword) {
        // Get all properties based on type
        let allApiUrl = '';
        if (searchParams.propertyType === 'rent') {
          allApiUrl = `${liveUrl}api//Reactjs/gallery`; // For rent properties
        } else {
          allApiUrl = `${liveUrl}api//Reactjs/gallery`; // For sale properties
        }

        const allResponse = await fetch(allApiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const allData = await allResponse.json();
        filteredProperties = allData.result || [];
      }

      // Store search results and parameters in localStorage
      const searchResultsData = {
        properties: filteredProperties,
        searchParams: searchParams,
        imgUrl: data.imgUrl || "https://bestpropertiesmohali.com/assets/properties/",
        searchPerformed: true,
        searchKeyword: keyword
      };
      
      localStorage.setItem('searchResults', JSON.stringify(searchResultsData));
      
      // Navigate to appropriate property page based on type
      if (searchParams.propertyType === 'rent') {
        window.location.href = '/for-rent';
      } else {
        window.location.href = '/for-sale';
      }
      
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get unique property types for filter options
  const getPropertyTypes = () => {
    const types = [...new Set(allProperties.map(prop => prop.property_type))];
    return types.filter(type => type && type.trim() !== '');
  };

  // Get unique amenities for filter options
  const getAmenities = () => {
    const allAmenities = allProperties.flatMap(prop => 
      prop.amenities ? prop.amenities.split('~-~').filter(amenity => amenity.trim() !== '') : []
    );
    return [...new Set(allAmenities)];
  };

  return (
    <div className="">
      <div className="container px-6 mx-auto mt-5">
        {/* Search bar UI */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          {/* Tab Navigation */}
          <div className="flex space-x-4 border-b border-gray-200 pb-2 mb-4">
            <button 
              className={`font-semibold px-2 py-1 border-b-2 transition-colors ${
                searchParams.propertyType === 'buy' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-600 border-transparent hover:text-blue-600'
              }`}
              onClick={() => handleInputChange('propertyType', 'buy')}
            >
              Buy
            </button>
            <button 
              className={`font-semibold px-2 py-1 border-b-2 transition-colors ${
                searchParams.propertyType === 'rent' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-600 border-transparent hover:text-blue-600'
              }`}
              onClick={() => handleInputChange('propertyType', 'rent')}
            >
              Rent
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mt-4 space-x-3">
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchParams.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
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
                onChange={(e) => handleInputChange('searchText', e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Property Type and Amenities Filters (Dynamic from API data) */}
        {allProperties.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Types */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Available Property Types</h3>
                <div className="space-y-2">
                  {getPropertyTypes().slice(0, 6).map((type, index) => (
                    <label key={index} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-gray-700">{type}</span>
                    </label>
                  ))}
                  {getPropertyTypes().length > 6 && (
                    <button className="text-blue-600 text-sm hover:underline">Show More</button>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Available Amenities</h3>
                <div className="space-y-2">
                  {getAmenities().slice(0, 6).map((amenity, index) => (
                    <label key={index} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-gray-700">{amenity}</span>
                    </label>
                  ))}
                  {getAmenities().length > 6 && (
                    <button className="text-blue-600 text-sm hover:underline">Show More</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading properties...</p>
          </div>
        )}

        {/* Results Summary */}
        {!loading && allProperties.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-600">
              Found {allProperties.length} properties for {searchParams.propertyType}
            </p>
          </div>
        )}

        {/* Existing content */}
        <div className="">
          <section className="">
            <div className="flex justify-center items-center">
              {/* You can add AnimatedText component here if needed */}
              {/* <AnimatedText /> */}
            </div>
            
            <GalleryComponent />
          </section>
        </div>
      </div>
    </div>
  );
}