import React from "react";
import imageOne from "../assets/img/properties-for-buy.jpg";
import imageTwo from "../assets/img/properties-for-rent.jpg";
import projectImage from "../assets/img/properties-projects.png";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center p-4 sm:p-6 md:p-8 mt-5">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-center items-center">
        <img
          onClick={() => navigate("/property")}
          className="rounded h-24 w-full sm:h-24 sm:w-auto md:h-28 lg:h-32 cursor-pointer object-cover m-2 sm:m-3 md:m-4"
          src={imageOne}
          alt="Properties for Sale"
        />
        <img
          onClick={() => navigate("/for-rent")}
          className="rounded h-24 w-full sm:h-24 sm:w-auto md:h-28 lg:h-32 cursor-pointer object-cover m-2 sm:m-3 md:m-4"
          src={imageTwo}
          alt="Properties for Rent"
        />
        <img
          onClick={() => navigate("/projects")}
          className="rounded h-24 w-full sm:h-24 sm:w-auto md:h-28 lg:h-32 cursor-pointer object-cover m-2 sm:m-3 md:m-4"
          src={projectImage}
          alt="Projects"
        />
      </div>
    </div>
  );
}
