import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedText from "./HeadingAnimation";
import { liveUrl, token } from "./url";
import "../../App.css";

export default function OurServices() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [newData, setNewData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  
  const handleSubmit = () => {
    // Old Data Fetch
    // fetch(`${liveUrl}api/Services/services/`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json", // Add any other headers you need
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setNewData(data.result);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
    // New Data Fetching
    fetch(`${liveUrl}our_services_img`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setServiceData(data.result);
        console.log(data.result, "getting new services data");
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  };
  useEffect(() => {
    handleSubmit();
  }, []);


  useEffect(() => {
    // Automatically change the image index every 3 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % serviceData[0].images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [serviceData]);


  return (
    <>
      <div className="container mx-auto">
        <div className="lg:text-3xl text-2xl font-bold text-green-900 text-center mt-4">
          <AnimatedText text="OUR SERVICES" />
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-center gap-5   mt-4 mb-4">
          {serviceData.length > 0 ? (
            <>
              {serviceData.map((panel, id) => (
                <div
                  key={id}
                  onClick={() => {
                    navigate(`/property-type/${panel.our_services.replace(/\s/g, "-")}`);
                    window.scrollTo(0, 0);
                  }}
                  className="relative cursor-pointer border  overflow-hidden bg-white shadow-lg rounded-lg"
                >
                  <div
                  >
                    <img
                      className="w-full h-[230px] object-cover"
                      src={panel.images[currentImageIndex]}
                      alt={panel.our_services}
                    />
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="absolute bottom-5 text-white text-4xl font-bold">
                      {panel.our_services}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>






        {/* <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-center gap-5   mt-4 mb-4">
        {newData.length > 0 ? (
          <>
            {newData.map((panel, id) => {
              return (
                <>
                  <div
                    key={id}
                    onClick={() => {
                      navigate(
                        `/property-type/${panel.our_services.replace(
                          /\s/g,
                          "-"
                        )}`
                      );
                      window.scrollTo(0,0)
                    }}
                    className="relative cursor-pointer border border-black"
                  >
                    <img className="w-full h-[230px]" src={panel.image} />
                    <div className="flex justify-center items-center ">
                      <div className="absolute bottom-5 text-white text-4xl font-bold ">
                        {panel.our_services}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div> */}
      </div>
    </>


  );
}
