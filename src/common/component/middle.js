/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
// import Slider from "react-slick";
import { useState } from "react";
import { liveUrl } from "./url";

export default function Middle() {
  const [newData, setNewData] = useState([]);
  const handleSubmit = () => {
    fetch(`${liveUrl}api/Reactjs/property"`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result, "this is result");
        setNewData(data.result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  console.log(newData, "this is new data ");
  const settings = {
    dots: true,
    infinite: true,
    speed: 1100,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <>
      <div className="w-full container mx-auto ">
        {/* <Slider {...settings}>
          {newData.map((panel) => {
            return (
              <>
                <div className="flex mt-10 justify-center items-center">
                <div
                  key={panel.id}
                  className="bg-gray-200 text-center hover:bg-orange-800 border lg:w-10/12 mt-4 lg:p-10 lg:block xl:block sm:hidden  hidden  border-black     hover:text-white  "
                >
                  <h3 className="text-lg font-medium">{panel.name}</h3>
                  <p className=" ">Address:-{panel.address}</p>
                  <p className="">Budget:-{panel.budget}</p>
                </div>
                </div>
              </>
            );
          })}
        </Slider> */}
      </div>
    </>
  );
}
