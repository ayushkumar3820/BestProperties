// import React, { useEffect, useState } from "react";

// export default function Bottom() {
//   const [newData, setNewData] = useState([]);
//   const handleSubmit = () => {
//     fetch("https://reactapi.guruhomesolutions.com/api/Reactjs/category")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data.result, "this is image");
//         setNewData(data.result);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };
//   useEffect(() => {
//     handleSubmit();
//   }, []);
//   return (
//     <>
//       <div className="  py-6 mt-10 ">
//         <div className="text-center  lg:text-3xl md:text-2xl text-lg font-bold text-green-900   ">
//           All Categories
//         </div>
//         <div className="container mx-auto mt-5  p-1 rounded">
//           <div className="grid lg:grid-cols-6 grid-cols-2 justify-center shadow-lg  gap-10">
//             {newData.map((panel) => {
//               return (
//                 <>
//                   <div className="hover:scale-110  rounded-lg transition duration-300 ease-in-out  justify-center items-center ">
//                     <div className="  justify-center py-2  items-center flex">
//                       <img
//                         className=" lg:w-24  px-3 py-3 bg-green-400 rounded-full  "
//                         src={panel.image}
//                       />
//                     </div>
//                     <div className="font-bold p-4  lg:text-lg  text-center ">
//                       {panel.property_type}
//                     </div>
//                   </div>
//                 </>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
