import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import './ModalPage.css';
import BottomBar from "./bottomBar";
import { useNavigate, useParams } from "react-router-dom";
import ImageOne from "../../assets/img/image-not.jpg";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Added for toast styling
import AnimatedText from "./HeadingAnimation";
import { liveUrl, token } from "./url";
import Bed from "../../assets/img/bed.png";
import Bath from "../../assets/img/bath.png";
import Kitchen from "../../assets/img/kitchen.png";
import OurServices from "./ourServices";
import Searching from "./searching";

export default function UserInformation() {
  const Navigate = useNavigate();
  let params = useParams();
  const id = params?.id.split("-")[1];
  const [newData, setNewData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [imageShow, setImageShow] = useState(false);
  const [imageShowTwo, setImageShowTwo] = useState(false);
  const [imageShowThree, setImageShowThree] = useState(false);
  const [show, setShow] = useState(false);
  const [main, setMain] = useState(true);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({ firstname: '', phone: '' });
  const [errors, setErrors] = useState({ firstname: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShowMore = () => {
    setShow(!show);
  };

  const handleImageShow = () => {
    setImageShow(true);
    setImageShowTwo(false);
    setImageShowThree(false);
    setMain(false);
  };

  const handleImageShowTwo = () => {
    setImageShowTwo(true);
    setImageShowThree(false);
    setImageShow(false);
    setMain(false);
  };

  const handleImageShowThree = () => {
    setImageShowThree(true);
    setImageShowTwo(false);
    setImageShow(false);
    setMain(false);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { firstname: '', phone: '' };

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'Please enter your name';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
      isValid = false;
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${liveUrl}api/Contact/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Your information has been submitted successfully!');
        setFormData({ firstname: '', phone: '' });
        setModalIsOpen(false);
      } else {
        toast.error(result.message || 'Failed to submit information. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    setLoader(true);
    fetch(`${liveUrl}api/PropertyDetail/propertyAllDetails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoader(false);
        setNewData(data?.result.main_property);
        setPropertyData(data?.result.additional_properties);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoader(false);
      });
  };

  useEffect(() => {
    handleSubmit();
    window.scrollTo(0, 0);
  }, []);

  const custom = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      backgroundColor: "white",
    },
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
        (value / 1000).toLocaleString(undefined, { minimumFractionDigits: 2 }) +
        " Thousand"
      );
    } else {
      return formattedValue;
    }
  };

  return (
    <div>
      <Modal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={custom}
      >
        <div className="flex justify-end">
          <svg
            onClick={() => setModal(false)}
            fill="red"
            className="w-10 h-10 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 -FontAwesomeIcon-512"
          >
            <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm79 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
          </svg>
        </div>
        <div className="flex justify-center mx-h-[400px] items-center">
          {newData.map((panel) => (
            <div key={panel.id}>
              {main ? (
                <img
                  style={{ cursor: "pointer", gap: "10px" }}
                  className="image_slider max-h-[600px] bg-cover bg-no-repeat border border-green-800 cursor-pointer"
                  src={panel.image_one_url || ImageOne}
                  alt="Property"
                />
              ) : (
                <>
                  {imageShow && panel.image_two_url && (
                    <img
                      style={{ cursor: "pointer", gap: "10px" }}
                      className="image_slider bg-no-repeat max-h-[600px] bg-cover border border-green-800 cursor-pointer"
                      src={panel.image_two_url}
                      alt="Property"
                    />
                  )}
                  {imageShowTwo && panel.image_three_url && (
                    <img
                      style={{ cursor: "pointer", gap: "10px" }}
                      className="image_slider bg-no-repeat max-h-[600px] bg-cover border border-green-800 cursor-pointer"
                      src={panel.image_three_url}
                      alt="Property"
                    />
                  )}
                  {imageShowThree && panel.image_four_url && (
                    <img
                      style={{ cursor: "pointer", gap: "10px" }}
                      className="image_slider bg-no-repeat max-h-[600px] bg-cover cursor-pointer"
                      src={panel.image_four_url}
                      alt="Property"
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={custom}
      >
        <div className="lg:w-[400px] w-full">
          <div className="flex justify-between items-center">
            <div className="font-bold text-2xl text-green-800">Contact Owner</div>
            <button
              onClick={() => setModalIsOpen(false)}
              className="bg-red-600 w-8 h-8 flex justify-center items-center"
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
          <form onSubmit={handleSubmitForm} className="mt-4">
            <div className="w-full">
              <label className="block tracking-wide text-lg font-bold mb-2">
                Your Name
              </label>
              <input
                className="appearance-none outline-none block w-full h-12 border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                placeholder="Please enter your name"
              />
              {errors.firstname && (
                <div className="text-red-600">{errors.firstname}</div>
              )}
            </div>
            <div className="w-full mt-4">
              <label className="block tracking-wide text-lg font-bold mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="appearance-none outline-none block w-full h-12 border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Please enter your phone number"
              />
              {errors.phone && (
                <div className="text-red-600">{errors.phone}</div>
              )}
            </div>
            <button
              type="submit"
              className={`bg-red-600 w-full text-white text-lg p-2 ${
                isSubmitting ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </Modal>
      <Navbar />
      <div className="container mx-auto px-2 mt-5 mb-4">
        <div className="grid lg:grid-cols-1 lg:px-10 px-4 rounded-md border gap-4">
          <div className="px-2">
            <div className="mb-10">
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
              ) : (
                <>
                  {newData?.map((panel) => (
                    <div key={panel.id}>
                      <div className="px-2 py-2">
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
                                {formatBudget(panel.budget)}
                              </div>
                            </div>
                            <div className="font-semibold lg:text-lg ml-2 text-sm">
                              {panel.sqft > 0 ? ` | ${panel.sqft} ${panel.measureUnit}` : ""}
                            </div>
                          </div>
                          <div
                            onClick={() => Navigate("/Property")}
                            className="p-1 cursor-pointer rounded-md h-10 w-10 bg-red-600 flex justify-center items-center"
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
                      </div>
                      <div className="text-green-800 font-bold ml-2 mb-2 underline lg:text-xl text-md">
                        {panel.name}
                      </div>
                      <div className="grid lg:grid-cols-3 gap-5 px-2">
                        <div>
                          <div className="flex h-1/1 max-w-[400px] relative rounded-md items-center">
                            {main ? (
                              <img
                                onClick={() => setModal(true)}
                                style={{ cursor: "pointer", gap: "10px" }}
                                className="image_slider w-1/1 border border-green-800 cursor-pointer"
                                src={panel.image_one_url || ImageOne}
                                alt="Property"
                              />
                            ) : (
                              <>
                                {imageShow && panel.image_two_url && (
                                  <img
                                    onClick={() => setModal(true)}
                                    style={{ cursor: "pointer", gap: "10px" }}
                                    className="image_slider w-1/1 border border-green-800 cursor-pointer"
                                    src={panel.image_two_url}
                                    alt="Property"
                                  />
                                )}
                                {imageShowTwo && panel.image_three_url && (
                                  <img
                                    onClick={() => setModal(true)}
                                    style={{ cursor: "pointer", gap: "10px" }}
                                    className="image_slider w-1/1 border border-green-800 cursor-pointer"
                                    src={panel.image_three_url}
                                    alt="Property"
                                  />
                                )}
                                {imageShowThree && panel.image_four_url && (
                                  <img
                                    onClick={() => setModal(true)}
                                    style={{ height: "400px", width: "400px", cursor: "pointer", gap: "10px" }}
                                    className="image_slider w-24 cursor-pointer"
                                    src={panel.image_four_url}
                                    alt="Property"
                                  />
                                )}
                              </>
                            )}
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "row", marginTop: "6px", gap: "4px" }}
                            className="cursor-pointer"
                          >
                            {panel.image_two_url && (
                              <img
                                onClick={handleImageShow}
                                style={{ height: "100px", width: "100px", cursor: "pointer", gap: "10px" }}
                                className="w-24 cursor-pointer"
                                src={panel.image_two_url}
                                alt="Property"
                              />
                            )}
                            {panel.image_three_url && (
                              <img
                                onClick={handleImageShowTwo}
                                style={{ height: "100px", width: "100px", cursor: "pointer", gap: "10px" }}
                                className="w-24 cursor-pointer"
                                src={panel.image_three_url}
                                alt="Property"
                              />
                            )}
                            {panel.image_four_url && (
                              <img
                                onClick={handleImageShowThree}
                                style={{ height: "100px", width: "100px", cursor: "pointer", gap: "10px" }}
                                className="w-24 cursor-pointer"
                                src={panel.image_four_url}
                                alt="Property"
                              />
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1">
                          <div className="leading-1">
                            <div className="flex items-center">
                              <div className="text-lg ml-2 font-leading text-green-800">
                                {panel.property_type}
                              </div>
                              <div className="text-lg text-leading">/{panel.city}</div>
                            </div>
                            <div className="flex mb-2 items-center p-2 lg:gap-3 gap-3 mt-4">
                              {panel.bathrooms ? (
                                <div className="flex items-center gap-2 bg-slate-200 p-2">
                                  {panel.bedrooms < 1 ? null : <img className="w-6" src={Bath} alt="Bath" />}
                                  <div className="font-bold">{panel.bathrooms} Baths</div>
                                </div>
                              ) : null}
                              {panel.bedrooms ? (
                                <div className="flex items-center gap-2 bg-slate-200 p-2">
                                  {panel.bathrooms < 1 ? null : <img className="w-6" src={Bed} alt="Bed" />}
                                  <div className="font-bold">{panel.bedrooms} Beds</div>
                                </div>
                              ) : null}
                              {panel.kitchen ? (
                                <div className="flex items-center gap-2 bg-slate-200 p-2">
                                  {panel.kitchen < 1 ? null : <img className="w-6" src={Kitchen} alt="Kitchen" />}
                                  <div className="font-bold">{panel.kitchen} Kitchen</div>
                                </div>
                              ) : null}
                              <div className="flex gap-2 items-center">
                                <img className="w-5" src={panel.varifed} alt="Verified" />
                              </div>
                            </div>
                            {panel.amenities && (
                              <>
                                <div className="font-bold leading-5 mt-4">Amenities:</div>
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
                              </>
                            )}
                            <button
                              onClick={() => setModalIsOpen(true)}
                              className="bg-red-600 p-2 mt-4 ml-2 text-white font-bold mb-2 rounded"
                            >
                              Contact Owner
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 mb-4">
                          <div className="p-2 border">
                            <div>
                              <div className="flex gap-2">
                                <div className="font-semibold">Address:</div>
                                <div className="font-normal">{panel.address}</div>
                              </div>
                              {panel.sqft.length > 0 && (
                                <div className="flex gap-2 mt-1">
                                  <div className="font-semibold">Area:</div>
                                  <div className="font-normal">
                                    {panel.sqft} {panel.measureUnit}
                                  </div>
                                </div>
                              )}
                              {panel.description.length > 0 && (
                                <div className="flex mt-3">
                                  <div className="text-md leading-2 font-normal">
                                    {show
                                      ? panel.description
                                      : panel.description.split(" ").slice(0, 20).join(" ")}
                                    {panel.description.split(" ").length > 50 && (
                                      <button
                                        onClick={handleShowMore}
                                        className="text-blue-500 ml-2"
                                      >
                                        {show ? "Show Less" : "Show More"}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
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
        <h2 className="lg:text-2xl uppercase text-2xl font-bold text-center text-green-900 mt-3">
          <AnimatedText text="Other Similar Properties Near By" />
        </h2>
        <div className="grid lg:grid-cols-3 gap-2 mt-14 md:grid-cols-2">
          {propertyData.map((check) => (
            <div
              key={check.id}
              onClick={() => {
                const modifiedPanelName = check.name
                  .replace(/\s/g, "")
                  .replace(/[^\w\s]/g, "");
                Navigate(`/property/-${check.id}-${modifiedPanelName}`);
                window.location.reload();
                window.scrollTo(0, 0);
              }}
              className="shadow-lg cursor-pointer px-2 py-2 border border-black bg-white rounded-lg"
            >
              <img
                className="h-52 w-full"
                src={check.image_one_url || ImageOne}
                alt="Property"
              />
              <div className="font-bold text-lg">{check.name}</div>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                </svg>
                <div className="flex">
                  <div className="font-bold lg:text-sm text-md">
                    {formatBudget(check.budget)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                  </svg>
                </div>
                <div>{check.address}</div>
              </div>
              <div className="flex items-center lg:gap-3 gap-3 mt-4">
                <div className="flex items-center gap-2">
                  {check.bedrooms < 1 ? null : <img className="w-6" src={Bath} alt="Bath" />}
                  <div>{check.bathrooms}</div>
                </div>
                <div className="flex items-center gap-2">
                  {check.bathrooms < 1 ? null : <img className="w-6" src={Bed} alt="Bed" />}
                  <div>{check.bedrooms}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <img className="w-5" src={check.varifed} alt="Verified" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <OurServices />
      <Searching />
      <ToastContainer />
      <BottomBar />
    </div>
  );
}