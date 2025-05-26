import React, { useEffect, useState } from "react";
import Navbar from "../common/component/navbar";
import Home from "../common/component/home";
import BottomBar from "../common/component/bottomBar";
import Form from "../common/component/form";
// import Banner from "../assets/img/banner.jpg";
// import BannerTwo from "../assets/img/bannerTwo.jpg";
// import BannerThree from "../assets/img/BannerThree.jpg";
import OurServices from "../common/component/ourServices";
import Searching from "../common/component/searching";
import Brands from "../common/component/brands";
import { useNavigate } from "react-router-dom";
import { liveUrl, token } from "../common/component/url"; // Import token
import Search from "./search";

export default function Main() {
  const [textColor, setTextColor] = useState(getRandomColor());
  const [newData, setNewData] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTextColor(getRandomColor());
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  function getRandomColor() {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = () => {
    fetch(`${liveUrl}api/Reactjs/slider`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result, "this is image");
        setNewData(data.result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleData = () => {
    fetch(`${liveUrl}api/Services/services/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result, "this is services");
        setNewData(data.result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    handleSubmit();
    handleData();
  }, []);

  return (
    <div className="">
      <Navbar />

      <div className="  mb-2    ">
        <div className="relative">
        </div>
        {/* <Search /> */}
        <Form />
      </div>

      <Brands />
      <Home />

      <OurServices />
      <Searching />
      <BottomBar />
    </div>
  );
}