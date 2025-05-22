import React from "react";
import imageOne from "../assets/img/properties-for-buy.jpg";
import imageTwo from "../assets/img/properties-for-rent.jpg";
import projectImage from "../assets/img/properties-projects.png";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  return (
    <>
      <div className=" ">
   
        <div className="header-link-image flex p-2 lg:gap-10 gap-2 mt-5  justify-center items-center">
          <img
            onClick={() => {
              navigate("/property");
            }}
            className="rounded h-32 md:h-24 sm:h-24 cursor-pointer"
            src={imageOne}
          />
          <img
            onClick={() => {
              navigate("/for-rent");
            }}
            className="rounded h-32 md:h-24  sm:h-24 cursor-pointer"
            src={imageTwo}
          />
          <img
            onClick={() => {
              navigate("/projects");
            }}
            className="rounded h-32 md:h-24 sm:h-24  cursor-pointer"
            src={projectImage}
          />
        </div>
      </div>
    </>
  );
}
