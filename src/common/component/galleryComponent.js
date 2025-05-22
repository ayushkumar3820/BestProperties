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
export default function GalleryComponent() {
  const Navigate = useNavigate();
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
  const navigate = useNavigate();
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
        "Content-Type": "application/json", // Add any other headers you need
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result, "this is response");
        setNewData(data.result);
        setShowData(data.image_url);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error:", error);
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
        setNewRent(data.result);
        setImageShow(data.image_url);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    // Get Project Data Here
    fetch(`${liveUrl}all-projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setlistProjectData(data.result);
        // console.log(data.result )
        setLoader(false)
      })
      .catch((error) => {
        console.error("Error:", error);
      });




    fetch(`${liveUrl}only-single-properties`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProperties(data.result);
        console.log(data.result, "dskjkljdfkl dklfjklad jfkjsdklfjkladjfkljadkfkl;sadj")
        setLoader(false)
      })
      .catch((error) => {
        console.error("Error:", error);
        console.log("dskjkljdfkl dklfjklad jfkjsdklfjkladjfkljadkfkl;sadj")
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
        }) + " Crore"
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
  const handleProjectClick = (projectId) => {
    navigate(`/single-property/${projectId}`);
  };
  // Css
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
  // heading Css
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
    slidesToShow: 1, // Default for larger screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true, // Keep navigation arrows if needed
    dots: true, // Enable dots for navigation
    responsive: [
      {
        breakpoint: 1024, // For tablet devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575, // For mobile devices (portrait mode)
        settings: {
          slidesToShow: 1, // 1 slide per view on mobile
          slidesToScroll: 1,
        },
      },
    ],
  };

  const oneSlider = {
    infinite: true,
    speed: 1000,
    slidesToShow: 3, // Default for larger screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024, // For tablet devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575, // For mobile devices (portrait mode)
        settings: {
          slidesToShow: 1, // 1 slide per view on mobile
          slidesToScroll: 1,
        },
      },
    ],
  };

  const PropertySlider = {
    infinite: true,
    speed: 1500,
    slidesToShow: 3, // Default for larger screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024, // For tablet devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575, // For mobile devices (portrait mode)
        settings: {
          slidesToShow: 1, // 1 slide per view on mobile
          slidesToScroll: 1,
        },
      },
    ],
  };

  const ProjectSlider = {
    infinite: true,
    speed: 1500,
    slidesToShow: 2, // Default for larger screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: false,
    responsive: [
      {
        breakpoint: 1024, // For tablet devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575, // For mobile devices (portrait mode)
        settings: {
          slidesToShow: 1, // 1 slide per view on mobile
          slidesToScroll: 1,
        },
      },
    ],
  };




  return (
    <div>
      {loader ? (
        <>
       
          <div className="flex justify-center  align-items-center p-2  ">
            <svg
              className=" animate-spin h-10 w-10  "
              fill="#014108"
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
            </svg>
          </div>
        </>
      ) : (
        <>
          {showRent ? (
            <>
              <Rent />
            </>
          ) : (
            <>
              <div className="slider-main-div mt-8 gap-6 items-start ">
                <div className="slider-inner-div ">
                  <h2 className="deal-title lg:text-3xl text-2xl font-bold text-start text-green-900 mt-3">
                    <AnimatedText text="HOT DEALS" />
                  </h2>
                  <Slider {...oneSlider}>
                    {newData.slice(0, showCount).map((panel) => {
                      return (
                        <>
                          <div
                            onClick={() => {
                              const modifiedPanelName = panel.name
                                .replace(/\s/g, "-")
                                .replace(/[^\w\s]/g, "")
                                .toLowerCase();
                              Navigate(
                                `/property/-${panel.id}-${modifiedPanelName}`
                              );
                            }}
                            className="main-sale-div border rounded-md  cursor-pointer     shadow-lg   transition duration-300 ease-in-out "
                          >
                            <div className="relative  ">
                              <div className=" absolute left-0  "></div>
                              {panel.type ? (
                                <>
                                  <div className=" flex items-center bg-green-900 text-white  px-2 py-2 left-0 bottom-0 absolute font-bold lg:text-xl  text-sm ">
                                    <div className="text-md text-sm font-bold ml-2">
                                      {panel.name}
                                    </div>
                                  </div>-294.2A48
                                  
                                </>
                              ) : null}
                              <div className="sale-image-div">
                                {panel.image_one ? (
                                  <>
                                    <img
                                      className=" rounded-t-md cursor-pointer  h-52 w-full"
                                      src={showData + panel.image_one}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <img
                                      className=" rounded-t-md cursor-pointer  h-52 w-full"
                                      src={NoImage}
                                    />
                                  </>
                                )}
                              </div>
                              <div className="for-sale-div">For Sale</div>
                            </div>
                            <div className="text-left bg-white border border-t leading-4 p-2">
                              <div className=" mr-2 ">
                                <div className="">
                                  <div className="text-sm font-extralight ">
                                    {panel.property_name}
                                  </div>

                                  <div className="headingStyle flex items-center text-green-800 font-bold prperty-heading">
                                    <svg
                                      fill="#14532d"
                                      className="w-5 h-5 "
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 320 512"
                                    >
                                      <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                    </svg>
                                    {formatBudget(panel.budget)}
                                    <div
                                      className=" lg:text-lg ml-2 text-sm headingStyle"
                                      style={headingStyle}
                                    >
                                      {panel.sqft > 0 ? (
                                        <>
                                          | {panel.sqft} {panel.measureUnit}
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>
                                  <div
                                    className="flex  items-start mt-3"
                                    style={{
                                      alignItems: "flex-start !important;",
                                    }}
                                  >
                                    <div>
                                      <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 384 512"
                                        fill="#14532d"
                                      >
                                        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                      </svg>
                                    </div>
                                    <div className="property-address sale-address m-0">
                                      {panel.address}
                                    </div>
                                  </div>
                                  <div className="flex items-center lg:gap-3 gap-3 mt-1">
                                    <div className="flex items-center gap-2 ">
                                      {panel.bedrooms ? (
                                        <img className="w-6" src={Bed} />
                                      ) : null}
                                      <div className="font-semibold text-green-800 inner-rooms-heading">
                                        {panel.bedrooms}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {panel.bathrooms ? (
                                        <img className="w-6" src={Bath} />
                                      ) : null}
                                      <div className="font-semibold text-green-800 inner-rooms-heading">
                                        {panel.bathrooms}
                                      </div>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                      <img
                                        className="w-5"
                                        src={panel.varifed}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </Slider>
                </div>


                <div className="slider-inner-div ">
                  <h2 className="property-title lg:text-3xl text-2xl font-bold text-start text-green-900 mt-3">
                    <AnimatedText text="PROPERTIES" />
                  </h2>
                  <div class="home-single">
                    <Slider {...PropertySlider}>
                      {properties.map((item) => {
                        return <>
                          <div key={item.id} onClick={() => handleProjectClick(item.id)} className="rent-detail-div p-2">
                            <div className="border rounded-md cursor-pointer  shadow-lg transition duration-300 ease-in-out"
                            >
                              <div className="felx justify-center gap-6 rent-image-div">
                                <div className="sale-image-div">
                                  {item.Image_URLs.length > 0 ? <>
                                    <img
                                      className="rounded-t-md cursor-pointer h-52 w-full"
                                      src={item.Image_URLs}
                                      alt="No Image"
                                    />
                                  </>
                                    : <>
                                      <img
                                        className=" rounded-t-md cursor-pointer  h-52 w-full"
                                        src={NoImage}
                                      />
                                    </>
                                  }



                                </div>
                              </div>
                              <div className="border p-2 rent-inner-div">
                                <div className="prperty-heading flex items-center text-green-800 font-bold prperty-heading mb-3">{item.name}</div>
                                <div
                                  className="property-address mb-3 mt-0 items-center flex"
                                  style={{ justifyContent: "space-between", marginTop: '0' }}
                                >
                                  <div className="headingStyle flex items-center text-green-800 font-bold ">
                                    <svg
                                      fill="#14532d"
                                      className="w-5 h-5 "
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 320 512"
                                    >
                                      <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                    </svg>

                                    <div
                                      className=" lg:text-lg ml-2 text-sm headingStyle"
                                      style={headingStyle}
                                    >{formatBudget(item.budget)}
                                      {item.sqft.length > 0 ? <>| {item.sqft} Sqft</> : <>{null}</>}

                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 items-center content-center mb-3">
                                  <div className="flex gap-2">
                                    <svg
                                      className="h-5 w-5"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 384 512"
                                      fill="#14532d"
                                    >
                                      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                    </svg>
                                    <div>{item.address}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>;
                      })}
                    </Slider>

                  </div>
                </div>
              </div>

              <div class="project-rent-div">
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
                            Navigate(
                              `/rentDetails/-${rent.id}-${modifiedPanelName}`
                            );
                            window.scrollTo(0, 0);
                          }}
                          className="border rounded-md cursor-pointer  shadow-lg transition duration-300 ease-in-out"
                        >
                          <div className="felx justify-center gap-6 rent-image-div">
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
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2 justify-center text-green-800 leading-6 font-medium text-md rent-inner-heading">
                              <div>{rent.name}</div>
                            </div>
                            <div className="for-rent-div">For Rent</div>
                            <div className="text-green-800 leading-6 font-medium text-md rent-inner-heading">
                              {rent.name}
                            </div>
                          </div>
                          <div className="border p-2 rent-inner-div">
                            <div className="flex gap-2 items-center content-center">
                              <div className="flex gap-2">
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 384 512"
                                  fill="#14532d"
                                >
                                  <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                </svg>
                                <div>{rent.address}</div>
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
                                  fill="#14532d"
                                  className="w-5 h-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 320 512"
                                >
                                  <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                </svg>
                                <div>{formatBudget(rent.budget)} Per Month Rent</div>
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
                                Navigate(
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

                <div class="project-home-div">
                  <h2 className="rent-title lg:text-3xl text-2xl font-bold text-start text-green-900 mt-3">
                    <AnimatedText text="PROJECTS" />
                  </h2>
                  <Slider {...ProjectSlider}>
                  {listProjectData.map((data) => (
                    <div className="project-card" key={data.id}>
                      <div key={data.id} onClick={() => handleProjectClick(data.id)}>
                        <div className="project-image-container">
                          {data.Image_URLs ? (
                            <img src={data.Image_URLs} alt={data.title} className="project-image" />
                          ) : (
                            <img src={NoImage} alt={data.title} className="project-image" />
                          )}
                        </div>
                      </div>


                      <div className="project-details">
                        <div key={data.id} onClick={() => handleProjectClick(data.id)}><h5 className="project-title">{data.Project_Name}</h5></div>
                        <p className="project-location">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg> {data.Address}
                        </p>
                        <p className="project-price text-green-800 font-bold">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" /></svg>
                          {data.Min_Budget ? <>From</> : (<></>)} {formatBudget(data.Min_Budget)} | {formatBudget(data.Max_Budget)}
                        </p>
                      </div>
                    </div>
                  ))}
                  </Slider>
                </div>
              </div>



              <div className="flex justify-center mt-10 mb-14">
                {showCount < newData.length && (
                  <button
                    className="font-bold p-2 w-52 rounded-md text-white bg-red-600"
                    onClick={handleShowMore}
                  >
                    Show More
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
