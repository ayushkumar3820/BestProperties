// import React, { useState } from "react";
// import Navbar from "./navbar";
// import BottomBar from "./bottomBar";
// import { useNavigate } from "react-router-dom";

// export default function LoactionPage() {
//   const Navigate = useNavigate();
//   const [loader, setLoader] = useState(false);
//   const [click, setClick] = useState(false);
//   const [data, setData] = useState(JSON.parse(localStorage.getItem("dataKey")));
//   const ValidateEmail = () => {
//     if (store.email) {
//       console.log("false");

//       return true;
//     } else setClick(true);
//     {
//       return false;
//     }
//   };
//   const [store, setStore] = useState({
//     zip: "",
//     address: "",
//   });
//   const [selectedDist, setSelectedDist] = useState("city");
//   console.log(selectedDist, "this is  city");
//   function handleSelectDist(event) {
//     setSelectedDist(event.target.value);
//   }
//   const handleData = (e) => {
//     setStore({ ...store, [e.target.name]: e.target.value });
//   };


//   const handleApi = () => {
//     setLoader(false);
//     ValidateEmail();
//     fetch("https://reactapi.guruhomesolutions.com/api/Buyer/addBuyer", {
//       method: "POST",
//       body: JSON.stringify({
//         ...store,
//         city: selectedDist,
//         infotype: "location",
//         mobile: data,
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.status === "done") {
//           setLoader(true);
//           setStore("");
         
//           console.log(data);
//         } else {
//         }
//       })
//       .catch((error) => console.error(error));
//   };
//   return (
//     <div>
//       <Navbar />
//       <div className="border "></div>
//         <div className="font-bold text-2xl text-center mt-2">Loaction Required</div>
//       <div className="container mt-2 mx-auto border shadow-lg px-2 lg:w-[800px]">
//         <div className="mt-3 ">
//           <textarea
//             type="text"
//             id="disabledTextInput"
//             className="border border-black p-2 w-full h-24 "
//             placeholder=" Address"
//             onChange={handleData}
//             value={store.address}
//             name="address"
//           />
//           {click && store.address == "" ? (
//             <div className="text-red-500 mt-1 ">Required to fill </div>
//           ) : null}
//         </div>
//         <div className="mb-3 mt-5  lg:text-left  items-center  ">
//           <select
//             id="disabledSelect"
//             name="city"
//             value={selectedDist}
//             onChange={handleSelectDist}
//             className="border   border-black p-2 h-10 mr-3 rounded-md w-full  bg-white mb-2"
//           >
//             <option value="city">City</option>
//             <option value="mohali">Mohali</option>
//             <option value="chandigarh">Chandigarh</option>
//             <option value="punchkula">Panchkula</option>
//             <option value="punchkula">Himachal pardesh</option>
//             <option value="punchkula">Haryana</option>
//             <option value="other">Other</option>
//           </select>
//           <input
//             type="number"
//             id="disabledTextInput"
//             className="border border-black h-10 w-full mt-2 rounded-md  p-2"
//             placeholder="Pin Code"
//             onChange={handleData}
//             value={store.zip}
//             name="zip"
//           />
//           {click && store.zip == "" ? (
//             <div className="text-red-500 mt-1 ">Required to fill </div>
//           ) : null}
//         </div>
//         <button
//           onClick={handleApi}
//           className="p-2  mb-4 w-full bg-red-900 rounded-md text-white flex justify-center items-center text-2xl mt-5"
//         >
//           <div>Next</div>
//         </button>
//       </div>
//       <BottomBar />
//     </div>
//   );
// }
