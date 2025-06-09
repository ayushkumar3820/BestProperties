/* eslint-disable no-unused-vars */
import React, { useState, useEffect, } from "react";
import '../Css/Projects.css';
import { useNavigate } from "react-router-dom";
import Navbar from '../common/component/navbar';
import OurServices from '../common/component/ourServices';
import BottomBar from '../common/component/bottomBar';
import Searching from '../common/component/searching';
import Slider from 'react-slick';

import { liveUrl, token } from "../common/component/url";
import noImage from ".././assets/img/image-not.jpg";
import ProjectBanner from '../Images/project-banner-image.jpg'
import AnimatedText from "../common/component/HeadingAnimation";

const projectData = [
    {
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", // Property 1
        title: "Joy Grand",
        location: "court complex, Sector 88, Sahibzada Ajit Singh Nagar, Punjab 140307",
        apartmentType: "3,4 BHK Apartment, Sector 88",
        price: "₹1.71 - 2.6 Cr",
    },
    {
        image: "https://images.unsplash.com/photo-1599423300746-b62533397364", // Property 2
        title: "Ubber Mews Gate",
        location: "QJ6J+7W, Kharar - Kurali Rd, Aujala, Punjab 140301",
        apartmentType: "1, 2 BHK Apartment",
        price: "₹1.5 - 2.2 Cr",

    },
    // Add more objects for additional slides
];

const projects = [
    {
        name: "Turnstone The Medallion Aurum",
        address: "3,4 BHK Apartment, Sector 67",
        price: "40,000,000",
        image: "https://images.unsplash.com/photo-1599423300746-b62533397364" // Dummy image
    },
    {
        name: "Jubilee Vallum",
        address: "3,4 BHK Apartment, Sector 91",
        price: "10,000,000",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" // Dummy image
    },
    {
        name: "Wave Estate",
        address: "2,3,4,5 BHK Independent/Builder Floor, Apartment,Independent House/Villa, Sector 85",
        price: "50,000,000",
        image: "https://images.unsplash.com/photo-1599423300746-b62533397364" // Dummy image
    },
    {
        name: "Palm Village",
        address: "3 BHK Apartment, Sector 126",
        price: "15,000,000",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" // Dummy image
    },
    {
        name: "Uptown Skylla",
        address: "2,3,4 BHK Apartment, Aerocity",
        price: "18,000,000",
        image: "https://images.unsplash.com/photo-1599423300746-b62533397364" // Dummy image
    },
    {
        name: "Ambika La Parisian",
        address: "2,3,4 BHK Apartment, Sector 66b",
        price: "25,000,000",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" // Dummy image
    },

];
const Projects = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [listProjectData, setlistProjectData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [upcomingProjects, setUpcomingProjects] = useState([]);
    const navigate = useNavigate();

    // Upcoming Projects Slider 
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % projectData.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

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

    // const generateSlug = (text, separator = '-') => {
    //     return text ? text.toLowerCase().replace(/\s+/g, separator).replace(/[^\w-]+/g, '') : '';
    // };

    const handleProjectClick = (projectId) => {
        navigate(`/project-details/${projectId}`);
    };

    console.log(listProjectData)

    const { image, title, location, apartmentType, price } = projectData[currentIndex];

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
                <div className="project-slider-container">
                    <h1 className="project-slide-main-title ">Upcomg Projects</h1>

                    <div className="project-slider-image">
                        <img src={image} alt={title} />
                    </div>
                    <div className="project-slider-content">
                        <h2 className="project-slider-title">{title}</h2>
                        <p className="project-slider-location">{location}</p>
                        <p className="project-slider-apartment">{apartmentType}</p>
                        <p className="project-slider-price">{price}</p>
                        <button className="project-slider-btn">View Number</button>
                    </div>
                </div>

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
                        {listProjectData.map((data) => (
                            <div className="project-card" key={data.id}>
                                <div key={data.id} onClick={() => handleProjectClick(data.id)}>
                                    <div className="project-image-container">
                                        {data.Image_URLs ? (
                                            <img src={data.Image_URLs} alt={data.title} className="project-image" />
                                        ) : (
                                            <img src={noImage} alt={data.title} className="project-image" />
                                        )}
                                    </div>
                                </div>


                                <div className="project-details">
                                    <div key={data.id} onClick={() => handleProjectClick(data.id)}><h5 className="project-title">{data.Project_Name}</h5></div>
                                    <p className="project-location">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg> {data.Address}
                                    </p>
                                    <p className="project-price">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" /></svg> From {data.Min_Budget}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>}



                <div className="font-bold  mt-4 text-2xl uppercase text-center  text-green-800">
                    <AnimatedText text="Projects in High Demand" />
                    <p>The most sought-after projects in Mohali</p>
                </div>
                <div className="project-slider">
                    <Slider {...settings}>
                        {projects.map((project, index) => (
                            <div key={index} className="project-slide">
                                <div className="inner-slider-content">
                                    <img src={project.image} alt={project.name} className="project-image" />
                                    <div className="project-info">
                                        <h3 className="project-name">{project.name}</h3>
                                        <p className="project-address"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg>{project.address}</p>
                                        <p className="project-price"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" /></svg>{project.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            <OurServices />
            <Searching />
            <BottomBar />
        </>


    );
};

export default Projects;
