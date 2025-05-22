import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedText from "./HeadingAnimation";
import { liveUrl, token } from "./url";

export default function OurServices() {
  const Navigate = useNavigate();
  const [newData, setNewData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

fetch(`${liveUrl}/our_services_img`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, 
  },
  mode: "cors", // Ensures the request is a CORS request
})
  .then((response) => {
    if (!response.ok) {
      console.error("Response Error Details:", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); 
  })
  .then((data) => {
    setServiceData(data.result);
    console.log("Fetched data:", data.result);
  })
  .catch((error) => {
    console.error("Error fetching data:", error.message, error);
  });





  const handleSubmit = () => {
    fetch(`${liveUrl}api/Services/services/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Add any other headers you need
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNewData(data.result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    handleSubmit();
  }, []);

  
  return (
    <div className="container mx-auto">
      <div className="lg:text-3xl text-2xl font-bold text-green-900 text-center mt-4">
        <AnimatedText text="OUR SERVICES" />
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-center gap-5   mt-4 mb-4">
        {newData.length > 0 ? (
          <>
            {newData.map((panel, id) => {
              return (
                <>
                  <div
                    key={id}
                    onClick={() => {
                      Navigate(
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
      </div>
    </div>
  );
}
