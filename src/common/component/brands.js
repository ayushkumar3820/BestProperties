import React, { useEffect, useState } from "react";
import One from "../../assets/img/banner.jpg";
import two from "../../assets/img/image8.jpg";
import { Slide } from "react-slideshow-image";

export default function Brands() {
  const [brands, setBrands] = useState([]);

  const images = [
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
    One,
    two,
  ];
  const handleSubmit = () => {
    fetch("https://reactapi.guruhomesolutions.com/api/Reactjs/partners")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result, "this is response***************");
        setBrands(data.result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    handleSubmit();
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClickNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 8);
  };

  const handleClickPrev = () => {
    setCurrentIndex((prevIndex) => prevIndex - 8);
  };

  const renderImages = () => {
    const visibleImages = images.slice(currentIndex, currentIndex + 8);
    return visibleImages.map((imageUrl, index) => (
      <div className="border-t-2 p-4 mt-4 border-green-900 rounded-md">
        <div key={index} className="flex items-center  justify-center gap-10">
        <img
          src={imageUrl}
          alt={`Image ${index + currentIndex + 1}`}
          className=" h-32 w-64 rounded-md"
        />
      </div>
      </div>
    ));
  };

  return (
    <>
      {/* <div className=" mt-5">
        <div className="font-bold text-2xl text-center text-green-800 uppercase">
          Ready to move projects
        </div>
      </div> */}
      {/* <div className="container mx-auto flex flex-col items-center">
        <div className="flex items-center space-x-4 ">
          {currentIndex > 0 && (
            <button
              onClick={handleClickPrev}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                fill="black"
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
            </button>
          )}
          <div className="flex space-x-4">{renderImages()}</div>
          {currentIndex + 4 < images.length && (
            <button
              onClick={handleClickNext}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                className="w-6 h-5"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
              </svg>
            </button>
          )}
        </div>
      </div> */}
    </>
  );
}
