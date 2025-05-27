import React, { useEffect, useState } from "react";
import Navbar from "../common/component/navbar";
import { Link, useParams } from "react-router-dom";
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
  const [singleDetail, setSingleDetail] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
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
        setSingleDetail(data.result);
        console.log("single-all-properties response:", data.result);
      })
      .catch((error) =>
        console.error("Error fetching project details:", error)
      );
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

  // Function to get the appropriate image URL
  const getImageUrl = (item) => {
    // Check if Image_URLs exists and has valid data
    if (item.Image_URLs) {
      // If Image_URLs is a string and not empty
      if (typeof item.Image_URLs === "string" && item.Image_URLs.trim() !== "") {
        return item.Image_URLs;
      }
      // If Image_URLs is an array and has items
      if (Array.isArray(item.Image_URLs) && item.Image_URLs.length > 0) {
        return item.Image_URLs[0];
      }
    }
    
    // Return fallback image based on property type
    if (item.type === "Flat") {
      return NoImage;
    } else if (item.type === "Plot") {
      return PlotImage;
    } else if (item.type === "Kothi" || item.type === "House") {
      return RectangleImage;
    } else {
      return NoImage; // Default fallback
    }
  };

  // Function to handle image error
  const handleImageError = (e, item) => {
    console.log(`Image failed to load for Property ID: ${item.id}, Type: ${item.type}`);
    
    // Set fallback image based on property type
    if (item.type === "Flat") {
      e.target.src = NoImage;
    } else if (item.type === "Plot") {
      e.target.src = PlotImage;
    } else if (item.type === "Kothi" || item.type === "House") {
      e.target.src = RectangleImage;
    } else {
      e.target.src = NoImage;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 rounded-md border gap-4">
          <div className="px-2">
            {singleDetail.map((item) => {
              console.log(
                `Property ID: ${item.id}, property_type: ${
                  item.type
                }, Image_URLs: ${JSON.stringify(item.Image_URLs)}`
              );
              return (
                <div key={item.id} className="mb-10">
                  <div className="px-2 py-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 cursor-pointer text-green-800"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                          >
                            <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                          </svg>
                          <div className="font-bold text-lg sm:text-xl ml-2">
                            {formatBudget(item.budget)}
                          </div>
                        </div>
                        {item.sqft ? (
                          <div className="font-semibold text-sm sm:text-lg ml-2">
                            {" "}
                            | {item.sqft}
                          </div>
                        ) : null}
                      </div>
                      <Link to="/">
                        <div className="p-1 rounded-md h-10 w-10 bg-red-600 flex justify-center items-center">
                          <svg
                            fill="white"
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                          >
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                          </svg>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="text-green-800 font-bold ml-2 mb-4 underline text-lg sm:text-xl">
                    {item.name}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-2">
                    {/* Image Section - Fixed image logic */}
                    <div>
                      <div className="flex w-full max-w-md relative rounded-md items-center">
                        <div className="sale-image-div">
                          <img
                            className="rounded-t-md cursor-pointer h-52 w-full"
                            src={getImageUrl(item)}
                            alt={`${item.type} Property Image`}
                            onError={(e) => handleImageError(e, item)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Property Details Section */}
                    <div className="grid grid-cols-1">
                      <div className="leading-1">
                        <div className="flex items-center">
                          <div className="text-lg ml-2 font-leading text-green-800">
                            {item.property_type || item.type}
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
                    
                    {/* Address Section */}
                    <div className="address">
                      <div className="p-4 border rounded-md">
                        <div>
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <div className="font-semibold">Address:</div>
                              <div className="font-normal">{item.address}</div>
                            </div>
                            {item.sqft ? (
                              <div className="flex gap-2">
                                <div className="font-semibold">Area:</div>
                                <div className="font-normal">{item.sqft}</div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
};

export default SingleProperty;