/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import Navbar from "../common/component/navbar";
import { Link, useParams, useLocation } from "react-router-dom";
import { liveUrl, token } from "../common/component/url";
import OurServices from "../common/component/ourServices";
import BottomBar from "../common/component/bottomBar";
import Searching from "../common/component/searching";
import "../Css/SingleProperty.css";
import PlotImage from "../../src/assets/img/Plot.jpg";
import RectangleImage from "../../src/assets/img/kothi-image2.jpg";
import NoImage from "../../src/assets/img/image-not.jpg";

const SingleProperty = () => {
  const { id } = useParams();
  const location = useLocation();
  const { imageUrl: passedImageUrl } = location.state || {}; // Get the imageUrl passed from GalleryComponent
  const [singleDetail, setSingleDetail] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getImageUrl = (item) => {
    const propertyType = item.type || item.property_type || "Unknown";
    const baseUrl = liveUrl; // Replace with actual base URL if needed

    console.log(
      `SingleProperty - Checking image for Property ID: ${item.id}, Type: ${propertyType}, Image_URLs:`,
      item.Image_URLs,
      `Passed Image URL:`,
      passedImageUrl
    );

    // First, check if we have a passed image URL from GalleryComponent
    if (passedImageUrl) {
      console.log(`Using passed image URL from GalleryComponent: ${passedImageUrl}`);
      return passedImageUrl;
    }

    // If no passed image URL, try to use Image_URLs from the API
    if (item.Image_URLs) {
      if (typeof item.Image_URLs === "string" && item.Image_URLs.trim() !== "") {
        const imageUrl = item.Image_URLs.startsWith("http")
          ? item.Image_URLs
          : `${baseUrl}${item.Image_URLs}`;
        console.log(`Using Image_URLs string: ${imageUrl}`);
        return imageUrl;
      }
      if (Array.isArray(item.Image_URLs) && item.Image_URLs.length > 0) {
        const imageUrl = item.Image_URLs[0].startsWith("http")
          ? item.Image_URLs[0]
          : `${baseUrl}${item.Image_URLs[0]}`;
        console.log(`Using Image_URLs array first item: ${imageUrl}`);
        return imageUrl;
      }
    }

    // Fallback to default image based on property type
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
        <div className="flex justify-center align-items-center p-2">
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
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 cursor-pointer text-green-800"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                            fill="currentColor"
                          >
                            <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                          </svg>
                          <div className="font-bold text-lg sm:text-xl ml-2">
                            {formatBudget(item.budget)}
                          </div>
                        </div>
                        {item.sqft && (
                          <div className="font-semibold text-sm sm:text-lg ml-2">
                            | {item.sqft}
                          </div>
                        )}
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
                  <div className="text-green-800 font-bold ml-2 mb-4 underline text-lg sm:text-xl">
                    {item.name}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-2">
                    <div>
                      <div className="flex w-full max-w-md relative rounded-md items-center">
                        <div className="sale-image-div">
                          <img
                            className="rounded-t-md cursor-pointer h-52 w-full object-cover"
                            src={getImageUrl(item)}
                            alt={`${(item.type || item.property_type || "Property")} Image`}
                            onError={(e) => handleImageError(e, item)}
                            onLoad={() =>
                              console.log(
                                `SingleProperty - Image loaded successfully for Property ID: ${item.id}`
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1">
                      <div className="leading-1">
                        <div className="flex items-center">
                          <div className="text-lg ml-2 font-leading text-green-800">
                            {item.type || item.property_type || "Property"}
                          </div>
                        </div>
                        <div className="font-bold leading-5 mt-4">
                          Amenities:
                        </div>
                        <div className="flex gap-2 mt-2 pb-8">
                          <div className="grid grid-cols-1 sm:grid-cols-2">
                            <div className="flex items-center gap-1">
                              <svg
                                fill="green"
                                className="w-2 h-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
                              </svg>
                              <div className="text-sm">
                                {item.amenities || "No amenities listed"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <button>
                            <Link
                              to="/contact"
                              className="bg-red-600 p-2 mt-4 ml-2 text-white font-bold rounded-md hover:bg-red-700 transition"
                            >
                              Contact Owner
                            </Link>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="address">
                      <div className="p-4 border rounded-md">
                        <div>
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <div className="font-semibold">Address:</div>
                              <div className="font-normal">{item.address}</div>
                            </div>
                            {item.sqft && (
                              <div className="flex gap-2">
                                <div className="font-semibold">Area:</div>
                                <div className="font-normal">{item.sqft}</div>
                              </div>
                            )}
                          </div>
                        </div>
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