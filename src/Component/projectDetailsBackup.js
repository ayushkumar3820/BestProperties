/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import "../Css/ProjectDetails.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../common/component/navbar";
import { liveUrl, token } from "../common/component/url";
import BottomBar from "../common/component/bottomBar";
import { ToastContainer } from "react-toastify";
import Searching from "../common/component/searching";
import BgImage from "../Images/nirwana-heights03.jpg";
import MapImage from "../Images/room-structure.png";

const ProjectDetails = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("2BHK");
  const [projectDetails, setProjectDetails] = useState([]);

  const projectId = id.split("-").pop();

  // Details API
  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${liveUrl}project-detail/${projectId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProjectDetails(data.result);
      })
      .catch((error) => {
        console.error("Error fetching project details:", error);
      });
  }, [projectId]);

  console.log(
    projectDetails,
    "sadkasdkfjklasdjflka sdlkfjklasdjfjkladsj flkjskd fj"
  );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const openLightbox = (imgSrc) => {
    setSelectedImage(imgSrc);
  };
  // Gallery Close button
  const closeLightbox = () => {
    setSelectedImage(null);
  };
  return (
    <>
      <Navbar />

      <div
        className="property-images"
        style={{ backgroundImage: `url(${BgImage})` }}
      >
        <div className="container">
          <div className="banner-content">
            <h1>Nirwana Heights</h1>
            <p>
              For those looking to buy a residential property, here comes one of
              the choicest offerings in Mohali, at Kharar. Brought to you by
              East Avenue Infracon, Nirwana Heights is among the newest
              addresses for homebuyers. There are apartments for sale in Nirwana
              Heights. This is an under-construction project right now, and is
              expected to be delivered by Oct, 2025 .
            </p>
            <button style={{ marginTop: "20px" }} className="contact-button">
              Contact Us
            </button>
          </div>
        </div>
      </div>
      <div className="img-gallery container">
        <div className="property-small-images">
          <div className="image-inner-div">
            <img
              src="https://bestpropertiesmohali.com/assets/properties/zr1.jpeg"
              alt="Property 2"
              onClick={() =>
                openLightbox(
                  "https://bestpropertiesmohali.com/assets/properties/zr1.jpeg"
                )
              }
            />
          </div>
          <div className="image-inner-div">
            <img
              src="https://bestpropertiesmohali.com/assets/properties/zr1.jpeg"
              alt="Property 2"
              onClick={() =>
                openLightbox(
                  "https://bestpropertiesmohali.com/assets/properties/zr1.jpeg"
                )
              }
            />
          </div>
          <div className="image-inner-div">
            <img
              src="https://bestpropertiesmohali.com/assets/properties/zr1.jpeg"
              alt="Property 2"
              onClick={() =>
                openLightbox(
                  "https://bestpropertiesmohali.com/assets/properties/zr1.jpeg"
                )
              }
            />
          </div>
          <div className="image-inner-div">
            <iframe
              width="100%"
              height="210"
              src="https://www.youtube.com/embed/GkPscB-_InU?si=chngw4wIYTcWc93_"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      <div className="inner-pro-main container">
        <div className="left-bar">
          <div className="container">
            {selectedImage && (
              <div className="lightbox" onClick={closeLightbox}>
                <div className="lightbox-content">
                  <img src={selectedImage} alt="Selected Property" />
                </div>
              </div>
            )}
          </div>

          <div className="">
            <div className="container">
              <div className="property-card-header">
                <h2>₹ 65 L - 1.9 Cr | 1990 Sqft</h2>
                <h3>Luxury 3BHK Zirakpur Patiala Road</h3>
                <p>Flats & Apartments/Mohali</p>
              </div>
              <div className="property-address">
                <p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                  </svg>
                  <strong>Address:</strong> High Ground Road, Zirakpur Patiala
                  Road
                </p>

                <p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M16 144a144 144 0 1 1 288 0A144 144 0 1 1 16 144zM160 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM128 480l0-162.9c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9L192 480c0 17.7-14.3 32-32 32s-32-14.3-32-32z" />
                  </svg>
                  <strong>Area:</strong> 1990 Sqft
                </p>

                <p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M448 160l-128 0 0-32 128 0 0 32zM48 64C21.5 64 0 85.5 0 112l0 64c0 26.5 21.5 48 48 48l416 0c26.5 0 48-21.5 48-48l0-64c0-26.5-21.5-48-48-48L48 64zM448 352l0 32-256 0 0-32 256 0zM48 288c-26.5 0-48 21.5-48 48l0 64c0 26.5 21.5 48 48 48l416 0c26.5 0 48-21.5 48-48l0-64c0-26.5-21.5-48-48-48L48 288z" />
                  </svg>
                  <strong>Construction Status:</strong> New Launch (Completion
                  in Oct, 2025)
                </p>

                <p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160l0 8c0 13.3 10.7 24 24 24l400 0c13.3 0 24-10.7 24-24l0-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224l-64 0 0 196.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512l448 0c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1L448 224l-64 0 0 192-40 0 0-192-64 0 0 192-48 0 0-192-64 0 0 192-40 0 0-192zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                  </svg>
                  <strong>Bankers:</strong> State Bank of India (8.10% Interest)
                </p>
                <p>
                  Luxury High Ground Road, Zirakpur Patiala Road, Exquisite and
                  opulent, this luxury 3BHK flat epitomizes sophisticated
                  living.
                </p>
                <p>Exclusive Limited-Time Offer: Embrace</p>
              </div>
              <div className="property-card-body">
                <div className="property-details">
                  <button className="contact-button">Contact Us</button>
                </div>
              </div>
            </div>

            <div className="map-div">
              <div className="container">
                <div className="company-inner">
                  <div className="content company-content-div">
                    <h2>More about Nirwana Heights</h2>
                    <hr className="line" />
                    <div className="description ">
                      <div className="item">
                        <p>
                          For those looking to buy a residential property, here
                          comes one of the choicest offerings in Mohali, at
                          Kharar.
                        </p>
                      </div>
                    </div>
                    <div className="tabs">
                      <button
                        className={activeTab === "2BHK" ? "tab active" : "tab"}
                        onClick={() => handleTabClick("2BHK")}
                      >
                        2 BHK
                      </button>
                      <button
                        className={activeTab === "3BHK" ? "tab active" : "tab"}
                        onClick={() => handleTabClick("3BHK")}
                      >
                        3 BHK
                      </button>
                      <button
                        className={activeTab === "4BHK" ? "tab active" : "tab"}
                        onClick={() => handleTabClick("4BHK")}
                      >
                        4 BHK
                      </button>
                    </div>

                    <div className="slider">
                      {activeTab === "2BHK" && (
                        <div className="slider-content">
                          {/* Replace the content below with your actual data */}
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
                      {/* You can add similar content for '2BHK' and '4BHK' tabs */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emalites */}
          <div className="container">
            <div className="amenities-container">
              <div className="amenities-content">
                <h2>AMENITIES</h2>
                <p>
                  Nirwana Heights Mohali presents an exclusive opportunity to
                  own a stunning home that offers all kinds of amenities and
                  facilities. This includes an air hockey, swimming pool, and
                  easy access to changing area. It also has a terrace garden, an
                  exclusive offering only for Nirwana Heights residents. Nirwana
                  Heights has an excellent combination of comfort and
                  convenience to suit every requirement as well as need.
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
        <div className="right-side ">
          <div className="form-container ">
            <form className="form">
              <h2 className="form-heading">
                The Best Way To Design Your Awesome Home!
              </h2>
              <label className="block tracking-wide  text-lg font-bold mb-2">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter Your Name"
                className="form-input"
              />
              <label className="block  tracking-wide  text-lg font-bold mb-2">
                Phone
              </label>
              <input
                type="text"
                placeholder="Enter your Number"
                className="form-input"
              />
              <button type="submit" className="form-button">
                Submit Your Information
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* <OurServices />  */}
      <Searching />
      <ToastContainer />
      <BottomBar />
    </>
  );
};

export default ProjectDetails;
