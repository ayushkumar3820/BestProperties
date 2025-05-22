import React, { useEffect, useState } from "react";
import Navbar from "../common/component/navbar";
import BottomBar from "../common/component/bottomBar";
import BannerOne from "../../src/assets/img/BannerThree.jpg";
import AnimatedText from "../common/component/HeadingAnimation";
import VarifiedImage from "../assets/img/varified.png";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { liveUrl } from "../common/component/url";
export default function Agent() {
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [profileData, setProfileData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clickData, setClickData] = useState(false);
  const [click, setClick] = useState(false);
  const [newData, setNewData] = useState([]);
  const [property, setProperty] = useState([]);
  const [plan, setPlan] = useState([]);
  const [store, setStore] = useState({
    firstname: "",
    property: "",
    email: "",
    phone: "",
  });
  const handleText = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };
  const ValidateEmail = () => {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(store.email)) {
      setClick("Please enter a valid email address.");
    } else {
      setClick("");
    }
  };
  const ValidatePhone = () => {
    if (!/^\d{10}$/.test(store.phone)) {
      setClickData("Mobile number should be 10 digits long");
    } else {
      setClickData("");
    }
  };
  const handleUserProfile = () => {
    fetch(`${liveUrl}user-profile`, {
      method: "POST",
      body: JSON.stringify({
        token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setProfileData(data.result);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleUser = () => {
    fetch(`${liveUrl}agent-properties`, {
      method: "POST",
      body: JSON.stringify({
        token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setProperty(data.result);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handlePlan = () => {
    fetch(`${liveUrl}plans`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setPlan(data.result);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    handleUserProfile();
    handleUser();
    handlePlan();
  }, []);
  function HandleApi() {
    const isEmailValid = ValidateEmail();
    const isPhoneValid = ValidatePhone();
    if (!isEmailValid || !isPhoneValid) {
      return;
    }
    fetch(`${liveUrl}Contact/contact`, {
      method: "POST",
     
      body: JSON.stringify({
        ...store,
        message: "",
        subject: "",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "done") {
          Navigate("/success");
        } else {
        }
      })
      .catch((error) => {
        console.error("Error during API call:", error);
      });
  }
  const custom = {
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
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={custom}
      >
        <div className="lg:w-[400px] w-full ">
          <div className="flex justify-center items-center">
            <div className="font-bold text-2xl  ">Contact</div>
            <button
              onClick={() => {
                setModalIsOpen(false);
              }}
              className="bg-green-900 absolute top-0
             right-0 w-8 h-8 flex justify-center items-center"
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
          <div className="w-full mt-4 ">
            <label className="block tracking-wide  text-lg font-bold mb-2">
              Your Name
            </label>
            <input
              className="appearance-none block w-full h-12 border border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="firstname"
              name="firstname"
              value={store.firstname}
              onChange={handleText}
              placeholder="Please enter your firstname"
            />
            {click && store.firstname == "" ? (
              <div className="text-red-600 ">Required to fill firstName</div>
            ) : null}
          </div>
        </div>
        {newData.map((oky) => {
          return (
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full px-3"></div>
            </div>
          );
        })}
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3">
            <label className="block  tracking-wide  text-lg font-bold mb-2">
              Phone
            </label>
            <input
              maxLength={10}
              type="number"
              name="phone"
              value={store.phone}
              onChange={handleText}
              className="appearance-none block w-full  border h-12 border-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="phone"
              placeholder="Please enter your phone number"
            />
            {clickData && <div className="text-red-600">{clickData}</div>}
          </div>
        </div>
        <button
          onClick={HandleApi}
          className="bg-green-900 w-full text-white text-lg p-2"
        >
          Submit
        </button>
      </Modal>
      <Navbar />
      <div className="border border-green-800"></div>
      <div className="container mx-auto">
        <div className="mt-5">
          <div className="font-bold mb-4 mt-4 text-2xl uppercase text-center text-green-800">
            <AnimatedText text="Property Listing" />
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 justify-center p-2 gap-10">
            <div className=" rounded-md">
              <div className="font-bold text-center text-2xl mt-4">
                Choose your plan
              </div>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 p-2 py-6 ">
                {plan.map((plann) => {
                  return (
                    <>
                      <div className="shadow-lg cursor-pointer border border-black p-1 rounded-md ">
                        <div className="text-center py-4">
                          {plann.title}
                        </div>
                        <div className="flex justify-center  items-center">
                          <svg
                            fill=""
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="10"
                            viewBox="0 0 320 512"
                          >
                            <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                          </svg>
                          <div className="text-black font-bold text-center py-4 text-2xl">
                            {plann.price}
                          </div>
                        </div>
                        <div className="mt-4">
                          <div>{plann.duration}</div>
                          <div>{plann.plan_description}</div>
                        </div>
                        <div className="bg-green-600 mt-2 rounded-md  p-2">
                          <div className="text-center text-white">
                            Get Started
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
            <div className="p-2">
              {profileData.map((panel) => {
                return (
                  <>
                    <div className="flex items-center lg:mt-24">
                      <div className="flex">
                        <div className="font-bold text-green-600">
                          {panel.name}
                          {localStorage.setItem("panelTitle", panel.name)}

                        </div>
                        {panel.varified ? (
                          <>
                            <img className="h-8 w-10" src={panel.Varified} />
                          </>
                        ) : null}
                      </div>
                      {panel.varified_user.length > 0 ? (
                        <>
                          <img className="h-5 w-6" src={VarifiedImage} />
                        </>
                      ) : null}
                    </div>
                    <div>{panel.mobile.replace(/(\d{4})$/, "****")}</div>
                    <div>{panel.email}</div>
                  </>
                );
              })}
            </div>
          </div>
          <div className="font-bold text-2xl text-green-800 mt-4 mb-4 text-center">
            <AnimatedText text="Owner Properties Available" />
          </div>
        </div>
      </div>
      <div className="mt-10  bg-green-800 p-2  ">
        <div className="container mx-auto ">
          <div className="grid lg:grid-cols-3 mt-10 md:grid-cols-2 gap-5">
            {property.length > 0 ? (
              <>
                {property.map((check) => {
                  return (
                    <>
                      <div className="border cursor-pointer ">
                        <img className=" w-full " src={BannerOne} />
                        <div className="p-2 border-t">
                          <div className="font-bold text-white flex items-center">
                            <svg
                              fill="white"
                              xmlns="http://www.w3.org/2000/svg"
                              height="16"
                              width="10"
                              viewBox="0 0 320 512"
                            >
                              <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                            </svg>
                            {check.price}
                          </div>
                          <div className="text-white">{check.title}</div>
                          <div className="flex">
                            <div className="text-white">{check.plot_area}</div>
                            <div className="text-white">
                              {check.measure_unit}
                            </div>
                          </div>
                          <div className="text-white">
                            {check.age_of_property}
                          </div>
                          <div className="text-white">
                            {check.availability_status}
                          </div>
                          <div className="flex mt-4">
                            <svg
                              className="h-8 w-8 cursor-pointer"
                              fill="#EF4444"
                              xmlns="http://www.w3.org/2000/svg"
                              height="16"
                              width="14"
                              viewBox="0 0 448 512"
                            >
                              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </>
            ) : null}
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
