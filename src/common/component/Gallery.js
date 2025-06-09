/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import Home from "../../assets/img/image8.jpg";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";

export default function Gallery() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="text-2xl mt-4 mb-4 ">
          2 BHK Flat For Sale in KSB Royal Homes, in Sector 126, Mohali
        </div>
        <div className="grid lg:grid-cols-3 gap-2">
          <img className="" src={Home} />
          <img src={Home} />
          <img src={Home} />
        </div>
      </div>
      <BottomBar />
    </>
  );
}
