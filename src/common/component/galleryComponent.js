/* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import Bed from "../../assets/img/bed.png";
import Bath from "../../assets/img/bath.png";
import NoImage from "../../assets/img/image-not.jpg";
import { liveUrl, token } from "./url";
import Rent from "../../Component/rent";
import AnimatedText from "./HeadingAnimation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PlotImage from "../../assets/img/Plot.jpg";
import RectangleImage from "../../assets/img/kothi-image2.jpg";

export default function GalleryComponent() {
  const navigate = useNavigate();
  const [newData, setNewData] = useState([]);
  const [newRent, setNewRent] = useState([]);
  const [imageshow, setImageShow] = useState("");
  const [showCount, setShowCount] = useState(8);
  const [id, setId] = useState([]);
  const [loader, setLoader] = useState(false);
  const [listProjectData, setlistProjectData] = useState([]);
  const [showRent, setShowRent] = useState(false);
  const [showData, setShowData] = useState("");
  const [properties, setProperties] = useState([]);

  // Function to generate a URL-friendly slug
  const generateSlug = (text, separator = "-") => {
    return text
      ? text
          .toLowerCase()
          .replace(/\s+/g, separator)
          .replace(/[^\w-]+/g, "")
      : "";
  };

  // Define tag arrays
  const kothiTags = [
    "Luxury Kothi",
    "Classic Kothi",
    "Designer Kothi",
    "Premium Kothi",
    "Elite Kothi",
  ];
  const flatTags = ["Modern Flat", "Luxury Flat", "Prime Flat"];
  const plotTags = ["Prime Plot", "Hot Plot Deal", "Investment Plot"];
  const defaultTags = [
    "Property for Sale",
    "Exclusive Property",
    "Prime Property",
  ];

  // Modified function to assign fixed tags based on panel.name
  const getDynamicSaleTag = (propertyType, panelName, index = 0) => {
    propertyType = (propertyType || "").toLowerCase().trim();
    panelName = (panelName || "").toLowerCase().trim();
    console.log(
      `getDynamicSaleTag - Property Type: ${propertyType}, Name: ${panelName}, Index: ${index}`
    );

    // Check panel.name for specific keywords and assign rotating tags
    if (panelName.includes("kothi")) {
      return kothiTags[index % kothiTags.length]; // Rotate through kothi tags
    } else if (
      panelName.includes("plot") ||
      panelName.includes("polt") ||
      panelName.includes("poly")
    ) {
      return plotTags[index % plotTags.length]; // Rotate through plot tags
    } else if (panelName.includes("flat")) {
      return flatTags[index % flatTags.length]; // Rotate through flat tags
    }

    // Fallback to default tag for other cases
    return defaultTags[index % defaultTags.length]; // Rotate through default tags
  };

  const handleShowMore = () => {
    setShowCount(showCount + 8);
  };

  const ref = useRef(null);

  const handleClick = (event) => {
    setId(event.currentTarget.id);
  };

  const handleSubmit = () => {
    setLoader(true);
    fetch(`${liveUrl}property-hot-deals`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("property-hot-deals response:", data.result);
        setNewData(data.result);
        setShowData(data.image_url);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching hot deals:", error);
        setLoader(false);
      });
  };

  const handleRent = () => {
    setLoader(true);
    fetch(`${liveUrl}rent-hot-deals`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("rent-hot-deals response:", data.result);
        setNewRent(data.result);
        setImageShow(data.image_url);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching rent deals:", error);
        setLoader(false);
      });
  };

  useEffect(() => {
    fetch(`${liveUrl}all-projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("all-projects response:", data.result);
        setlistProjectData(data.result);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setLoader(false);
      });

    fetch(`${liveUrl}only-single-properties`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("only-single-properties response:", data.result);
        setProperties(data.result);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setLoader(false);
      });

    handleSubmit();
    handleRent();
  }, []);

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

  const handleProjectClick = (projectId, imageUrl) => {
    navigate(`/single-property/${projectId}`, { state: { imageUrl } });
  };

  const handleProjectClicks = (projectId, imageUrl, Project_Name) => {
    const slug = generateSlug(Project_Name || `project-${projectId}`);
    navigate(`/project-details/${slug}-${projectId}`, {
      state: { imageUrl: imageUrl },
    });
  };

  const customStyles = {
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

  const headingStyle = {
    content: {
      fontFamily: '"Poppins", Sans-serif !important',
      fontSize: "20px !important",
      fontWeight: "bold !important",
    },
  };

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const oneSlider = {
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const PropertySlider = {
    infinite: true,
    speed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const ProjectSlider = {
    infinite: true,
    speed: 1500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          height: "190px",
        },
      },
    ],
  };

  const getPropertyImageUrl = (item) => {
    console.log(
      `GalleryComponent - Property ID: ${item.id}, Type: ${item.type}, Image_URLs:`,
      item.Image_URLs
    );
    if (item.Image_URLs) {
      if (
        typeof item.Image_URLs === "string" &&
        item.Image_URLs.trim() !== ""
      ) {
        return item.Image_URLs;
      }
      if (Array.isArray(item.Image_URLs) && item.Image_URLs.length > 0) {
        return item.Image_URLs[0];
      }
    }

    if (item.type?.toLowerCase() === "flat") {
      return NoImage;
    } else if (item.type?.toLowerCase() === "plot") {
      return PlotImage;
    } else if (
      item.type?.toLowerCase() === "kothi" ||
      item.type?.toLowerCase() === "house"
    ) {
      return RectangleImage;
    } else {
      return NoImage;
    }
  };

  const handlePropertyImageError = (e, item) => {
    console.log(
      `GalleryComponent - Image failed to load for Property ID: ${item.id}, Type: ${item.type}`
    );
    if (item.type?.toLowerCase() === "flat") {
      e.target.src = NoImage;
    } else if (item.type?.toLowerCase() === "plot") {
      e.target.src = PlotImage;
    } else if (
      item.type?.toLowerCase() === "kothi" ||
      item.type?.toLowerCase() === "house"
    ) {
      e.target.src = RectangleImage;
    } else {
      e.target.src = NoImage;
    }
    e.target.onerror = null;
  };

// Function to convert sqft to sq.yards if measureUnit is not already sq.yard
const convertToSquareYards = (sqft, measureUnit) => {
  if (!measureUnit || measureUnit.toLowerCase() !== "sq.yard") {
    const sqYards = sqft * 0.11;
    return `${sqYards.toFixed()} sq.yard`;
  }
  return `${sqft} sq.yard`;
};


  return (
    <div>
      {loader ? (
        <div className="flex justify-center align-items-center p-2">
          <svg
            className="animate-spin h-10 w-10"
            fill="#303030"
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 512 512"
          >
            <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
          </svg>
        </div>
      ) : (
        <>
          {showRent ? (
            <Rent />
          ) : (
            <div>
              <div className="slider-main-div mt-8 gap-6 items-start ">
                <div className="slider-inner-div ">
                  <h2 className="deal-title lg:text-3xl text-2xl font-bold text-start text-green-900 mt-3">
                    <AnimatedText text="HOT DEALS" />
                  </h2>
                  <Slider {...oneSlider}>
                    {newData.slice(0, showCount).map((panel, index) => {
                      const saleTag = getDynamicSaleTag(
                        panel.type,
                        panel.name,
                        index
                      );
                      return (
                        <div
                          key={panel.id}
                          onClick={() => {
                            const modifiedPanelName = panel.name
                              .replace(/\s/g, "-")
                              .replace(/[^\w\s]/g, "")
                              .toLowerCase();
                            navigate(
                              `/property/-${panel.id}-${modifiedPanelName}`
                            );
                          }}
                          className="rent-detail-div p-2"
                        >
                          <div className="border rounded-md cursor-pointer shadow-lg transition duration-300 ease-in-out">
                            <div className="flex justify-center gap-6 rent-image-div">
                              <div className="sale-image-div">
                                {panel.image_one ? (
                                  <img
                                    className="rounded-t-md cursor-pointer h-52 w-full"
                                    alt={panel.name}
                                    src={showData + panel.image_one}
                                  />
                                ) : (
                                  <img
                                    className="rounded-t-md cursor-pointer h-52 w-full"
                                    alt="No Image"
                                    src={NoImage}
                                  />
                                )}
                              </div>
                              <div className="for-sale-div">{saleTag}</div>
                            </div>
                            <div className="border p-2 rent-inner-div">
                              <div className="prperty-heading flex items-center prperty-heading mb-3">
                                {panel.property_name}
                              </div>
                              <div
                                className="property-address mb-3 mt-0 items-center flex"
                                style={{
                                  justifyContent: "space-between",
                                  marginTop: "0",
                                }}
                              >
                                <div className="headingStyle ">
                                  {panel.name && (
                                    <div className="text-sm ml-0 mt-1">
                                      {panel.name}
                                    </div>
                                  )}
                                  <div className="flex items-center">
                                    <svg
                                      fill="#303030"
                                      className="w-5 h-5 "
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      viewBox="0 0 320 512"
                                    >
                                      <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                    </svg>
                                    <div className="flex items-center space-x-2 text-sm lg:text-lg ml-2">
                                      <div className="text-red-900 font-bold">
                                        {formatBudget(panel.budget)}
                                      </div>
                                      {panel.sqft > 0 && (
                                        <div className="text-sm">
                                          | {convertToSquareYards(panel.sqft, panel.measureUnit)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2 mb-3">
                                <svg
                                  className="w-4 h-4 shrink-0 mt-0"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 384 512"
                                  fill="#303030"
                                >
                                  <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                </svg>
                                <div className="text-sm leading-snug">
                                  {panel.address}
                                </div>
                              </div>

                              <div className="flex items-center lg:gap-3 gap-3 mt-1">
                                <div className="flex items-center gap-2">
                                  {panel.bedrooms ? (
                                    <img className="w-6" src={Bed} alt="" />
                                  ) : null}
                                  <div className="font-semibold text-[#303030] inner-rooms-heading">
                                    {panel.bedrooms}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {panel.bathrooms ? (
                                    <img className="w-6" src={Bath} alt="" />
                                  ) : null}
                                  <div className="font-semibold text-[#303030] inner-rooms-heading">
                                    {panel.bathrooms}
                                  </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <img
                                    className="w-5"
                                    src={panel.varifed}
                                    alt=""
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                </div>

                <div className="slider-inner-div">
                  <h2 className="property-title lg:text-3xl text-2xl font-bold text-start text-green-900 mt-3">
                    <AnimatedText text="PROPERTIES" />
                  </h2>
                  <div className="home-single">
                    <Slider {...PropertySlider}>
                      {properties.map((item) => {
                        const imageUrl = getPropertyImageUrl(item);
                        return (
                          <div
                            key={item.id}
                            onClick={() =>
                              handleProjectClick(item.id, imageUrl)
                            }
                            className="rent-detail-div p-2"
                          >
                            <div className="border rounded-md cursor-pointer shadow-lg transition duration-300 ease-in-out">
                              <div className="flex justify-center gap-6 rent-image-div">
                                <div className="sale-image-div">
                                  <img
                                    className="rounded-t-md cursor-pointer h-52 w-full"
                                    src={imageUrl}
                                    alt={`${item.type || "Property"} Image`}
                                    aria-hidden="true"
                                    onError={(e) =>
                                      handlePropertyImageError(e, item)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="border p-2 rent-inner-div">
                                <div className="prperty-heading flex items-center text-[#303030]  prperty-heading mb-3">
                                  {item.name}
                                </div>
                                <div
                                  className="property-address mb-3 mt-0 items-center flex"
                                  style={{
                                    justifyContent: "space-between",
                                    marginTop: "0",
                                  }}
                                >
                                  <div className="headingStyle flex items-center text-red-800 font-bold">
                                    <svg
                                      fill="#303030"
                                      className="w-5 h-5 file-[#303030]"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      viewBox="0 0 320 512"
                                    >
                                      <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                    </svg>
                                   <div className="flex items-center space-x-2 text-sm lg:text-lg ml-2">
                                      <div className="text-red-900 font-bold">
                                        {formatBudget(item.budget)}
                                      </div>
                                      {item.sqft > 0 && (
                                        <div className="text-sm text-[#303030]">
                                          | {convertToSquareYards(item.sqft, item.measureUnit)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2 mb-3">
                                  <svg
                                    className="w-4 h-4 shrink-0 mt-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 384 512"
                                    fill="#303030"
                                  >
                                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                  </svg>
                                  <div className="text-sm leading-snug">
                                    {item.address}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                </div>
              </div>

              <div className="project-rent-div">
                <div className="home-rent-div min-h-[350px] w-full">
                  <h2 className="rent-title lg:text-3xl text-2xl font-bold text-start text-green-900 mt-3">
                    <AnimatedText text="RENT" />
                  </h2>
                  <Slider {...settings}>
                    {newRent.map((rent) => (
                      <div key={rent.id} className="rent-detail-div p-2">
                        <div
                          onClick={() => {
                            const modifiedPanelName = rent.name
                              .replace(/\s/g, "-")
                              .replace(/[^\w\s]/g, "-")
                              .toLowerCase();
                            navigate(
                              `/rentDetails/-${rent.id}-${modifiedPanelName}`
                            );
                            window.scrollTo(0, 0);
                          }}
                          className="border rounded-md cursor-pointer shadow-lg transition duration-300 ease-in-out"
                        >
                          <div className="flex justify-center gap-6 rent-image-div">
                            <div className="sale-image-div">
                              {rent.image_one ? (
                                <img
                                  className="rounded-t-md cursor-pointer h-52 w-full"
                                  src={imageshow + rent.image_one}
                                  alt={rent.name}
                                />
                              ) : (
                                <img
                                  className="rounded-t-md cursor-pointer h-52 w-full"
                                  src={NoImage}
                                  alt="No Image"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2 justify-center text-[#303030] leading-6 font-medium text-md rent-inner-heading">
                              <div>{rent.name}</div>
                            </div>
                            <div className="for-rent-div">For Rent</div>
                            <div className="text-[#303030] leading-6 font-medium text-md rent-inner-heading">
                              {rent.name}
                            </div>
                          </div>
                          <div className="border p-2 rent-inner-div">
                            <div className="flex gap-2 items-center content-center">
                              <div className="flex gap-2">
                                <svg
                                  className="h-4 w-4 mt-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 384 512"
                                  fill="#303030"
                                >
                                  <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                </svg>
                                <div className="text-[#303030] font-bold text-lg">
                                  {rent.address}
                                </div>
                              </div>
                            </div>
                            {rent.sector && (
                              <div className="property-address">
                                Sector: {rent.sector}
                              </div>
                            )}
                            <div
                              className="property-address mb-3 items-center flex"
                              style={{ justifyContent: "space-between" }}
                            >
                              <div className="prize-div flex items-center">
                                <svg
                                  fill="#303030"
                                  className="w-4 h-4 mb-0"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 320 512"
                                >
                                  <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                </svg>
                                <div className="text-red-900 text-lg font-bold">
                                  {formatBudget(rent.budget)} Per Month Rent
                                </div>
                              </div>
                              <div style={{ textTransform: "capitalize" }}>
                                {rent.floor}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const modifiedPanelName = rent.name
                                  .replace(/\s/g, "")
                                  .toLowerCase();
                                navigate(
                                  `/rentDetails/-${rent.id}-${modifiedPanelName}`
                                );
                              }}
                              className="p-1 w-full text-black"
                              style={{ background: "#e2e2e2" }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>

                <div className="project-home-div">
                  <h2 className="rent-title lg:text-3xl text-2xl font-bold text-start text-green-900 mt-3">
                    <AnimatedText text="PROJECTS" />
                  </h2>
                  <Slider {...ProjectSlider}>
                    {listProjectData.map((data) => {
                      const imageUrl = getPropertyImageUrl(data);
                      const projectName = data.Project_Name || data.project_name || `Project-${data.id}`;
                      return (
                        <div className="project-card" key={data.id}>
                          <div onClick={() => handleProjectClicks(data.id, imageUrl, projectName)}>
                            <div className="project-home-page">
                              <div className="project-image-container">
                                <img
                                  src={imageUrl}
                                  alt={projectName || "Project Image"}
                                  className="project-image"
                                  onError={(e) => handlePropertyImageError(e, data)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="project-details">
                            <div onClick={() => handleProjectClicks(data.id, imageUrl, projectName)}>
                              <h5 className="project-title">{projectName}</h5>
                            </div>
                            <p className="project-location">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 384 512"
                                fill="#303030"
                              >
                                <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                              </svg>{" "}
                              {data.Address}
                            </p>
                            <p className="project-price  font-bold">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 320 512"
                                fill="#303030"
                              >
                                <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                              </svg>
                              {data.Min_Budget ? "From " : ""}
                              {formatBudget(data.Min_Budget)} |{" "}
                              {formatBudget(data.Max_Budget)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                </div>
              </div>

              {showCount < newData.length && (
                <div className="flex justify-center mt-10 mb-14">
                  <button
                    className="font-bold p-2 w-52 rounded-md text-white bg-red-600"
                    onClick={handleShowMore}
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}