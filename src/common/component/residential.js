import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import Bed from "../../assets/img/bed.png";
import Bath from "../../assets/img/bath.png";
import varifed from "../../assets/img/varified.png";
import { useNavigate, useParams } from "react-router-dom";
import Noimage from "../../assets/img/image-not.jpg";
import AnimatedText from "./HeadingAnimation";
import { liveUrl, token } from "./url";
import OurServices from "./ourServices";
import Searching from "./searching";

export default function Residential() {
  const { our_services } = useParams();
  const navigate = useNavigate();
  const [newData, setNewData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState(8);

  const handleSubmit = async () => {
    setLoader(true);
    setError(null);
    try {
      const response = await fetch(`${liveUrl}api/Services/servicesInnerPages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          innerpagetitle: our_services || "",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const result = Array.isArray(data?.result) ? data.result : [];
      setNewData(result);
      console.log(result, "this is data");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load data. Please try again.");
      setNewData([]);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [our_services]);

  const formatBudget = (value) => {
    if (!value || isNaN(value)) return "N/A";
    const formattedValue = Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(2)} Lac`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} Thousand`;
    }
    return formattedValue;
  };

  // Logic to determine if sqft should be displayed
  const getDisplayArea = (panel) => {
    if (panel.sqft && Number(panel.sqft) > 0) {
      return { value: panel.sqft, unit: panel.measureUnit || "sqft" };
    }
    return null; // Return null if sqft is 0 or not available
  };

  // Load more items
  const loadMore = () => {
    setVisibleItems((prev) => prev + 8);
  };

  return (
    <>
      <Navbar />
      <div className="px-4 py-6 container mx-auto">
        {loader ? (
          <div className="flex justify-center items-center p-4">
            <svg
              className="animate-spin h-10 w-10 mt-4 mb-4 text-green-900"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold">{error}</div>
        ) : (
          <>
            <div className="text-2xl lg:text-3xl font-bold text-green-900 text-center mt-4">
              <AnimatedText text={our_services || "Properties"} />
            </div>
            {newData.length === 0 ? (
              <div className="text-center text-gray-600 mt-4">
                No properties found.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 justify-items-center">
                  {newData.slice(0, visibleItems).map((panel, index) => {
                    const displayArea = getDisplayArea(panel);
                    return (
                      <div
                        key={panel.id || index}
                        onClick={() => {
                          const modifiedPanelName = panel.name
                            ?.replace(/\s/g, "")
                            ?.toLowerCase() || "";
                          navigate(`/property/-${panel.id}-${modifiedPanelName}`);
                        }}
                        className="cursor-pointer shadow-lg border-2 border-dotted border-green-600 rounded-md w-full max-w-sm m-2 sm:m-3 md:m-4"
                      >
                        <div className="relative">
                          <div className="flex items-center bg-green-900 text-white px-2 py-2 absolute bottom-0 left-0 font-bold text-sm lg:text-base">
                            <svg
                              className="w-5 h-5 mr-1"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 320 512"
                            >
                              <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                            </svg>
                            {formatBudget(panel.budget)}
                            {displayArea && (
                              <> / sqft: {displayArea.value} {displayArea.unit}</>
                            )}
                          </div>
                          {panel.image_one?.length > 0 ? (
                            <img
                              className="rounded-t-md h-64 w-full object-cover"
                              src={`${panel.url}${panel.image_one}`}
                              alt={panel.name || `Property ${index + 1}`}
                            />
                          ) : (
                            <img
                              className="rounded-t-md h-64 w-full object-cover"
                              src={Noimage}
                              alt={panel.name || `Property ${index + 1}`}
                            />
                          )}
                        </div>
                        <div className="text-left bg-white rounded-b-md p-3">
                          <div className="text-base text-green-800 font-bold">
                            {panel.name || "Unnamed Property"}
                          </div>
                          <div className="text-lg font-light">
                            {panel.services || "N/A"}
                          </div>
                          <div className="font-semibold text-sm mt-1">
                            {panel.address || "No address provided"}
                          </div>
                          <div className="font-light mt-2">
                            {panel.property_type || "N/A"}
                          </div>
                          <div className="flex items-center gap-3 mt-4">
                            {panel.bedrooms > 0 && (
                              <div className="flex items-center gap-2">
                                <img className="w-6 h-6" src={Bed} alt="Bedrooms" />
                                <div className="font-bold">{panel.bedrooms}</div>
                              </div>
                            )}
                            {panel.bathrooms > 0 && (
                              <div className="flex items-center gap-2">
                                <img className="w-6 h-6" src={Bath} alt="Bathrooms" />
                                <div className="font-bold">{panel.bathrooms}</div>
                              </div>
                            )}
                            {panel.varifed && (
                              <div className="flex items-center gap-2">
                                <img className="w-5 h-5" src={varifed} alt="Verified" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {newData.length > visibleItems && (
                  <div className="text-center mt-6">
                    <button
                      onClick={loadMore}
                      className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold "
                    >
                      Show More
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}