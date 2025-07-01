/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../common/component/ModalPage.css";
import { useNavigate, useParams } from "react-router-dom";
import ImageOne from "../assets/img/image-not.jpg";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import OurServices from "../common/component/ourServices";
import Searching from "../common/component/searching";
import Bath from "../assets/img/bath.png";
import Bed from "../assets/img/bed.png";
import Kitchen from "../assets/img/kitchen.png";
import { liveUrl, token } from "../common/component/url";
import Navbar from "../common/component/navbar";
import BottomBar from "../common/component/bottomBar";

export default function RentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const propertyId = id?.split("-")[1];
  const [newData, setNewData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainUrl, setMainUrl] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    phone: "",
    property_id: propertyId,
    property_name: "",
    type: "rent",
  });
  const [errors, setErrors] = useState({ firstname: "", phone: "" });
  const [userBookings, setUserBookings] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    handleFetch();
  }, []);

  useEffect(() => {
    if (newData.length > 0) {
      setFormData((prev) => ({
        ...prev,
        property_name: newData[0]?.name || "",
        type: "rent",
      }));
    }
  }, [newData]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateName = (firstname) => {
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(firstname.trim());
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { firstname: "", phone: "" };

    if (!formData.firstname.trim()) {
      newErrors.firstname = "Please enter your name";
      isValid = false;
    } else if (!validateName(formData.firstname)) {
      newErrors.firstname = "Name must contain only letters and be at least 2 characters long";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
      isValid = false;
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
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
    if (!formData.type.trim()) {
      toast.error("Property type is missing.");
      isValid = false;
    }

    if (userBookings[formData.phone]?.includes(formData.property_id)) {
      toast.error("You have already booked this property.");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${liveUrl}api/Contact/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          phone: formData.phone,
          property_id: formData.property_id,
          property_name: formData.property_name,
          type: formData.type,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setUserBookings((prev) => ({
          ...prev,
          [formData.phone]: [...(prev[formData.phone] || []), formData.property_id],
        }));
        toast.success("Your information has been submitted successfully!");
        setFormData({
          firstname: "",
          phone: "",
          property_id: propertyId,
          property_name: newData[0]?.name || "",
          type:  "rent",
        });
        setModalIsOpen(false);
      } else {
        if (result.message.includes("already booked")) {
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

  const customModalStyles = {
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

  return (
    <div>
      <Modal
        isOpen={imageModalOpen}
        onRequestClose={() => setImageModalOpen(false)}
        style={customModalStyles}
      >
        <div className="flex justify-end">
          <svg
            onClick={() => setImageModalOpen(false)}
            fill="red"
            className="w-10 h-10 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            aria-label="Close image modal"
          >
            <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm79 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
          </svg>
        </div>
        <div className="flex justify-center max-h-[350px] items-center">
          <img
            className="image_slider max-h-[300px] bg-cover bg-no-repeat border rounded-lg"
            src={currentImage}
            alt="Property"
          />
        </div>
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setErrors({ firstname: "", phone: "" });
        }}
        style={customModalStyles}
      >
        <div className="lg:w-[400px] w-full">
          <div className="flex justify-center items-center relative">
            <div className="font-bold text-2xl text-green-800">Book Now!</div>
            <button
              onClick={() => {
                setModalIsOpen(false);
                setErrors({ firstname: "", phone: "" });
              }}
              className="bg-red-600 absolute top-0 right-0 w-8 h-8 flex justify-center items-center"
              aria-label="Close booking modal"
            >
              <svg
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 384 512"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </button>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="w-full mt-4">
              <label className="block tracking-wide text-lg font-bold mb-2">
                Your Name*
              </label>
              <input
                type="text"
                name="firstname"
                placeholder="Enter Your Name"
                className="appearance-none outline-none block w-full h-12 border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={formData.firstname}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              {errors.firstname && (
                <p className="text-red-600" style={{ fontSize: "18px" }}>
                  {errors.firstname}
                </p>
              )}
            </div>
            <div className="w-full mt-4">
              <label className="block tracking-wide text-lg font-bold mb-2">
                Phone*
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your Number"
                className="appearance-none outline-none block w-full h-12 border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-red-600" style={{ fontSize: "18px" }}>
                  {errors.phone}
                </p>
              )}
            </div>
            <button
              type="submit"
              className={`bg-red-600 w-full text-white text-lg p-2 ${
                isSubmitting ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Your Information"}
            </button>
          </form>
        </div>
      </Modal>

      <Navbar />

      <div className="container mx-auto px-2 mt-5 mb-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            {loader ? (
              <div className="flex justify-center items-center p-2 h-full">
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
            ) : (
              <>
                {newData.map((panel) => (
                  <div key={panel.id} className="mb-4">
                    <img
                      onClick={() => {
                        setImageModalOpen(true);
                        setCurrentImage(panel.image_one ? `${mainUrl}${panel.image_one}` : ImageOne);
                      }}
                      className="image_slider w-full border rounded-lg cursor-pointer h-[150px] mb-2"
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
                          className="w-1/3 border rounded-lg cursor-pointer h-[75px]"
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
                          className="w-1/3 border rounded-lg cursor-pointer h-[75px]"
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
                          className="w-1/3 border rounded-lg cursor-pointer h-[75px]"
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

          <div className="col-span-7">
            {loader ? (
              <div className="flex justify-center items-center p-2 h-full">
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
            ) : (
              <>
                {newData.map((panel) => (
                  <div key={panel.id}>
                    <div className="px-2 py-2">
                      <div className="text-green-800 font-bold ml-2 mb-2 underline lg:text-xl text-md">
                        {panel.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                          >
                            <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                          </svg>
                          <div className="flex">
                            <div className="font-bold lg:text-xl text-md">
                              {formatBudget(panel.budget)} Rent Per Month
                            </div>
                          </div>
                          <div className="font-semibold lg:text-lg ml-2 text-sm">
                            {panel.sqft > 0 ? `| ${panel.sqft} ${panel.measureUnit} sq.ft.` : ""}
                          </div>
                        </div>
                        <div
                          onClick={() => navigate("/for-rent")}
                          className="p-1 cursor-pointer rounded-md h-10 w-10 bg-red-600 flex justify-center items-center"
                          aria-label="Close property details"
                        >
                          <svg
                            fill="white"
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 384 512"
                          >
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                          </svg>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-5 px-2">
                        <div className="leading-1">
                          <div className="flex items-center">
                            <div className="text-lg font-leading text-green-800">
                              {panel.property_type}
                            </div>
                          </div>
                          <div className="text-lg text-leading capitalize font-bold">
                            {panel.prefer}
                          </div>
                          <div className="text-lg text-leading capitalize">
                            {panel.property_status}
                          </div>
                          <div className="text-lg font-semibold font-leading text-green-800">
                            Sector: {panel.sector}
                          </div>
                          <div className="text-lg font-semibold font-leading text-green-800">
                            {panel.floor}
                          </div>
                          <div className="flex mb-2 items-center p-2 lg:gap-3 gap-3 mt-4">
                            {panel.bathrooms > 0 && (
                              <div className="flex items-center gap-2 bg-slate-200 p-2">
                                <img className="w-10 h-10" src={Bath} alt="Bathroom icon" />
                                <div className="font-bold">{panel.bathrooms} Baths</div>
                              </div>
                            )}
                            {panel.bedrooms > 0 && (
                              <div className="flex items-center gap-2 bg-slate-200 p-2">
                                <img className="w-6" src={Bed} alt="Bedroom icon" />
                                <div className="font-bold">{panel.bedrooms} Beds</div>
                              </div>
                            )}
                            {panel.kitchen > 0 && (
                              <div className="flex items-center gap-2 bg-slate-200 p-2">
                                <img className="w-6" src={Kitchen} alt="Kitchen icon" />
                                <div className="font-bold">{panel.kitchen} Kitchen</div>
                              </div>
                            )}
                            {panel.verified && (
                              <div className="flex gap-2 items-center">
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setModalIsOpen(true)}
                          className="bg-red-600 p-2 mt-4 ml-2 text-white font-bold mb-2 rounded"
                        >
                          Book Now!
                        </button>
                        <div className="mt-4 mb-4">
                          <div className="p-2 border">
                            {panel.amenities && (
                              <div className="mt-4">
                                <div className="font-bold leading-5">Amenities:</div>
                                <div className="flex gap-2 mt-2">
                                  <div className="text-md leading-2 text-black font-leading">
                                    <div className="grid grid-cols-2">
                                      {panel.amenities.split("~-~").map((amenity, index) => (
                                        <div className="flex items-center gap-1" key={index}>
                                          <svg
                                            fill="green"
                                            className="w-2 h-2"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 512 512"
                                          >
                                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
                                          </svg>
                                          <div>{amenity}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div>
                              <div className="flex gap-1">
                                <div className="font-semibold">Address:</div>
                                <div className="font-normal">{panel.address}</div>
                              </div>
                              {panel.measureUnit && (
                                <div className="flex gap-32 mt-1">
                                  <div className="font-semibold">Area:</div>
                                  <div className="font-normal">
                                    {panel.sqft} {panel.measureUnit}
                                  </div>
                                </div>
                              )}
                              {panel.description?.length > 0 && (
                                <div className="flex mt-3">
                                  <div className="text-md leading-2 font-normal">
                                    {panel.description}
                                  </div>
                                </div>
                              )}
                              <div className="flex gap-2 items-center">
                                <div className="font-bold">Security Deposit:</div>
                                <div className="font-normal">{panel.security_deposite}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {newData.length === 0 && (
                  <div className="text-center font-bold">No Data Found</div>
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