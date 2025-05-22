import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import Bed from "../../assets/img/bed.png";
import Bath from "../../assets/img/bath.png";
import varifed from "../../assets/img/varified.png";
import { useNavigate, useParams } from "react-router-dom";
import Noimage from "../../assets/img/image-not.jpg";
import AnimatedText from "./HeadingAnimation";
import { liveUrl, token } from "./url";
import OurServices from "./ourServices";
import Searching from "./searching";

export default function Residential() {
  let params = useParams();
  const our_services = params?.our_services.replace("", "");
  const Navigate = useNavigate();
  const [newData, setNewData] = useState([]);
  const [loader, setLoader] = useState(false);
  const handleSubmit = () => {
    setLoader(true);

    fetch(`${liveUrl}api/Services/servicesInnerPages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Add any other headers you need
      },
      body: JSON.stringify({
        innerpagetitle: our_services,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setNewData(data?.result);
        console.log(data.result, "this is data");
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    handleSubmit();
  }, []);
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
    <>
      <Navbar />

      <div className="px-2 py-4 container mx-auto">
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
        ) : (
          <>
            <div className="lg:text-3xl text-2xl font-bold text-green-900 text-center mt-4">
              <AnimatedText text={our_services} />
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 mb-4 mt-5 gap-7 justify-center items-center">
              {newData.map((panel, index) => {
                return (
                  <>
                    {newData.length > 0 ? (
                      <>
                        <div
                          onClick={() => {
                            const modifiedPanelName = panel.name.replace(
                              /\s/g,
                              ""
                            );
                            Navigate(
                              `/property/-${panel.id}-${modifiedPanelName}`
                            );
                          }}
                          className=" cursor-pointer shadow-lg border-2 border-dotted border-green-600  rounded-md"
                        >
                          <div className="relative  ">
                            <div className=" absolute left-0  "></div>
                            <div className=" flex items-center bg-green-900 text-white  px-2 py-2 left-0 bottom-0 absolute font-bold lg:text-xl  text-sm ">
                              <svg
                                fill="white"
                                className="w-5 h-5 "
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                              >
                                <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                              </svg>
                              {formatBudget(panel.budget)}/ {panel.sqft}Area{" "}
                              {panel.measureUnit}
                            </div>
                            <a target="_blank" rel="noopener noreferrer">
                              {panel.image_one.length > 0 ? (
                                <img
                                  className="cursor-pointer rounded-md h-64 w-full"
                                  src={`${panel.url}${panel.image_one}`}
                                  alt={`Panel ${index + 1}`}
                                />
                              ) : (
                                <img
                                  className="cursor-pointer rounded-md  h-64 w-full"
                                  src={Noimage}
                                  alt={`Panel ${index + 1}`}
                                />
                              )}
                            </a>
                          </div>
                          <div className="text-left border-t rounded-md  bg-white leading-4 p-2">
                            <div className=" mr-2 ">
                              <div className="">
                                <div className="text-md text-green-800 text-gr font-bold ml-2">
                                  {panel.name}
                                </div>
                                <div className="text-lg font-extralight ml-2">
                                  {panel.property_name}
                                </div>
                                <div className="flex justify-between  mt-1">
                                  <div className="ml-2 font-semibold  text-sm ">
                                    {panel.address}
                                  </div>
                                </div>
                                <div className="ml-2 mt-2 font-extralight">
                                  {panel.property_type}
                                </div>
                                <div className="flex items-center lg:gap-3 gap-3 mt-4">
                                  <div className="flex items-center gap-2">
                                    {panel.bedrooms < 1 ? null : (
                                      <img className="w-6" src={Bath} />
                                    )}
                                    <div className="font-bold">
                                      {panel.bedrooms}{" "}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {panel.bathrooms < 1 ? null : (
                                      <img className="w-6" src={Bed} />
                                    )}
                                    <div className="font-bold">
                                      {panel.bathrooms}{" "}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <img className="w-5" src={panel.varifed} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                );
              })}
            </div>
          </>
        )}
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
