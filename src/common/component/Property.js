import React from "react";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import AnimatedText from "./HeadingAnimation";
import GalleryComponentTwo from "./GalleryTwo";
import Searching from "./searching";

export default function Property() {
  return (
    <div>
      <Navbar />
     
      <div className="font-bold mb-4 mt-4 text-xl uppercase text-center  text-green-800">
        <AnimatedText text="Property Listing" />
      </div>
      <div className="container mx-auto">
        <GalleryComponentTwo />
      </div>
      <Searching/>
      <BottomBar />
    </div>
  );
}
