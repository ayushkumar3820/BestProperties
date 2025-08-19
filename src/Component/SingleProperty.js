import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Navbar from "../common/component/navbar";
import OurServices from "../common/component/ourServices";
import BottomBar from "../common/component/bottomBar";
import Searching from "../common/component/searching";
import { liveUrl, token } from "../common/component/url";
import PlotImage from "../../src/assets/img/Plot.jpg";
import RectangleImage from "../../src/assets/img/kothi-image2.jpg";
import NoImage from "../../src/assets/img/image-not.jpg";

const SingleProperty = () => {
  const { id } = useParams();
  const location = useLocation();
  const { imageUrl: passedImageUrl } = location.state || {};
  const [singleDetail, setSingleDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    fetch(`${liveUrl}single-all-properties`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pid: id }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch property details");
        return response.json();
      })
      .then((data) => {
        const normalizedData = data.result.map((item) => ({
          ...item,
          type: item.property_type || item.type || "Unknown",
          Image_URLs: Array.isArray(item.Image_URLs)
            ? item.Image_URLs
            : item.Image_URLs
            ? [item.Image_URLs]
            : [],
          amenities: Array.isArray(item.amenities)
            ? item.amenities.join(", ")
            : item.amenities || "No amenities listed",
          sqft: item.sqft ? parseFloat(item.sqft) : null,
          sqyd: item.sqft
            ? (parseFloat(item.sqft) * 0.111111).toFixed(2)
            : null,
        }));
        setSingleDetail(normalizedData);
        setMainImage(passedImageUrl || normalizedData[0]?.Image_URLs[0]);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id, passedImageUrl]);

  const formatBudget = (value, budgetInWords = null) => {
    // If budget_in_words is available and budget is a small number or string, use budget_in_words
    if (
      budgetInWords &&
      budgetInWords.trim() !== "" &&
      (isNaN(value) || value < 1000)
    ) {
      return budgetInWords;
    }

    // Convert string to number if needed
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    // If conversion failed or value is invalid, use budget_in_words if available
    if (isNaN(numericValue) || numericValue <= 0) {
      return budgetInWords && budgetInWords.trim() !== ""
        ? budgetInWords
        : "Price on Request";
    }

    // Format numeric values
    if (numericValue >= 10000000) {
      return (
        (numericValue / 10000000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " Cr"
      );
    } else if (numericValue >= 100000) {
      return (
        (numericValue / 100000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " Lac"
      );
    } else if (numericValue >= 1000) {
      return (
        (numericValue / 1000).toLocaleString(undefined, {
          minimumFractionDigits: 0,
        }) + "K"
      );
    } else {
      return numericValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  const getImageUrl = (image, item) => {
    const propertyType = item.type?.toLowerCase() || "unknown";
    const baseUrl = liveUrl;

    if (image) {
      return image.startsWith("http") ? image : `${baseUrl}${image}`;
    }

    if (propertyType === "flat") return NoImage;
    if (propertyType === "plot") return PlotImage;
    if (["kothi", "house", "individual house/home"].includes(propertyType))
      return RectangleImage;
    return NoImage;
  };

  const handleImageError = (e, item) => {
    const propertyType = item.type?.toLowerCase() || "unknown";
    if (propertyType === "flat") e.target.src = NoImage;
    else if (propertyType === "plot") e.target.src = PlotImage;
    else if (["kothi", "house", "individual house/home"].includes(propertyType))
      e.target.src = RectangleImage;
    else e.target.src = NoImage;
    e.target.onerror = null;
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="flex justify-center items-center p-4">
          <svg
            className="animate-spin h-10 w-10 text-green-800"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
          >
            <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
          </svg>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-8 text-center text-red-600">
          Error: {error}
        </div>
      ) : singleDetail.length === 0 ? (
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          No property details available.
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          {singleDetail.map((item) => (
            <div key={item.id} className="mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side: Image and Thumbnails */}
                <div className="flex flex-col gap-4">
                  <img
                    className="w-full h-80 object-cover rounded-lg shadow-md"
                    src={getImageUrl(mainImage, item)}
                    alt={`${item.type || "Property"} main view`}
                    onError={(e) => handleImageError(e, item)}
                  />
                  {item.Image_URLs?.length > 1 && (
                    <div className="flex gap-2 justify-center flex-wrap">
                      {item.Image_URLs.map((img, index) => (
                        <img
                          key={index}
                          className={`h-16 w-16 object-cover rounded-md border-2 cursor-pointer hover:border-green-500 transition ${
                            mainImage === img
                              ? "border-green-500"
                              : "border-gray-300"
                          }`}
                          src={getImageUrl(img, item)}
                          alt={`${item.type || "Property"} thumbnail ${
                            index + 1
                          }`}
                          onClick={() => setMainImage(img)}
                          onError={(e) => handleImageError(e, item)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {/* Right Side: Property Details and Amenities */}
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-2xl text-green-800">
                      ₹{formatBudget(item.budget, item.budget_in_words)}
                    </div>

                    <Link to="/" aria-label="Close property details">
                      <div className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition">
                        <svg
                          className="h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                          fill="currentColor"
                        >
                          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                  <div className="text-green-800 font-bold text-xl">
                    {item.name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {item.type} - {item.city}
                  </div>
                  <div>
                    <Link to="/contact">
                      <button className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition focus:outline-none">
                        Contact Us
                      </button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Property Details */}
                    <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                      <div className="font-bold text-lg text-green-800 mb-3">
                        Property Details
                      </div>
                      <div
                        className={`space-y-2  ? "max-h-48 overflow-hidden" : ""}`}
                      >
                        {item.address && (
                          <div>
                            <span className="font-semibold">Address:</span>{" "}
                            {item.address}
                          </div>
                        )}
                        {item.property_for && (
                          <div>
                            <span className="font-semibold">Property For:</span>{" "}
                            {item.property_for}
                          </div>
                        )}
                        {item.sqft && (
                          <div>
                            <span className="font-semibold">Built Area:</span>{" "}
                            {item.sqft} sq.ft ({item.sqyd} sq.yd)
                          </div>
                        )}
                        {item.bhk && (
                          <div>
                            <span className="font-semibold">BHK:</span>{" "}
                            {item.bhk}
                          </div>
                        )}
                        {item.property_type && (
                          <div>
                            <span className="font-semibold">Type:</span>{" "}
                            {item.property_type}
                          </div>
                        )}

                        {item.furnishing && (
                          <div>
                            <span className="font-semibold">Furnishing:</span>{" "}
                            {item.furnishing}
                          </div>
                        )}
                        {item.facing && (
                          <div>
                            <span className="font-semibold">Facing:</span>{" "}
                            {item.facing}
                          </div>
                        )}
                        {item.floor && (
                          <div>
                            <span className="font-semibold">Floor:</span>{" "}
                            {item.floor}
                          </div>
                        )}
                        {item.description && (
                          <div>
                            <span className="font-semibold">Description:</span>{" "}
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Amenities */}
                    {item.amenities && (
                      <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                        <div className="font-bold text-lg text-green-800 mb-3">
                          Amenities
                        </div>
                        <div className="space-y-1">
                          {item.amenities.split(", ").map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <svg
                                className="w-3 h-3 text-green-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                fill="currentColor"
                              >
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
                              </svg>
                              <span className="text-sm text-gray-700">
                                {amenity.trim()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
};

export default SingleProperty;
