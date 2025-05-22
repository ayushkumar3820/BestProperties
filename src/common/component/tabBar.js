import React, { useEffect, useState } from "react";
import { liveUrl } from "./url";
import { useNavigate } from "react-router-dom";

export default function TabBar() {
  const Navigate = useNavigate();
  const [newData, setNewData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Buy");

  const handleOptionClick = (ourServices) => {
    Navigate(`/propertyType/${ourServices.replace(/\s/g, "-").toLowerCase()}`);
  };
  const handleData = () => {
    fetch(`${liveUrl}api/Services/services/`)
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
    handleData();
  }, []);
  return (
    <div className="bg-red-600 p-2 mt-4">
      <div className="container mx-auto">
        <div className="flex gap-64 ml-2 items-start">
          <div className="custom-dropdown">
            <div
              className="selected-option "
              onClick={() => setSelectedOption("Buy")}
            >
              {selectedOption}
            </div>
            <ul className="options w-[200px]">
              {newData.map((panel) => (
                <li
                  key={panel.our_services}
                  onClick={() => handleOptionClick(panel.our_services)}
                >
                  {panel.our_services}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-white">Sell</div>
          <div className="text-white">Build</div>
          <div className="text-white">Rent</div>

        </div>
      </div>
    </div>
  );
}
