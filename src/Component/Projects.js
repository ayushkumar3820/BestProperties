/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import '../Css/Projects.css';
import { useNavigate } from "react-router-dom";
import Navbar from '../common/component/navbar';
import { Link } from "react-router-dom";
import OurServices from '../common/component/ourServices';
import BottomBar from '../common/component/bottomBar';
import Searching from '../common/component/searching';
import { liveUrl, token } from "../common/component/url";
import noImage from "../../src/assets/img/image-not.jpg";
import ProjectBanner from '../Images/project-banner-image.jpg';
import AnimatedText from "../common/component/HeadingAnimation";

// Function to generate a URL-friendly slug
const generateSlug = (text, separator = '-') => {
    return text
        ? text
              .toLowerCase()
              .replace(/\s+/g, separator)
              .replace(/[^\w-]+/g, '')
        : '';
};

const Projects = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [listProjectData, setListProjectData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [upcomingProjects, setUpcomingProjects] = useState([]);
    const [visibleCount, setVisibleCount] = useState(8);
    const navigate = useNavigate();
    const visibleProjects = listProjectData.slice(0, visibleCount);

    const formatBudget = (value) => {
        // Handle case where value is null, undefined, or 0
        if (!value || value === 0) {
            return "Price on Request";
        }
        
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

    // Project API
    useEffect(() => {
        window.scrollTo(0, 0);
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
                setListProjectData(data.result || []); // Fallback to empty array
                setLoader(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setListProjectData([]); // Set empty array on error
                setLoader(false);
            });

        // Upcoming Project API
        fetch(`${liveUrl}upcoming-projects`, {
            method: "GET",
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
                setUpcomingProjects(data.result || []); // Fallback to empty array
                setLoader(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setUpcomingProjects([]); // Set empty array on error
                setLoader(false);
            });
    }, []);

    // Updated handleProjectClick to include project name slug
    const handleProjectClick = (projectId, projectName) => {
        const slug = generateSlug(projectName);
        navigate(`/project-details/${slug}-${projectId}`);
    };

    useEffect(() => {
        if (upcomingProjects.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === upcomingProjects.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [upcomingProjects]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <>
            <Navbar />
            <div className="project-page">
                {/* Banner Section */}
                <div className="banner" style={{ backgroundImage: `url(${ProjectBanner})` }}>
                    <h1 className="banner-title">
                        <AnimatedText text="Our Real Estate Projects" />
                    </h1>
                </div>

                {/* Upcoming Projects */}
                <section className="up-coming-main">
                    <div className="container">
                        <div className="project-slider-container">
                            <h1 className="project-slide-main-title">Upcoming Projects</h1>
                            <div className="project-slider-wrapper">
                                {upcomingProjects.length > 0 ? (
                                    <>
                                        {upcomingProjects.map((data, index) => (
                                            <div
                                                key={index}
                                                className={`project-slider-slide ${
                                                    index === currentIndex ? "active" : "inactive"
                                                }`}
                                            >
                                                <div className="project-slider-image">
                                                    {/* Enhanced image fallback for upcoming projects */}
                                                    {data.Image_URLs ? (
                                                        <img 
                                                            src={data.Image_URLs} 
                                                            alt={data.Project_Name || "Project Image"} 
                                                            onError={(e) => {
                                                                e.target.src = noImage;
                                                            }}
                                                        />
                                                    ) : (
                                                        <img src={noImage} alt={data.Project_Name || "No Image Available"} />
                                                    )}
                                                </div>
                                                <div className="project-slider-content">
                                                    <h2 className="project-slider-title">{data.Project_Name || "Project Name Not Available"}</h2>
                                                    <p className="project-slider-location">{data.Address || "Location Not Available"}</p>
                                                    <p className="project-slider-price">{formatBudget(data.Min_Budget)}</p>
                                                    <Link className="project-slider-btn" to="/contact">
                                                        Contact Now
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="comingdiv" style={{ height: '70px' }}>
                                        <h4>Coming soon...</h4>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Project Cards Section */}
                <div className="container">
                    <div className="font-bold mt-4 text-2xl uppercase text-green-800">
                        <AnimatedText text="Projects in High Demand" />
                        <p>The most sought-after projects in Mohali</p>
                    </div>
                </div>
                {loader ? (
                    <div className="flex justify-center align-items-center p-2">
                        <svg
                            className="animate-spin h-10 w-10 mt-4 mb-4"
                            fill="#014108"
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 512 512"
                        >
                            <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                        </svg>
                    </div>
                ) : listProjectData.length === 0 ? (
                    // Show message when no projects are available
                    <div className="text-center p-8">
                        <h3 className="text-xl text-gray-600">No projects available at the moment</h3>
                        <p className="text-gray-500 mt-2">Please check back later for new projects</p>
                    </div>
                ) : (
                    <div className="project-container">
                        {visibleProjects.map((data) => (
                            <div className="project-card" key={data.id}>
                                <div onClick={() => handleProjectClick(data.id, data.Project_Name)}>
                                    <div className="project-image-container">
                                        {/* Enhanced image fallback with onError handler */}
                                        {data.Image_URLs ? (
                                            <img 
                                                src={data.Image_URLs} 
                                                alt={data.Project_Name || "Project Image"} 
                                                className="project-image" 
                                                onError={(e) => {
                                                    e.target.src = noImage;
                                                }}
                                            />
                                        ) : (
                                            <img src={noImage} alt={data.Project_Name || "No Image Available"} className="project-image" />
                                        )}
                                    </div>
                                </div>

                                <div className="project-details">
                                    <div onClick={() => handleProjectClick(data.id, data.Project_Name)}>
                                        <h5 className="project-title">{data.Project_Name || "Project Name Not Available"}</h5>
                                    </div>
                                    <p className="project-location">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 384 512" 
                                            width="16" 
                                            height="16" 
                                            fill="#014108"
                                            style={{ marginRight: '8px', display: 'inline-block' }}
                                        >
                                            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                                        </svg>
                                        {data.Address || "Location Not Available"}
                                    </p>
                                    <p className="project-price text-green-800 font-bold">
                                       <svg
                                      fill="#14532d"
                                      className="w-5 h-5"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 320 512"
                                    >
                                      <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                    </svg>
                                        {/* Enhanced price display with better fallback handling */}
                                        {data.Min_Budget && data.Max_Budget ? (
                                            <>From {formatBudget(data.Min_Budget)} | {formatBudget(data.Max_Budget)}</>
                                        ) : data.Min_Budget ? (
                                            <>From {formatBudget(data.Min_Budget)}</>
                                        ) : data.Max_Budget ? (
                                            <>Up to {formatBudget(data.Max_Budget)}</>
                                        ) : (
                                            "Price on Request"
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {visibleCount < listProjectData.length && (
                    <div className="text-center mb-4">
                        <button
                            className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900 transition"
                            onClick={() => setVisibleCount(visibleCount + 8)}
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
            <OurServices />
            <Searching />
            <BottomBar />
        </>
    );
};

export default Projects;