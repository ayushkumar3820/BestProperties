import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { liveUrl } from "./url";

export default function Form() {
  const navigate = useNavigate();
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10));
  const [loader, setLoader] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [click, setClick] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleScroll = () => {
    if (window.pageYOffset < 600) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  };
  const [store, setStore] = useState({
    firstname: "",
    subject: "",
    email: "",
    phone: "",
    message: "",
  });
  const handleText = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(store) === num1 + num2) {
      alert("Captcha verification successful!");
    } else {
      alert("Incorrect answer. Please try again.");
      setNum1(Math.floor(Math.random() * 10));
      setNum2(Math.floor(Math.random() * 10));
      setStore("");
    }
  };
  const ValidateEmail = () => {
    var validRegex = new RegExp(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
    if (validRegex.test(store.email)) {
      console.log("false");
      return true;
    } else setClick(true);
    {
      return false;
    }
  };
  function HandleApi() {
    setLoader(false);
    ValidateEmail();
    fetch(`${liveUrl}api/Contact/contact`,
     {
      method: "POST",
      body: JSON.stringify({
        ...store,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "done") {
          setLoader(true);
          navigate("/");
          console.log(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      <div className="absolute top-2  right-0 lg:w-[500px] ">
        {showForm ? <>{/* <Buyer /> */}</> : <></>}
      </div>
    </>
  );
}
