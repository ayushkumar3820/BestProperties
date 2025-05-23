import React, { useState, useEffect, } from "react";
import '../Css/Projects.css';
import { useNavigate } from "react-router-dom";
import Navbar from '../common/component/navbar';
import { Link } from "react-router-dom";
import OurServices from '../common/component/ourServices';
import BottomBar from '../common/component/bottomBar';
import Searching from '../common/component/searching';

import { liveUrl, token } from "../common/component/url";
import noImage from ".././assets/img/image-not.jpg";
import ProjectBanner from '../Images/project-banner-image.jpg'
import AnimatedText from "../common/component/HeadingAnimation";

const Projects = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [listProjectData, setlistProjectData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [upcomingProjects, setUpcomingProjects] = useState([]);
    const [visibleCount, setVisibleCount] = useState(20);
    const navigate = useNavigate();
    const visibleProjects = listProjectData.slice(0, visibleCount);

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
    // Project Api
    useEffect(() => {
        // Projects in High Demand
        window.scrollTo(0, 0);
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

        // Upcoming Project API Hited Here
        fetch(`${liveUrl}upcoming-projects`, {
            method: "GET",
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
                setUpcomingProjects(data.result);
                setLoader(false)
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    const handleProjectClick = (projectId) => {
        navigate(`/project-details/${projectId}`);
    };



    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === upcomingProjects.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);
        return () => clearInterval(interval);
    }, [upcomingProjects]);


    // const generateSlug = (text, separator = '-') => {
    //     return text ? text.toLowerCase().replace(/\s+/g, separator).replace(/[^\w-]+/g, '') : '';
    // };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768, // For tablets
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480, // For mobile devices
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
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
                                {upcomingProjects.length > 0 ? (<>
                                    {upcomingProjects.map((data, index) => (
                                        <div
                                            key={index}
                                            className={`project-slider-slide ${index === currentIndex ? "active" : "inactive"
                                                }`}
                                        >
                                            <div className="project-slider-image">
                                                <img src={data.Image_URLs} alt={data.Project_Name} />
                                            </div>
                                            <div className="project-slider-content">
                                                <h2 className="project-slider-title">{data.Project_Name}</h2>
                                                <p className="project-slider-location">{data.Address}</p>
                                                <p className="project-slider-price">{formatBudget(data.Min_Budget)}</p>
                                                <Link className="project-slider-btn" to="/contact">Contact Now</Link>
                                            </div>
                                        </div>
                                    ))}
                                </>) : (<>
                                    <div className="comingdiv" style={{ height: '70px;' }}>
                                        <h4>Coming soon...</h4>
                                    </div>
                                </>)}

                            </div>
                        </div>
                    </div>
                </section>


                {/* Project Cards Section */}
                <div className="container">
                    <div className="font-bold  mt-4 text-2xl uppercase  text-green-800">
                        <AnimatedText text="Projects in High Demand" />
                        <p>The most sought-after projects in Mohali</p>
                    </div>
                </div>
                {loader ? (
                    <>
                        <div className="flex justify-center align-items-center p-2  ">
                            <svg
                                className=" animate-spin h-10 w-10 mt-4 mb-4 "
                                fill="#014108"
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 512 512"
                            >
                                <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                            </svg>
                        </div>
                    </>
                ) : <>
                            <div className="project-container">
                                {visibleProjects.map((data) => (
                                    <div className="project-card" key={data.id}>
                                        <div onClick={() => handleProjectClick(data.id)}>
                                            <div className="project-image-container">
                                                {data.Image_URLs ? (
                                                    <img src={data.Image_URLs} alt={data.title} className="project-image" />
                                                ) : (
                                                    <img src={noImage} alt={data.title} className="project-image" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="project-details">
                                            <div onClick={() => handleProjectClick(data.id)}>
                                                <h5 className="project-title">{data.Project_Name}</h5>
                                            </div>
                                            <p className="project-location">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                                    <path d="..." />
                                                </svg>
                                                {data.Address}
                                            </p>
                                            <p className="project-price text-green-800 font-bold">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                    <path d="..." />
                                                </svg>
                                                {data.Min_Budget ? <>From</> : null} {formatBudget(data.Min_Budget)} | {formatBudget(data.Max_Budget)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                    {visibleCount < listProjectData.length && (
                        <div className="text-center mb-4">
                            <button
                                className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900 transition"
                                onClick={() => setVisibleCount(visibleCount + 20)}
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>}
            </div>
            <OurServices />
            <Searching />
            <BottomBar />
        </>


    );
};

export default Projects;
