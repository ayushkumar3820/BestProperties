import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../common/component/navbar";
import BottomBar from "../common/component/bottomBar";
import OurServices from "../common/component/ourServices";
import Searching from "../common/component/searching";
import ImageOne from "../assets/img/image-not.jpg";
import Bath from "../assets/img/bath.png";
import Bed from "../assets/img/bed.png";
import Kitchen from "../assets/img/kitchen.png";
import { liveUrl, token } from "../common/component/url";
import "../common/component/ModalPage.css";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

export default function RentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const propertyId = id?.split("-")[1];

  const [newData, setNewData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userInfoModal, setUserInfoModal] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [mainUrl, setMainUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    phone: "",
  });
  const [formData, setFormData] = useState({
    firstname: "",
    phone: "",
    property_id: propertyId,
    property_name: "",
    type: "rent",
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

  // Check login status and prefill user info
  useEffect(() => {
    const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const userName = sessionStorage.getItem("userName") || "";
    const userPhone = sessionStorage.getItem("phone") || "";
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

  // Fetch property details
  useEffect(() => {
    const handleFetch = async () => {
      setLoader(true);
      try {
        const response = await fetch(`${liveUrl}rent-details`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: propertyId }),
        });
        const data = await response.json();
        if (response.ok) {
          setNewData(data?.result?.rent || []);
          setMainUrl(data?.imgUrl || "");
          setFormData((prev) => ({
            ...prev,
            property_name: data?.result?.rent[0]?.name || "",
          }));
        } else {
          toast.error("Failed to fetch property details.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.");
        console.error("Error:", error);
      } finally {
        setLoader(false);
      }
    };
    handleFetch();
    window.scrollTo(0, 0);
  }, [propertyId]);

  // Form validation
  const validatePhoneNumber = (phone) => /^[0-9]{10}$/.test(phone);
  const validateName = (firstname) => {
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(firstname.trim());
  };

  const validateForm = () => {
    const newErrors = {
      firstname: "",
      phone: "",
      visitDate: "",
      visitTime: "",
    };
    let isValid = true;
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
    if (!formData.property_id) {
      toast.error("Property ID is missing.");
      isValid = false;
    }
    if (!formData.property_name.trim()) {
      toast.error("Property name is missing.");
      isValid = false;
    }
    if (userBookings[formData.phone]?.includes(formData.property_id)) {
      toast.error("You have already booked this property.");
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    try {
      const payload = {
        firstname: formData.firstname,
        phone: formData.phone,
        property_id: formData.property_id,
        property_name: formData.property_name,
        type: formData.type,
        visitDate: formData.visitDate?.toISOString(),
        visitTime: formData.visitTime?.toISOString(),
      };
      const response = await fetch(`${liveUrl}api/Contact/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        const meetingsResponse = await fetch(`${liveUrl}api/Buyer/scheduleVisit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const meetingsResult = await meetingsResponse.json();
        if (meetingsResponse.ok) {
          setUserBookings((prev) => ({
            ...prev,
            [formData.phone]: [...(prev[formData.phone] || []), formData.property_id],
          }));
          toast.success("Your visit has been scheduled successfully!");
          setFormData({
            firstname: isLoggedIn ? userInfo.firstname : "",
            phone: isLoggedIn ? userInfo.phone : "",
            property_id: propertyId,
            property_name: newData[0]?.name || "",
            type: "rent",
            visitDate: null,
            visitTime: null,
          });
          setModalIsOpen(false);
          setUserInfoModal(false);
        } else {
          toast.error(meetingsResult.message || "Failed to schedule meeting");
        }
      } else {
        if (result.message?.includes("already booked")) {
          toast.error("You have already booked this property.");
          setUserBookings((prev) => ({
            ...prev,
            [formData.phone]: [...(prev[formData.phone] || []), formData.property_id],
          }));
        } else {
          toast.error(result.message || "Failed to submit information.");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle user info submission for non-logged-in users
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

  // Handle Book Now button click
  const handleBookNow = () => {
    if (isLoggedIn) {
      setModalIsOpen(true);
    } else {
      setUserInfoModal(true);
    }
  };

  // Format budget
  const formatBudget = (value) => {
    if (!value) return "N/A";
    const numValue = Number(value);
    if (numValue >= 10000000)
      return `${(numValue / 10000000).toFixed(2)} Cr`;
    if (numValue >= 100000)
      return `${(numValue / 100000).toFixed(2)} Lac`;
    if (numValue >= 1000)
      return `${(numValue / 1000).toFixed(0)}K`;
    return numValue.toLocaleString();
  };

  const customModalStyles = {
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
      maxWidth: "400px",
      width: "90%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  const imageModalStyles = {
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
      display: "flex",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      zIndex: 999,
    },
  };

  return (
    <div>
      {/* Image Modal */}
      <Modal
        isOpen={imageModalOpen}
        onRequestClose={() => setImageModalOpen(false)}
        style={imageModalStyles}
      >
        <div className="relative flex justify-center items-center w-2/3">
          <button
            onClick={() => setImageModalOpen(false)}
            className="absolute top-3 right-3 bg-red-600 w-8 h-8 flex justify-center items-center rounded-md z-10"
            aria-label="Close image modal"
          >
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                fill="currentColor"
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
              />
            </svg>
          </button>
          <img
            className="h-[80vh] w-auto object-contain rounded"
            src={currentImage || ImageOne}
            alt="Property"
          />
        </div>
        {isLoggedIn && (
          <div className="w-1/3 bg-white p-4">
            <h2 className="font-bold text-xl text-green-800 mb-4">User Information</h2>
            <p className="text-lg font-semibold mb-2">
              Name: {userInfo.firstname}
            </p>
            <p className="text-lg font-semibold mb-2">
              Phone: {userInfo.phone}
            </p>
            <p className="text-lg font-semibold mb-2">
              Visit Date: {formData.visitDate ? formData.visitDate.toLocaleDateString() : "Not Scheduled"}
            </p>
            <p className="text-lg font-semibold mb-2">
              Visit Time: {formData.visitTime ? formData.visitTime.toLocaleTimeString() : "Not Scheduled"}
            </p>
          </div>
        )}
      </Modal>

      {/* User Information Modal */}
      <Modal
        isOpen={userInfoModal}
        onRequestClose={() => setUserInfoModal(false)}
        style={customModalStyles}
      >
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-2xl text-green-800">Book Now!</h2>
            <button
              onClick={() => setUserInfoModal(false)}
              className="bg-red-600 w-8 h-8 flex justify-center items-center rounded-md"
              aria-label="Close user info modal"
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

      {/* Booking Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setErrors({ firstname: "", phone: "", visitDate: "", visitTime: "" });
        }}
        style={customModalStyles}
      >
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-2xl text-green-800">Book Now!</h2>
            <button
              onClick={() => {
                setModalIsOpen(false);
                setErrors({ firstname: "", phone: "", visitDate: "", visitTime: "" });
              }}
              className="bg-red-600 w-8 h-8 flex justify-center items-center rounded-md"
              aria-label="Close booking modal"
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
          <form onSubmit={handleSubmit}>
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
                    disabled={isSubmitting}
                  />
                  {errors.firstname && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstname}</p>
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
                    disabled={isSubmitting}
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
                onChange={(date) => setFormData({ ...formData, visitDate: date })}
                minDate={new Date()}
                className="w-full h-12 border border-black rounded-lg py-3 px-4 focus:outline-none focus:border-green-500"
                placeholderText="Select a date"
                disabled={isSubmitting}
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
                onChange={(time) => setFormData({ ...formData, visitTime: time })}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="w-full h-12 border border-black rounded-lg py-3 px-4 focus:outline-none focus:border-green-500"
                placeholderText="Select a time"
                disabled={isSubmitting}
                popperPlacement="bottom"
              />
              {errors.visitTime && (
                <p className="text-red-600 text-sm mt-1">{errors.visitTime}</p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Schedule Visit"}
            </button>
          </form>
        </div>
      </Modal>

      <Navbar />
      <div className="container mx-auto px-2 mt-5 mb-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-5">
            {loader ? (
              <div className="flex justify-center items-center p-2 h-full">
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
            ) : (
              <>
                {newData.map((panel) => (
                  <div key={panel.id} className="mb-4">
                    <img
                      onClick={() => {
                        setImageModalOpen(true);
                        setCurrentImage(panel.image_one ? `${mainUrl}${panel.image_one}` : ImageOne);
                      }}
                      className="w-full border rounded-lg cursor-pointer h-[200px] sm:h-[300px] mb-2 object-cover"
                      src={panel.image_one ? `${mainUrl}${panel.image_one}` : ImageOne}
                      alt="Main property"
                    />
                    <div className="flex gap-2">
                      {panel.image_two && (
                        <img
                          onClick={() => {
                            setImageModalOpen(true);
                            setCurrentImage(`${mainUrl}${panel.image_two}`);
                          }}
                          className="w-1/3 border rounded-lg cursor-pointer h-[75px] object-cover"
                          src={`${mainUrl}${panel.image_two}`}
                          alt="Property image 2"
                        />
                      )}
                      {panel.image_three && (
                        <img
                          onClick={() => {
                            setImageModalOpen(true);
                            setCurrentImage(`${mainUrl}${panel.image_three}`);
                          }}
                          className="w-1/3 border rounded-lg cursor-pointer h-[75px] object-cover"
                          src={`${mainUrl}${panel.image_three}`}
                          alt="Property image 3"
                        />
                      )}
                      {panel.image_four && (
                        <img
                          onClick={() => {
                            setImageModalOpen(true);
                            setCurrentImage(`${mainUrl}${panel.image_four}`);
                          }}
                          className="w-1/3 border rounded-lg cursor-pointer h-[75px] object-cover"
                          src={`${mainUrl}${panel.image_four}`}
                          alt="Property image 4"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="col-span-12 sm:col-span-7">
            {loader ? (
              <div className="flex justify-center items-center p-2 h-full">
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
            ) : (
              <>
                {newData.map((panel) => (
                  <div key={panel.id} className="px-2 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-xl sm:text-2xl font-semibold text-green-800 underline">
                        {panel.name || "N/A"}
                      </h1>
                      <div
                        onClick={() => navigate("/for-rent")}
                        className="p-2 cursor-pointer rounded-md bg-red-600 flex justify-center items-center"
                        aria-label="Close property details"
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
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        fill="currentColor"
                      >
                        <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                      </svg>
                      <span className="font-bold text-lg sm:text-xl ml-2">
                        {formatBudget(panel.budget)} Rent Per Month
                      </span>
                      {panel.sqft > 0 && (
                        <span className="font-semibold text-sm sm:text-lg ml-2">
                          | {panel.sqft} {panel.measureUnit} sq.ft.
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-5 px-2">
                      <div className="leading-1">
                        <div className="text-lg font-semibold text-green-800">
                          {panel.property_type || "N/A"}
                        </div>
                        {panel.prefer && (
                          <div className="text-lg font-semibold capitalize">
                            Prefer: {panel.prefer}
                          </div>
                        )}
                        {panel.property_status && (
                          <div className="text-lg capitalize">
                            Status: {panel.property_status}
                          </div>
                        )}
                        {panel.sector && (
                          <div className="text-lg font-semibold text-green-800">
                            Sector: {panel.sector}
                          </div>
                        )}
                        {panel.floor && (
                          <div className="text-lg font-semibold text-green-800">
                            Floor: {panel.floor}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3 mt-4">
                          {panel.bathrooms > 0 && (
                            <div className="flex items-center gap-2 bg-slate-200 p-2 rounded-lg">
                              <img className="w-6 h-6" src={Bath} alt="Bathroom icon" />
                              <span className="font-bold">{panel.bathrooms} Baths</span>
                            </div>
                          )}
                          {panel.bedrooms > 0 && (
                            <div className="flex items-center gap-2 bg-slate-200 p-2 rounded-lg">
                              <img className="w-6 h-6" src={Bed} alt="Bedroom icon" />
                              <span className="font-bold">{panel.bedrooms} Beds</span>
                            </div>
                          )}
                          {panel.kitchen > 0 && (
                            <div className="flex items-center gap-2 bg-slate-200 p-2 rounded-lg">
                              <img className="w-6 h-6" src={Kitchen} alt="Kitchen icon" />
                              <span className="font-bold">{panel.kitchen} Kitchen</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleBookNow}
                        className="bg-red-600 p-2 mt-4 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Book Now!
                      </button>
                      <div className="mt-4 mb-4">
                        <div className="p-4 border rounded-lg bg-gray-50">
                          {panel.amenities && (
                            <div className="mb-4">
                              <h3 className="font-bold text-lg text-green-800">Amenities:</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                {panel.amenities.split("~-~").map((amenity, index) => (
                                  <div className="flex items-center gap-1" key={index}>
                                    <svg
                                      className="w-2 h-2 text-green-600"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 512 512"
                                      fill="currentColor"
                                    >
                                      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
                                    </svg>
                                    <span className="text-sm">{amenity.trim()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="space-y-2">
                            {panel.address && (
                              <div className="flex gap-2">
                                <span className="font-semibold">Address:</span>
                                <span className="font-normal">{panel.address}</span>
                              </div>
                            )}
                            {panel.sqft && panel.measureUnit && (
                              <div className="flex gap-2">
                                <span className="font-semibold">Area:</span>
                                <span className="font-normal">
                                  {panel.sqft} {panel.measureUnit}
                                </span>
                              </div>
                            )}
                            {panel.description && (
                              <div>
                                <span className="font-semibold">Description:</span>
                                <p className="font-normal text-sm leading-relaxed mt-1">
                                  {panel.description}
                                </p>
                              </div>
                            )}
                            {panel.security_deposite && (
                              <div className="flex gap-2">
                                <span className="font-semibold">Security Deposit:</span>
                                <span className="font-normal">{panel.security_deposite}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {newData.length === 0 && (
                  <div className="text-center font-semibold text-xl text-gray-800">
                    No Data Found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <OurServices />
      <Searching />
      <ToastContainer />
      <BottomBar />
    </div>
  );
}
