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
      <div className="container mx-auto">
        <GalleryComponentTwo />
      </div>
      <Searching/>
      <BottomBar />
    </div>
  );
}
