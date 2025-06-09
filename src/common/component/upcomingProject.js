/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { liveUrl } from "./url";

export default function UpcomingProject() {
  const [newData, setNewData] = useState([]);

  const handleSubmit = () => {
    fetch(`${liveUrl}api/Services/servicesInnerPages`, {
      method: "POST",
      body: JSON.stringify({
        innerpagetitle: "Office Space",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setNewData(data?.result);
        // eslint-disable-next-line no-undef
        setPropertyData(data?.result[0].name);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    handleSubmit();
  }, []);
  return (
    <>
      <div className="container mx-auto">
        <div className="grid grid-cols-3">
          {newData?.map((panel) => {
            <>
              <div className="text-left bg-white leading-4 p-2">
                <div className=" mr-2 ">
                  <div className="">
                    <div className="text-md font-bold ml-2">{panel.name}</div>
                    <div className="text-lg font-extralight ml-2">
                      {panel.property_name}
                    </div>
                    <div className="flex justify-between  mt-1">
                      <div className="ml-2 lg:text-lg text-sm ">
                        {panel.address}
                      </div>
                    </div>
                    <div className="ml-2 lg:text-lg text-sm ">
                      {panel.sqft}Area{panel.measureUnit}
                    </div>
                    <div className="flex items-center lg:gap-3 gap-3 mt-4">
                      <div className="flex items-center gap-2">
                        {panel.bedrooms < 1 ? null : (
                          <img className="w-4" src={Bath} />
                        )}
                        <div>{panel.bedrooms} </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {panel.bathrooms < 1 ? null : (
                          <img className="w-4" src={Bed} />
                        )}
                        <div>{panel.bathrooms} </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <img className="w-5" src={panel.varifed} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>;
          })}
        </div>
      </div>
    </>
  );
}
