import React from "react";
import { useNavigate } from "react-router-dom";
export default function Searching() {
  const Navigate = useNavigate();
  return (
    <div>
      <div className="border-t-2 border-black"></div>
      <div className="image-four p-24 ">
        <div className="text-[45px] font-bold text-center text-green-900  ">
          Searching for Dream Home?
        </div>
        <div className="flex justify-center items-center  mt-4">
          <button
            onClick={() => {
              Navigate("/contact");
            }}
            className="bg-white p-2 rounded-md px-10 text-green-900 font-bold text text-center text-[23px]
        "
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
