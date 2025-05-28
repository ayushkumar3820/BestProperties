import React, { useEffect, useState } from 'react';
import '../Css/ProjectDetails.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '../common/component/navbar';
import { liveUrl, token } from '../common/component/url';
import BottomBar from '../common/component/bottomBar';
import { ToastContainer } from 'react-toastify';
import Slider from "react-slick";
import Searching from '../common/component/searching';
import BgImage from '../Images/nirwana-heights03.jpg';
import MapImage from '../Images/room-structure.png';

const ProjectDetails = () => {
  const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState('2BHK');
    const [projectDetails, setProjectDetails] = useState([]);
    
    // Extract the project ID from the URL (last part after the hyphen)
    const projectId = id.split('-').pop();

    // Fetch project details using the projectId
    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`${liveUrl}project-detail`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pid: projectId }), // Use projectId here
        })
            .then(response => response.json())
            .then(data => {
                setProjectDetails(data.result); // Assuming response has project details in `data.result`
                console.log(data.result);
            })
            .catch(error => console.error('Error fetching project details:', error));
    }, [projectId]);

    console.log(projectDetails, "Getting Single Data");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const openLightbox = (imgSrc) => {
        setSelectedImage(imgSrc);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
    };

    return (
        <>
            <Navbar />
            {projectDetails.map((data) => (
                <div className="property-images" style={{ backgroundImage: `url(${BgImage})` }} key={data.id}>
                    <div className='container'>
                        <div className="banner-content">
                            <h1>{data.Project_Name}</h1>
                            <p>{data.Project_Discription}</p>
                            <button style={{ marginTop: "20px" }} className="contact-button">
                                <Link to="/contact">Contact Us</Link>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {projectDetails.map((data) => (
                <div className="container img-gallery" key={data.id}>
                    <div className="slider-section">
                        <Slider {...sliderSettings}>
                            <div>
                                <img
                                    src='https://bestpropertiesmohali.com/assets/properties/zr1.jpeg'
                                    className="slider-image"
                                    alt="Property 1"
                                />
                            </div>
                            <div>
                                <img
                                    src='https://bestpropertiesmohali.com/assets/properties/zr2.jpeg'
                                    className="slider-image"
                                    alt="Property 2"
                                />
                            </div>
                            <div>
                                <img
                                    src='https://bestpropertiesmohali.com/assets/properties/zr3.jpeg'
                                    className="slider-image"
                                    alt="Property 3"
                                />
                            </div>
                        </Slider>
                    </div>
                    <div className="video-section">
                        <div
                            dangerouslySetInnerHTML={{ __html: data.Video_u }} // Render the iframe string as HTML
                        ></div>
                    </div>
                </div>
            ))}

            <div className='inner-pro-main container'>
                <div className='left-bar'>
                    <div className='container'>
                        {selectedImage && (
                            <div className="lightbox" onClick={closeLightbox}>
                                <div className="lightbox-content">
                                    <img src={selectedImage} alt="Selected Property" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="">
                        {projectDetails.map((data) => (
                            <div className='container' key={data.id}>
                                <div className="property-card-header">
                                    <h2>₹ {formatBudget(data.Min_Budget)} - {formatBudget(data.Max_Budget)} {data.Built ? <>|</> : <></>} {data.Built} {data.Built ? <>Sqft</> : <></>}</h2>
                                    <h3>{data.Address}</h3>
                                    <p>Flats & Apartments/Mohali</p>
                                </div>
                                <div className="property-address">
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                        </svg>
                                        <strong>Address:</strong> {data.Address}
                                    </p>
                                    {data.Built ? (
                                        <p>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                <path d="M16 144a144 144 0 1 1 288 0A144 144 0 1 1 16 144zM160 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM128 480l0-162.9c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9L192 480c0 17.7-14.3 32-32 32s-32-14.3-32-32z" />
                                            </svg>
                                            <strong>Area:</strong> {data.Built} Sqft
                                        </p>
                                    ) : null}
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M448 160l-128 0 0-32 128 0 0 32zM48 64C21.5 64 0 85.5 0 112l0 64c0 26.5 21.5 48 48 48l416 0c26.5 0 48-21.5 48-48l0-64c0-26.5-21.5-48-48-48L48 64zM448 352l0 32-256 0 0-32 256 0zM48 288c-26.5 0-48 21.5-48 48l0 64c0 26.5 21.5 48 48 48l416 0c26.5 0 48-21.5 48-48l0-64c0-26.5-21.5-48-48-48L48 288z" />
                                        </svg>
                                        <strong>Construction Status:</strong> {data.Construction_Status}
                                    </p>
                                    {data.Bankers ? (
                                        <p>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160l0 8c0 13.3 10.7 24 24 24l400 0c13.3 0 24-10.7 24-24l0-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224l-64 0 0 196.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512l448 0c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1L448 224l-64 0 0 192-40 0 0-192-64 0 0 192-48 0 0-192-64 0 0 192-40 0 0-192zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                            </svg>
                                            <strong>Bankers:</strong> {data.Bankers}
                                        </p>
                                    ) : null}
                                    <p>{data.Property_Sub_Description}</p>
                                    <p>Exclusive Limited- {data.Exclusive_Limited}</p>
                                </div>
                                <div className="property-card-body">
                                    <div className="property-details">
                                        <button className="contact-button">
                                            <Link to="/contact">Contact Us</Link>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}


            {/* <div className="map-div">
              <div className="container">

                <div className="company-inner">
                  <div className="content company-content-div">
                    <h2>More about Nirwana Heights</h2>
                    <hr className="line" />
                    <div className="description ">
                      <div className="item">
                        <p>For those looking to buy a residential property, here comes one of the choicest offerings in Mohali, at Kharar.</p>
                      </div>
                    </div>
                    <div className="tabs">
                      <button
                        className={activeTab === '2BHK' ? 'tab active' : 'tab'}
                        onClick={() => handleTabClick('2BHK')}
                      >
                        2 BHK
                      </button>
                      <button
                        className={activeTab === '3BHK' ? 'tab active' : 'tab'}
                        onClick={() => handleTabClick('3BHK')}
                      >
                        3 BHK
                      </button>
                      <button
                        className={activeTab === '4BHK' ? 'tab active' : 'tab'}
                        onClick={() => handleTabClick('4BHK')}
                      >
                        4 BHK
                      </button>
                    </div>

                    <div className="slider">
                      {activeTab === '2BHK' && (
                        <div className="slider-content">
                          <div className="card">
                            <img src={MapImage} alt="1600 sq.ft." />
                            <p>1600 sq.ft. | ₹84 L</p>
                            <button>Request callback</button>
                          </div>
                          <div className="card">
                            <img src={MapImage} alt="1620 sq.ft." />
                            <p>1620 sq.ft. | ₹85 L</p>
                            <button>Request callback</button>
                          </div>
                          <div className="card">
                            <img src={MapImage} alt="1837 sq.ft." />
                            <p>1837 sq.ft. | ₹95 L</p>
                            <button>Request callback</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div> */}

          </div>

          {/* Emalites */}
                    <div className="container">
                        <div className="amenities-container">
                            <div className="amenities-content">
                                <h2>AMENITIES</h2>
                                <p>
                                    Nirwana Heights Mohali presents an exclusive opportunity to own a stunning home that offers all kinds of amenities and facilities. This includes an air hockey, swimming pool, and easy access to changing area. It also has a terrace garden, an exclusive offering only for Nirwana Heights residents. Nirwana Heights has an excellent combination of comfort and convenience to suit every requirement as well as need.
                                </p>
                                <ul>
                                    <li>Air Hockey</li>
                                    <li>Swimming Pool</li>
                                    <li>Changing Area</li>
                                    <li>Terrace Garden</li>
                                    <li>Creche/Day care</li>
                                    <li>Pool Table</li>
                                    <li>Banquet Hall</li>
                                    <li>Fountain</li>
                                    <li>Shopping Centre</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='right-side'>
                    <div className="form-container">
                        <form className="form">
                            <h2 className="form-heading">The Best Way To Design Your Awesome Home!</h2>
                            <label className="block tracking-wide text-lg font-bold mb-2">
                                Your Name
                            </label>
                            <input type="text" placeholder="Enter Your Name" className="form-input" />
                            <label className="block tracking-wide text-lg font-bold mb-2">
                                Phone
                            </label>
                            <input type="text" placeholder="Enter your Number" className="form-input" />
                            <button type="submit" className="form-button">
                                Submit Your Information
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Searching />
            <ToastContainer />
            <BottomBar />
        </>
    );
};

export default ProjectDetails;