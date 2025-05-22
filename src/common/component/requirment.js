import React, { useState } from "react";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import { useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";
import OurServices from "./ourServices";
import Searching from "./searching";

export default function Requirment() {
  const Navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("");
  const [activeCommercial, setActiveCommercial] = useState("");
  const [loader, setLoader] = useState(false);
  const [selectedOption, setSelectedOption] = useState("residential");
  const [selectedOne, setSelectedOne] = useState("residential");
  const [num, setNum] = useState(JSON.parse(localStorage.getItem("dataKey")));
  const [click, setClick] = useState(false);
  const [storedata, setStoreData] = useState({
    phone: "",
  });
  const handleNewData = (e) => {
    setStoreData({ ...storedata, [e.target.name]: e.target.value });
  };
  const handleClick = (span) => {
    setActiveButton(span);
  };
  const handleCommercial = (span) => {
    setActiveCommercial(span);
  };
  const handleOptionNext = (event) => {
    setSelectedOne(event.target.value);
  };
  const handleApi = () => {
    setLoader(false);
    setClick(true);
    fetch(`${liveUrl}api/Buyer/addBuyer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        residential: activeButton,
        commercial: activeCommercial,
        propertyType: selectedOne,
        infotype: "requirment",
        mobile: num,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "done") {
          setClick(false);
          setLoader(true);
          Navigate("/success");
          console.log(data);
        } else {
        }
      })
      .catch((error) => console.error(error));
  };
  return (
    <>
      <Navbar />
      <div className=""></div>

      <div className=" flex  justify-center items-center">
        <div className="container border   shadow-lg px-2 mx-auto lg:w-[800px] ">
          <div className="font-bold text-2xl mt-2 text-center">
            Main Category
          </div>
          <div className="flex gap-5 mt-2">
            <label className="flex items-center">
              <input
                className="w-5 h-5 mr-2 "
                type="radio"
                name="residential"
                value="residential"
                checked={selectedOne === "residential"}
                onChange={handleOptionNext}
              />
              Residential
            </label>
            <label className="flex items-center">
              <input
                className="w-5 h-5 mr-2 "
                type="radio"
                name="commercial"
                value="commercial"
                checked={selectedOne === "commercial"}
                onChange={handleOptionNext}
              />
              Commercial
            </label>
          </div>
          {selectedOne === "residential" ? (
            <>
              <div className="flex items-center gap-2 mt-5 ">
                <div
                  style={{
                    border: "2px solid #D3D3D3",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick("Flat/Apartment")}
                  className={
                    activeButton === "Flat/Apartment"
                      ? "activess btn btn-solid w-full p-2 text-center"
                      : "btn btn-solid w-full text-center p-2"
                  }
                >
                  Flat/Apartment
                </div>
                <div
                  style={{
                    border: "2px solid #D3D3D3",

                    backgroundColor: "white",

                    cursor: "pointer",
                  }}
                  onClick={() => handleClick("IndePendentHouse/villa")}
                  className={
                    activeButton === "IndePendentHouse/villa"
                      ? "activess btn btn-solid p-2 w-full text-center"
                      : "btn btn-solid w-full p-2 text-center"
                  }
                >
                  IndependentHouse/villa
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <div className="mt-3 text-start w-full">
                  <div
                    style={{
                      border: "2px solid #D3D3D3",

                      backgroundColor: "white",

                      cursor: "pointer",
                    }}
                    onClick={() => handleClick("Independent/Builder Floor")}
                    className={
                      activeButton === "Independent/Builder Floor"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Independent/Builder Floor
                  </div>
                </div>
                <div className="mt-3 text-start w-full">
                  <div
                    style={{
                      border: "2px solid #D3D3D3",

                      backgroundColor: "white",

                      cursor: "pointer",
                    }}
                    onClick={() => handleClick("Plot")}
                    className={
                      activeButton === "Plot"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Plot/Land
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <div
                  style={{
                    border: "2px solid #D3D3D3",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick(" 1RK/Studio Apartment")}
                  className={
                    activeButton === " 1RK/Studio Apartment"
                      ? "activess btn btn-solid w-full text-center p-2"
                      : "btn btn-solid w-full text-center p-2"
                  }
                >
                  1RK/Studio Apartment
                </div>
                <div
                  style={{
                    border: "2px solid #D3D3D3",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick("Serviced Apartment")}
                  className={
                    activeButton === "Serviced Apartment"
                      ? "activess btn btn-solid w-full text-center p-2"
                      : "btn btn-solid w-full text-center p-2"
                  }
                >
                  Serviced Apartment
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <div
                  style={{
                    border: "2px solid #D3D3D3",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick("Farmhouse")}
                  className={
                    activeButton === "Farmhouse"
                      ? "activess btn btn-solid w-full text-center p-2"
                      : "btn btn-solid w-full text-center p-2"
                  }
                >
                  Farmhouse
                </div>
                <div
                  style={{
                    border: "2px solid #D3D3D3",

                    backgroundColor: "white",

                    cursor: "pointer",
                  }}
                  onClick={() => handleClick("Other")}
                  className={
                    activeButton === "Other"
                      ? "activess btn btn-solid w-full text-center p-2"
                      : "btn btn-solid w-full text-center p-2"
                  }
                >
                  Other
                </div>
              </div>
              {click && activeButton == "" ? (
                <div className="text-red-600">select any one option</div>
              ) : null}
            </>
          ) : null}
          {selectedOne === "commercial" ? (
            <>
              <div>
                <div className="flex gap-5  mt-3">
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Office")}
                    className={
                      activeCommercial === "Office"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Office
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Retail")}
                    className={
                      activeCommercial === "Retail"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Retail
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Plot/Land")}
                    className={
                      activeCommercial === "Plot/Land"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Plot/Land
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Storage")}
                    className={
                      activeCommercial === "Storage"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Storage
                  </div>
                </div>
                <div className="flex gap-5 mt-3">
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Industry")}
                    className={
                      activeCommercial === "Industry"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Industry
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",

                      backgroundColor: "white",
                      fontSize: "15px",

                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Hospitality")}
                    className={
                      activeCommercial === "Hospitality"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Hospitality
                  </div>
                  <div
                    style={{
                      border: "2px solid #D3D3D3",
                      backgroundColor: "white",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCommercial("Other")}
                    className={
                      activeCommercial === "Other"
                        ? "activess btn btn-solid w-full text-center p-2"
                        : "btn btn-solid w-full text-center p-2"
                    }
                  >
                    Other
                  </div>
                </div>
              </div>
              {click && activeCommercial == "" ? (
                <div className="text-red-600">select any one</div>
              ) : null}
            </>
          ) : null}
          <div className="flex mb-5 justify-center items-center ">
            <div
              onClick={() => {
                handleApi();
              }}
              className="bg-red-600 cursor-pointer w-full  flex justify-center p-2 mt-5 rounded-md  "
            >
              {loader ? (
                <svg
                  fill="white"
                  className="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                </svg>
              ) : (
                <div className="text-white font-bold text-lg">Save</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <OurServices />
        <Searching />
        <BottomBar />
      </div>
    </>
  );
}
