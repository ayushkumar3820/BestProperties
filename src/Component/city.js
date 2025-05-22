import React from "react";
import User from "../assets/img/layer1.png";
import AnimatedText from "../common/component/HeadingAnimation";
export default function City() {
  return (
    <div>
      <div className="container mx-auto">
        <div className="mt-10 text-center">
          <div className="text-3xl text-green-900 mt-4 font-bold">
            <AnimatedText text="  Explore Real Estate in Popular Cities" />
          </div>
          <div className="mt-4">
            <div className="grid lg:grid-cols-4 shadow-lg  grid:cols-1 md:grid-cols-2 gap-4  mb-10 p-2  ">
              <div className=" cursor-pointer   p-2 ">
                <div className=" border rounded-md p-1 flex items-center gap-2 ">
                  <img className=" " src={User} />
                  <div className="text-left mt-4">
                    <div className="font-bold">Chandigarh</div>
                    <div>120,000+ Properties</div>
                  </div>
                </div>
              </div>
              <div className=" cursor-pointer flex  p-2 ">
                <div className=" border rounded-md p-1 flex items-center gap-2 ">
                  <img className=" " src={User} />
                  <div className="text-left mt-4">
                    <div className="font-bold">Mohali</div>
                    <div>8,000+ Properties</div>
                  </div>
                </div>
              </div>
              <div className=" cursor-pointer flex  p-2 ">
                <div className=" border rounded-md p-1 flex items-center gap-2 ">
                  <img className=" " src={User} />
                  <div className="text-left mt-4">
                    <div className="font-bold">Mohali</div>
                    <div>6,000+ Properties</div>
                  </div>
                </div>
              </div>
              <div className=" cursor-pointer flex  p-2 ">
                <div className=" border rounded-md p-1 flex items-center gap-2  ">
                  <img className=" " src={User} />
                  <div className="text-left mt-4">
                    <div className="font-bold">Mohali</div>
                    <div>1,000+ Properties</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
