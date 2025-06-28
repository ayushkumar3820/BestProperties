/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Navbar from "../common/component/navbar";
import OurServices from "../common/component/ourServices";
import BottomBar from "../common/component/bottomBar";
import Searching from "../common/component/searching";
import { liveUrl, token } from "../common/component/url";
import "../Css/SingleProperty.css";
import PlotImage from "../../src/assets/img/Plot.jpg";
import RectangleImage from "../../src/assets/img/kothi-image2.jpg";
import NoImage from "../../src/assets/img/image-not.jpg";

const SingleProperty = () => {
  const { id } = useParams();
  const location = useLocation();
  const { imageUrl: passedImageUrl } = location.state || {};
  const [singleDetail, setSingleDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllDetails, setShowAllDetails] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${liveUrl}single-all-properties`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pid: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("single-all-properties full response:", data);
        const normalizedData = data.result.map((item) => ({
          ...item,
          type: item.property_type || item.type || "Unknown",
          Image_URLs: item.Image_URLs || item.image_one || null,
          amenities: Array.isArray(item.amenities) ? item.amenities.join(", ") : item.amenities || "No amenities listed",
        }));
        console.log("Normalized singleDetail data:", normalizedData);
        setSingleDetail(normalizedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching project details:", error);
        setLoading(false);
      });
  }, [id]);

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
        (value / 1000).toLocaleString(undefined, { minimumFractionDigits: 2 }) +
        " K"
      );
    } else {
      return formattedValue;
    }
  };

  const getImageUrl = (item, index = 0) => {
    const propertyType = item.type || item.property_type || "Unknown";
    const baseUrl = liveUrl;

    console.log(
      `SingleProperty - Checking image for Property ID: ${item.id}, Type: ${propertyType}, Image_URLs:`,
      item.Image_URLs,
      `Passed Image URL:`,
      passedImageUrl
    );

    if (passedImageUrl && index === 0) {
      console.log(`Using passed image URL from GalleryComponent: ${passedImageUrl}`);
      return passedImageUrl;
    }

    if (item.Image_URLs) {
      if (Array.isArray(item.Image_URLs) && item.Image_URLs.length > index) {
        const imageUrl = item.Image_URLs[index].startsWith("http")
          ? item.Image_URLs[index]
          : `${baseUrl}${item.Image_URLs[index]}`;
        console.log(`Using Image_URLs array item ${index}: ${imageUrl}`);
        return imageUrl;
      } else if (typeof item.Image_URLs === "string" && item.Image_URLs.trim() !== "") {
        const imageUrl = item.Image_URLs.startsWith("http")
          ? item.Image_URLs
          : `${baseUrl}${item.Image_URLs}`;
        console.log(`Using Image_URLs string: ${imageUrl}`);
        return imageUrl;
      }
    }

    console.log(`Using fallback image for type: ${propertyType}`);
    if (propertyType.toLowerCase() === "flat") {
      return NoImage;
    } else if (propertyType.toLowerCase() === "plot") {
      return PlotImage;
    } else if (propertyType.toLowerCase() === "kothi" || propertyType.toLowerCase() === "house" || propertyType.toLowerCase() === "individual house/home") {
      return RectangleImage;
    } else {
      return NoImage;
    }
  };

  const handleImageError = (e, item) => {
    const propertyType = item.type || item.property_type || "Unknown";
    console.log(
      `SingleProperty - Image failed to load for Property ID: ${item.id}, Type: ${propertyType}`
    );

    if (propertyType.toLowerCase() === "flat") {
      e.target.src = NoImage;
    } else if (propertyType.toLowerCase() === "plot") {
      e.target.src = PlotImage;
    } else if (propertyType.toLowerCase() === "kothi" || propertyType.toLowerCase() === "house" || propertyType.toLowerCase() === "individual house/home") {
      e.target.src = RectangleImage;
    } else {
      e.target.src = NoImage;
    }
    e.target.onerror = null;
  };

  return (
    <>
      <Navbar />
      {loading ? (
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
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 rounded-md border gap-4">
            <div className="px-2">
              {singleDetail.map((item) => (
                <div key={item.id} className="mb-10">
                  <div className="px-2 py-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center">
                        <div className="font-bold text-lg sm:text-xl">
                          ₹ {formatBudget(item.budget)}
                        </div>
                      </div>
                      <Link to="/">
                        <div className="p-1 rounded-md h-10 w-10 bg-red-600 flex justify-center items-center">
                          <svg
                            fill="white"
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                          >
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c-12.5 12.5-32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                          </svg>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="text-green-800 font-bold text-lg sm:text-xl mb-4">
                    {item.name}
                  </div>
                  <div className="text-gray-600 text-sm mb-2">
                    {item.type} - {item.city}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-2">
                    <div>
                      <div className="relative">
                        <img
                          className="w-full h-52 object-cover rounded-md cursor-pointer"
                          src={getImageUrl(item)}
                          alt={`${item.type || item.property_type || "Property"} Image`}
                          onError={(e) => handleImageError(e, item)}
                          onLoad={() =>
                            console.log(
                              `SingleProperty - Image loaded successfully for Property ID: ${item.id}`
                            )
                          }
                        />
                        {/* <div className="absolute top-0 left-0 bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-br">
                          ID: {item.id}
                        </div> */}
                      </div>
                      <div className="flex gap-2 mt-2 justify-center">
                        {item.Image_URLs && Array.isArray(item.Image_URLs) && item.Image_URLs.length > 1 && item.Image_URLs.slice(1).map((_, index) => (
                          <img
                            key={index + 1}
                            className="h-16 w-16 object-cover border border-gray-300 rounded cursor-pointer hover:border-green-500"
                            src={getImageUrl(item, index + 1)}
                            alt={`${item.type || item.property_type || "Property"} Thumbnail ${index + 1}`}
                            onError={(e) => handleImageError(e, item)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="font-bold text-lg text-green-800 mb-2">
                          Amenities
                        </div>
                        <div className="space-y-1">
                          {item.amenities && item.amenities.split(", ").map((amenity, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <svg
                                fill="green"
                                className="w-2 h-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
                              </svg>
                              <span className="text-sm">{amenity.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition mt-2">
                          <Link to="/contact">Contact Us</Link>
                        </button>
                      </div>
                    </div>
                    <div className="address">
                      <div className="p-4 border rounded-md bg-gray-50">
                        <div className="font-bold text-lg text-green-800 mb-2">
                          Property Details
                        </div>
                        <div className={`space-y-1 ${!showAllDetails ? "max-h-20 overflow-hidden" : ""}`}>
                          {item.address && (
                            <div>
                              <span className="font-semibold">Address:</span>
                              <span className="ml-1">{item.address}</span>
                            </div>
                          )}
                          {item.property_for && (
                            <div>
                              <span className="font-semibold">Property For:</span>
                              <span className="ml-1">{item.property_for}</span>
                            </div>
                          )}
                          {item.built && (
                            <div>
                              <span className="font-semibold">Built Area:</span>
                              <span className="ml-1">{item.built}</span>
                            </div>
                          )}
                          {item.land && (
                            <div>
                              <span className="font-semibold">Land Area:</span>
                              <span className="ml-1">{item.land}</span>
                            </div>
                          )}
                          {item.services && (
                            <div>
                              <span className="font-semibold">Services:</span>
                              <span className="ml-1">{item.services}</span>
                            </div>
                          )}
                          {item.type && (
                            <div>
                              <span className="font-semibold">Type:</span>
                              <span className="ml-1">{item.type}</span>
                            </div>
                          )}
                          {item.status && (
                            <div>
                              <span className="font-semibold">Status:</span>
                              <span className="ml-1">{item.status}</span>
                            </div>
                          )}
                        </div>
                        {(item.address || item.property_for || item.built || item.land || item.services || item.type || item.status) && (
                          <button
                            onClick={() => setShowAllDetails(!showAllDetails)}
                            className="text-green-600 text-sm font-semibold mt-2 hover:underline"
                          >
                            {showAllDetails ? "Show Less" : "Show More"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
};

export default SingleProperty;