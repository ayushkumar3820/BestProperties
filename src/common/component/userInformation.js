/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import AnimatedText from "./HeadingAnimation";
import OurServices from "./ourServices";
import Searching from "./searching";
import { liveUrl, token } from "./url";
import ImageOne from "../../assets/img/image-not.jpg";
import Bed from "../../assets/img/bed.png";
import Bath from "../../assets/img/bath.png";
import Kitchen from "../../assets/img/kitchen.png";
import "./ModalPage.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default function UserInformation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const propertyId = id?.split("-")[1];

  // State management
  const [propertyData, setPropertyData] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [activeImage, setActiveImage] = useState("main");
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({ firstname: "", phone: "" });
  const [errors, setErrors] = useState({ firstname: "", phone: "" });

  // Modal styles
  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      backgroundColor: "white",
      padding: "20px",
      maxWidth: "90vw",
      maxHeight: "90vh",
    },
  };

  // Fetch random properties as fallback
  const fetchRandomProperties = async () => {
    try {
      const response = await fetch(`${liveUrl}api/Reactjs/gallery`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const properties = data?.result || [];
      // Filter out the current property and select up to 3 random properties
      const filteredProperties = properties
        .filter((prop) => prop.id !== propertyId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setSimilarProperties(filteredProperties);
      console.log("Random Properties:", filteredProperties);
    } catch (error) {
      console.error("Error fetching random properties:", error);
      toast.error("Failed to load random properties");
    }
  };

  // Fetch property data
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!propertyId) {
        toast.error("Invalid property ID");
        setLoader(false);
        return;
      }

      setLoader(true);
      try {
        const response = await fetch(
          `${liveUrl}api/PropertyDetail/propertyAllDetails`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: propertyId }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        setPropertyData(data?.result?.main_property?.[0] || null);
        const additionalProperties = data?.result?.additional_properties || [];

        if (additionalProperties.length > 0) {
          setSimilarProperties(additionalProperties);
          console.log("Similar Properties:", additionalProperties);
        } else {
          // Fetch random properties if no similar properties are found
          console.log(
            "No similar properties found, fetching random properties..."
          );
          await fetchRandomProperties();
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property data");
        // Attempt to fetch random properties as a fallback
        await fetchRandomProperties();
      } finally {
        setLoader(false);
      }
    };

    fetchPropertyData();
    window.scrollTo(0, 0);
  }, [propertyId]);

  // Form validation
  const validatePhoneNumber = (phone) => /^[0-9]{10}$/.test(phone);

  const validateForm = () => {
    const newErrors = { firstname: "", phone: "" };
    let isValid = true;

    if (!formData.firstname.trim()) {
      newErrors.firstname = "Please enter your name";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
      isValid = false;
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form submission
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${liveUrl}api/Contact/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Your information has been submitted successfully!");
        setFormData({ firstname: "", phone: "" });
        setModalIsOpen(false);
      } else {
        toast.error(result.message || "Failed to submit information");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.error("Error submitting form:", error);
    }
  };

  // Image handling
  const handleImageChange = (imageType) => {
    setActiveImage(imageType);
  };

  // Budget formatting
  const formatBudget = (value) => {
    if (!value) return "N/A";
    const numValue = Number(value);
    if (numValue >= 10000000) {
      return `${(numValue / 10000000).toFixed(2)} Crore`;
    } else if (numValue >= 100000) {
      return `${(numValue / 100000).toFixed(2)} Lac`;
    } else if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(2)} Thousand`;
    }
    return numValue.toLocaleString();
  };

  // Render property image
  const renderPropertyImage = () => {
    const imageMap = {
      main: propertyData?.image_one_url,
      two: propertyData?.image_two_url,
      three: propertyData?.image_three_url,
      four: propertyData?.image_four_url,
    };

    return (
      <div className="relative inline-block w-full sm:w-96 h-80">
        <img
          className="w-full h-full object-cover border rounded-lg cursor-pointer"
          src={imageMap[activeImage] || ImageOne}
          alt="Property"
          onClick={() => setImageModal(true)}
        />
        <div className="absolute top-0 left-0 bg-[#d7dde5] text-[#303030] px-2 py-1 text-xs rounded-br">
          ID: {propertyData?.unique_id || "N/A"}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Image Modal */}
      <Modal
        isOpen={imageModal}
        onRequestClose={() => setImageModal(false)}
        style={modalStyles}
      >
        <div className="flex justify-end">
          <button
            onClick={() => setImageModal(false)}
            className="bg-red-600 w-8 h-8 flex justify-center items-center rounded-md"
          >
            <svg
              className="w-5 h-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                fill="currentColor"
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0 s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-center max-h-[400px] items-center">
          <img
            className="h-96 w-full sm:w-96 object-cover rounded-lg"
            src={
              activeImage === "main" && propertyData?.image_one_url
                ? propertyData.image_one_url
                : activeImage === "two" && propertyData?.image_two_url
                ? propertyData.image_two_url
                : activeImage === "three" && propertyData?.image_three_url
                ? propertyData.image_three_url
                : propertyData?.image_four_url || ImageOne
            }
            alt="Property"
          />
        </div>
      </Modal>

      {/* Contact Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={modalStyles}
      >
        <div className="w-full sm:w-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-2xl text-green-800">
              Scheduler Booking
            </h2>
            <button
              onClick={() => setModalIsOpen(false)}
              className="bg-red-600 w-8 h-8 flex justify-center items-center rounded-md"
            >
              <svg
                className="w-5 h-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path
                  fill="currentColor"
                  d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.441 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmitForm}>
            <div className="mb-4">
              <label className="text-lg font-semibold mb-2 block text-gray-800">
                Your Name*
              </label>
              <input
                className="w-full h-12 border border-black rounded-lg py-3 px-4 focus:outline-none focus:border-green-500"
                name="firstname"
                value={formData.firstname}
                onChange={(e) =>
                  setFormData({ ...formData, firstname: e.target.value })
                }
                placeholder="Please enter your name"
              />
              {errors.firstname && (
                <p className="text-red-600 text-sm mt-1">{errors.firstname}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="text-lg font-semibold mb-2 block text-gray-800">
                Phone*
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full h-12 border border-black rounded-lg py-3 px-4 focus:outline-none focus:border-gray-500"
                placeholder="Please enter your phone number"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
              disabled={loader}
            >
              {loader ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </Modal>

      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {loader ? (
          <div className="flex justify-center items-center py-8">
            <svg
              className="animate-spin h-10 w-10 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM304 464a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"
              />
            </svg>
          </div>
        ) : !propertyData ? (
          <div className="text-center font-semibold text-xl text-gray-800">
            No Property Data Found
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 rounded-lg p-4 bg-white shadow-sm">
            {/* Image Section */}
            <div className="flex-shrink-0 w-full sm:w-96">
              {renderPropertyImage()}
              <div className="flex gap-2 mt-2 justify-center sm:justify-start">
                {propertyData.image_two_url && (
                  <img
                    onClick={() => handleImageChange("two")}
                    className="h-16 w-16 object-cover border border-gray-300 rounded cursor-pointer hover:border-green-500"
                    src={propertyData.image_two_url}
                    alt="Thumbnail Two"
                  />
                )}
                {propertyData.image_three_url && (
                  <img
                    onClick={() => handleImageChange("three")}
                    className="h-16 w-16 object-cover border border-gray-300 rounded cursor-pointer hover:border-green-500"
                    src={propertyData.image_three_url}
                    alt="Thumbnail Three"
                  />
                )}
                {propertyData.image_four_url && (
                  <img
                    onClick={() => handleImageChange("four")}
                    className="h-16 w-16 object-cover border border-gray-300 rounded cursor-pointer hover:border-green-500"
                    src={propertyData.image_four_url}
                    alt="Thumbnail Four"
                  />
                )}
              </div>
            </div>
            {/* Property Details */}
            <div className="flex-1 flex flex-col p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    fill="currentColor"
                  >
                    <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3 48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32c-17.7 0-32-14.3-32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                  </svg>
                  <div className="text-xl sm:text-2xl font-semibold text-gray-800">
                    {formatBudget(propertyData.budget)}
                  </div>
                </div>
                <button
                  onClick={() => navigate("/Property")}
                  className="p-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                    />
                  </svg>
                </button>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">
                {propertyData.name || "N/A"}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-2 text-base sm:text-lg">
                <span className="text-gray-600 font-semibold">
                  {propertyData.property_type || "N/A"}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-700">
                  {propertyData.city || "N/A"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {propertyData.bathrooms > 0 && (
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                    <img className="w-5 h-5" src={Bath} alt="Bath" />
                    <span className="font-semibold text-sm">
                      {propertyData.bathrooms} Baths
                    </span>
                  </div>
                )}
                {propertyData.bedrooms > 0 && (
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                    <img className="w-5 h-5" src={Bed} alt="Bed" />
                    <span className="font-semibold text-sm">
                      {propertyData.bedrooms} Beds
                    </span>
                  </div>
                )}
                {propertyData.kitchen > 0 && (
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                    <img className="w-5 h-5" src={Kitchen} alt="Kitchen" />
                    <span className="font-semibold text-sm">
                      {propertyData.kitchen} Kitchen
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setModalIsOpen(true)}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors mb-4"
              >
                Schedule a Visit
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`border border-gray-200 rounded-lg p-4 bg-gray-50 transition-all ${
                    showAllAmenities ? "min-h-[300px]" : "min-h-[150px]"
                  }`}
                >
                  <h3 className="font-semibold text-lg mb-2 text-green-800">
                    Amenities
                  </h3>
                  <div className="space-y-1">
                    {propertyData.amenities ? (
                      propertyData.amenities
                        .split("~-~")
                        .slice(0, showAllAmenities ? undefined : 5)
                        .map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <svg
                              className="w-2 h-2 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path
                                fill="currentColor"
                                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
                              />
                            </svg>
                            <span className="text-sm">{amenity.trim()}</span>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-gray-600">
                        No amenities listed
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-sm mt-2">
                      {propertyData.property_for && (
                        <span>
                          <strong>Property For:</strong>{" "}
                          {propertyData.property_for}
                        </span>
                      )}
                      {propertyData.built && (
                        <span>
                          <strong>Built Area:</strong> {propertyData.built}
                        </span>
                      )}
                      {propertyData.land && (
                        <span>
                          <strong>Land Area:</strong> {propertyData.land}
                        </span>
                      )}
                      {propertyData.bhk && (
                        <span>
                          <strong>BHK:</strong> {propertyData.bhk}
                        </span>
                      )}
                      {propertyData.services && (
                        <span>
                          <strong>Services:</strong> {propertyData.services}
                        </span>
                      )}
                    </div>
                    {propertyData.amenities?.split("~-~").length > 5 && (
                      <button
                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="text-green-600 text-sm font-semibold mt-2 hover:underline"
                      >
                        {showAllAmenities ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className={`border border-gray-200 rounded-lg p-4 bg-gray-50 transition-all ${
                    showAllDetails ? "min-h-[300px]" : "min-h-[150px]"
                  }`}
                >
                  <h3 className="font-semibold text-lg mb-2 text-green-800">
                    Property Details
                  </h3>
                  <div
                    className={`space-y-2 ${
                      !showAllDetails ? "max-h-[4.5rem] overflow-hidden" : ""
                    }`}
                  >
                    {propertyData.address && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          Address:
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {propertyData.address}, {propertyData.city}
                        </p>
                      </div>
                    )}
                    {propertyData.sqft && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          Area:
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {propertyData.sqft} {propertyData.measureUnit || ""}
                        </p>
                      </div>
                    )}
                    {propertyData.description && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          Description:
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {propertyData.description}
                        </p>
                      </div>
                    )}
                    {propertyData.property_type && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          Property Type:
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {propertyData.property_type}
                        </p>
                      </div>
                    )}
                  </div>
                  {(propertyData.description ||
                    propertyData.sqft ||
                    propertyData.address ||
                    propertyData.property_type) && (
                    <button
                      onClick={() => setShowAllDetails(!showAllDetails)}
                      className="text-green-600 text-sm font-semibold mt-2 hover:underline"
                    >
                      {showAllDetails ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Similar Properties Section */}
        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl uppercase font-semibold text-center text-green-800">
            <AnimatedText text="Other Similar Properties Near By" />
          </h2>
          {loader ? (
            <div className="flex justify-center items-center py-8">
              <svg
                className="animate-spin h-10 w-10 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM304 464a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"
                />
              </svg>
            </div>
          ) : similarProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {similarProperties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => {
                    const modifiedName =
                      property.name
                        ?.replace(/\s/g, "")
                        .replace(/[^\w\s]/g, "") || "";
                    navigate(`/property/-${property.id}-${modifiedName}`);
                    window.scrollTo(0, 0);
                  }}
                  className="shadow-lg cursor-pointer p-4 border bg-white rounded-lg hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      className="h-52 w-full object-cover rounded-lg"
                      src={property.image_one_url || ImageOne}
                      alt={property.name || "Property"}
                    />
                    <div className="absolute bottom-0 left-0 bg-[#d7dde5] text-[#303030] px-2 py-1 text-xs">
                      ID: {property.unique_id || "N/A"}
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-semibold text-base sm:text-lg text-green-800">
                      {property.name || "N/A"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        fill="currentColor"
                      >
                        <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                      </svg>
                      <span className="font-semibold text-sm text-green-600">
                        {formatBudget(property.budget)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <svg
                        className="h-4 w-4 text-green-800"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 384 512"
                      >
                        <path d="M215.7 499.2C267 435 384 64 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {property.address || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      {property.bathrooms > 0 && (
                        <div className="flex items-center gap-2">
                          <img className="w-5 h-5" src={Bath} alt="Bath" />
                          <span className="text-sm">{property.bathrooms}</span>
                        </div>
                      )}
                      {property.bedrooms > 0 && (
                        <div className="flex items-center gap-2">
                          <img className="w-5 h-5" src={Bed} alt="Bed" />
                          <span className="text-sm">{property.bedrooms}</span>
                        </div>
                      )}
                      {property.varifed && (
                        <div className="flex items-center gap-2">
                          <img
                            className="w-5 h-5"
                            src={property.varifed}
                            alt="Verified"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-6 text-sm text-gray-600">
              No properties found.
            </div>
          )}
        </div>
      </div>
      <OurServices />
      <Searching />
      <ToastContainer />
      <BottomBar />
    </>
  );
}
