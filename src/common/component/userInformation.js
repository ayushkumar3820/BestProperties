import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [formData, setFormData] = useState({
    firstname: "",
    phone: "",
    visitDate: null,
    visitTime: null,
  });
  const [errors, setErrors] = useState({
    firstname: "",
    phone: "",
    visitDate: "",
    visitTime: "",
  });
  const [userBookings, setUserBookings] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    phone: "",
  });
  const [userInfoModal, setUserInfoModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = [
    propertyData?.image_one_url,
    propertyData?.image_two_url,
    propertyData?.image_three_url,
    propertyData?.image_four_url,
  ].filter(Boolean);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

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
      width: "400px",
    },
  };

  // Check login status and localStorage for user info
  useEffect(() => {
    const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const userName = sessionStorage.getItem("userName") || "";
    const userPhone = sessionStorage.getItem("phone") || "";
    console.log("Checking login status:", {
      storedIsLoggedIn,
      userName,
      userPhone,
    });

    if (storedIsLoggedIn && userPhone) {
      setIsLoggedIn(true);
      setUserInfo({
        firstname: userName,
        phone: userPhone,
      });
      setFormData((prev) => ({
        ...prev,
        firstname: userName,
        phone: userPhone,
      }));
    }
  }, []);

  // Fetch random properties
  const fetchRandomProperties = async () => {
    try {
      const response = await fetch(`${liveUrl}api/Reactjs/gallery`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const properties = data?.result || [];
      const filteredProperties = properties
        .filter((prop) => prop.id !== propertyId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setSimilarProperties(filteredProperties);
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
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setPropertyData(data?.result?.main_property?.[0] || null);
        const additionalProperties = data?.result?.additional_properties || [];
        if (additionalProperties.length > 0) {
          setSimilarProperties(additionalProperties);
        } else {
          await fetchRandomProperties();
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property data");
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
  const validateName = (firstname) => /^[a-zA-Z\s]{2,}$/.test(firstname.trim());

  const validateForm = () => {
    const newErrors = {
      firstname: "",
      phone: "",
      visitDate: "",
      visitTime: "",
    };
    let isValid = true;
    console.log("Validating form:", { formData, isLoggedIn });

    if (!isLoggedIn) {
      if (!formData.firstname.trim()) {
        newErrors.firstname = "Please enter your name";
        isValid = false;
      } else if (!validateName(formData.firstname)) {
        newErrors.firstname = "Name must be letters only, min 2 characters";
        isValid = false;
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Please enter your phone number";
        isValid = false;
      } else if (!validatePhoneNumber(formData.phone)) {
        newErrors.phone = "Enter a valid 10-digit phone number";
        isValid = false;
      }
    }

    if (!formData.visitDate) {
      newErrors.visitDate = "Please select a visit date";
      isValid = false;
    }
    if (!formData.visitTime) {
      newErrors.visitTime = "Please select a visit time";
      isValid = false;
    }

    if (userBookings[formData.phone]?.includes(propertyId)) {
      toast.error("You have already booked this property.");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form submission
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (!validateForm()) {
      setLoader(false);
      return;
    }
    const userId = sessionStorage.getItem("userId");
    try {
      const payload = {
        firstname: formData.firstname,
        phone: formData.phone,
        property_id: propertyId,
        Userid:userId,
        property_name: propertyData?.name || "N/A",
        type: "properties",
        visitDate: formData.visitDate?.toISOString(),
        visitTime: formData.visitTime?.toISOString(),
      };

      console.log("Submitting form with payload:", payload);

      // Submit to the contact API
      const contactResponse = await fetch(`${liveUrl}api/Contact/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const contactResult = await contactResponse.json();

      if (contactResponse.ok) {
        // Submit to the meetings API
        const meetingsResponse = await fetch(
          `${liveUrl}api/Buyer/scheduleVisit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const meetingsResult = await meetingsResponse.json();

        if (meetingsResponse.ok) {
          setUserBookings((prev) => ({
            ...prev,
            [formData.phone]: [...(prev[formData.phone] || []), propertyId],
          }));

          toast.success("Your visit has been scheduled successfully!");
          setFormData({
            firstname: isLoggedIn ? userInfo.firstname : "",
            phone: isLoggedIn ? userInfo.phone : "",
            visitDate: null,
            visitTime: null,
          });
          setModalIsOpen(false);
          setUserInfoModal(false);
        } else {
          toast.error(meetingsResult.message || "Failed to schedule meeting");
        }
      } else {
        if (contactResult.message?.includes("already booked")) {
          toast.error("You have already booked this property.");
          setUserBookings((prev) => ({
            ...prev,
            [formData.phone]: [...(prev[formData.phone] || []), propertyId],
          }));
        } else {
          toast.error(contactResult.message || "Failed to schedule visit");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error submitting form:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (!validateName(userInfo.firstname)) {
      toast.error("Name must be letters only, min 2 characters");
      return;
    }
    if (!validatePhoneNumber(userInfo.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    sessionStorage.setItem("userName", userInfo.firstname);
    sessionStorage.setItem("phone", userInfo.phone);
    sessionStorage.setItem("isLoggedIn", "true");
    setUserInfoModal(false);
    setFormData((prev) => ({
      ...prev,
      firstname: userInfo.firstname,
      phone: userInfo.phone,
    }));
    setIsLoggedIn(true);
    setModalIsOpen(true);
  };

  // Handle Schedule a Visit button click
  const handleScheduleVisit = () => {
    console.log("Opening schedule visit, isLoggedIn:", isLoggedIn);
    if (isLoggedIn) {
      setModalIsOpen(true);
    } else {
      setUserInfoModal(true);
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
    if (numValue >= 10000000)
      return `${(numValue / 10000000).toFixed(2)} Crore`;
    if (numValue >= 100000) return `${(numValue / 100000).toFixed(2)} Lac`;
    if (numValue >= 1000) return `${(numValue / 1000).toFixed(2)} Thousand`;
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
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "90%",
            maxHeight: "90%",
            overflow: "hidden",
            padding: 0,
            backgroundColor: "#fff",
            borderRadius: "10px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 999,
          },
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setImageModal(false)}
            className="absolute top-3 right-3 bg-red-600 w-8 h-8 flex justify-center items-center rounded-md z-10"
          >
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                fill="currentColor"
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 
              86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 
              256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 
              45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 
              45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
              />
            </svg>
          </button>

          {/* Left arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 bg-white bg-opacity-80 p-2 rounded-full shadow z-10"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Image */}
          <img
            className="h-[80vh] w-auto object-contain rounded"
            src={imageList[currentIndex] || ImageOne}
            alt={`Property ${currentIndex + 1}`}
          />

          {/* Right arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 bg-white bg-opacity-80 p-2 rounded-full shadow z-10"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Image counter */}
        <div className="text-center text-sm text-gray-600 py-2">
          {currentIndex + 1} / {imageList.length}
        </div>
      </Modal>

      {/* User Information Modal */}
      <Modal
        isOpen={userInfoModal}
        onRequestClose={() => setUserInfoModal(false)}
        style={modalStyles}
      >
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-2xl text-green-800">
              Schedule a Visit
            </h2>
            <button
              onClick={() => setUserInfoModal(false)}
              className="bg-red-600 w-8 h-8 flex justify-center items-center rounded-md"
            >
              <svg
                className="w-5 h-5 text-white"
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
          <form onSubmit={handleUserInfoSubmit}>
            <div className="mb-4">
              <label className="text-lg font-semibold mb-2 block text-gray-800">
                Your Name*
              </label>
              <input
                className="w-full h-12 border border-black rounded-lg py-3 px-4 focus:outline-none focus:border-green-500"
                name="firstname"
                value={userInfo.firstname}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, firstname: e.target.value })
                }
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-lg font-semibold mb-2 block text-gray-800">
                Phone Number*
              </label>
              <input
                type="tel"
                name="phone"
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, phone: e.target.value })
                }
                className="w-full h-12 border border-black rounded-lg py-3 px-4 focus:outline-none focus:border-green-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </Modal>

      {/* Schedule Visit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={modalStyles}
      >
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-2xl text-green-800">
              Schedule a Visit
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
                  d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmitForm}>
            {!isLoggedIn && (
              <>
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
                    placeholder="Enter your name"
                    required
                  />
                  {errors.firstname && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.firstname}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="text-lg font-semibold mb-2 block text-gray-800">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full h-12 border border-black rounded-lg py-3 px-4 focus:outline-none focus:border-green-500"
                    placeholder="Enter your phone number"
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="text-lg font-semibold mb-2 block text-gray-800">
                Visit Date*
              </label>
              <DatePicker
                selected={formData.visitDate}
                onChange={(date) =>
                  setFormData({ ...formData, visitDate: date })
                }
                minDate={new Date()}
                className="w-full h-12 border border-black rounded-lg py-3 px-4 focus:outline-none focus:border-green-500"
                placeholderText="Select a date"
                disabled={loader}
                popperPlacement="bottom"
              />
              {errors.visitDate && (
                <p className="text-red-600 text-sm mt-1">{errors.visitDate}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="text-lg font-semibold mb-2 block text-gray-800">
                Visit Time*
              </label>
              <DatePicker
                selected={formData.visitTime}
                onChange={(time) =>
                  setFormData({ ...formData, visitTime: time })
                }
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="w-full h-12 border border-black rounded-lg py-3 px-4 focus:outline-none focus:border-green-500"
                placeholderText="Select a time"
                disabled={loader}
                popperPlacement="bottom"
              />
              {errors.visitTime && (
                <p className="text-red-600 text-sm mt-1">{errors.visitTime}</p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors ${
                loader ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loader}
            >
              {loader ? "Submitting..." : "Schedule Visit"}
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
                d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"
              />
            </svg>
          </div>
        ) : !propertyData ? (
          <div className="text-center font-semibold text-xl text-gray-800">
            No Property Data Found
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 rounded-lg p-4 bg-white shadow-sm">
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
            <div className="flex-1 flex flex-col p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    fill="currentColor"
                  >
                    <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
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
                onClick={handleScheduleVisit}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors mb-4"
              >
                Schedule a Visit
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`border border-gray-200 rounded-lg p-4 bg-gray-50 transition-all ${
                    showAllAmenities ? "min-h-[400px]" : "min-h-[150px]"
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
                      !showAllDetails ? "max-h-[5.5rem] overflow-hidden" : ""
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
