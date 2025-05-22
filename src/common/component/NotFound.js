import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import '../../Css/ErrorPage.css'


const NotFound = () => {
  return (
    <>
    <Navbar/>
    <div className="error-page">
      <div className="error-box">
        <div className="error-code">404</div>
        <div className="error-message">OOPS! PAGE NOT FOUND</div>
        <div className="error-description">
          Sorry, the page you're looking for doesn't exist. Please return to the homepage and continue browsing.
        </div>
        <div className="error-buttons">
          <Link to="/" className="error-btn error-home">RETURN HOME</Link>
        </div>
      </div>
    </div>
    <BottomBar/>
    </>
  );
};

export default NotFound;