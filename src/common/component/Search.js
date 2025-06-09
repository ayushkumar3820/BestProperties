/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { liveUrl } from "./url";
import { useNavigate } from "react-router-dom";
export default function Search() {
  const navigate = useNavigate();
  const [newData, setNewData] = useState([]);
  const [store, setStore] = useState([]);
  const [flat, setFlat] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenData, setIsOpenData] = useState(false);
  const [villaData, setVillaData] = useState(false);
  const [isOpenBudget, setIsOpenBudget] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionsTwo, setSelectedOptionsTwo] = useState([]);
  const [selectedOptionsThree, setSelectedOptionsThree] = useState([]);
  const [flatShow, setFlatShow] = useState(false);
  const [villaShow, setVillaShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [villaDataShow, setVillaDataShow] = useState([]);
  const [kothi, setKothi] = useState(false);
  const [kothiData, setKothiData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsOpenData(false);
    setIsOpenBudget(false);
    setVillaData(false);
  };
  const toggleProperty = () => {
    setIsOpenData(!isOpenData);
    setIsOpen(false);
    setIsOpenBudget(false);
    setVillaData(false);
    setFlatShow(false);
    setVillaShow(false);
    setKothi(false);
  };
  const flatShowData = () => {
    setFlatShow(!flatShow);
    setVillaShow(false);
    setKothi(false);
  };
  const flatVillaData = () => {
    setVillaShow(!villaShow);
    setFlatShow(false);
    setKothi(false);
  };
  const KothiShowData = () => {
    setKothi(!kothi);
    setVillaShow(false);
    setFlatShow(false);
  };
  const toggleBudget = () => {
    setIsOpenBudget(!isOpenBudget);
    setIsOpen(false);
    setVillaData(false);
  };
  const handleCheckboxChange = (option) => {
    const updatedSelection = [...selectedOptions];
    const index = updatedSelection.indexOf(option);
    if (index === -1) {
      updatedSelection.push(option);
    } else {
      updatedSelection.splice(index, 1);
    }
    setSelectedOptions(updatedSelection);
  };
  const handleCheckbox = (option) => {
    const updatedSelection = [...selectedOptionsTwo];
    const index = updatedSelection.indexOf(option);
    if (index === -1) {
      updatedSelection.push(option);
    } else {
      updatedSelection.splice(index, 1);
    }
    setSelectedOptionsTwo(updatedSelection);
  };
  const handleCheckboxThree = (option) => {
    const updatedSelection = [...selectedOptionsThree];
    const index = updatedSelection.indexOf(option);
    if (index === -1) {
      updatedSelection.push(option);
    } else {
      updatedSelection.splice(index, 1);
    }
    setSelectedOptionsThree(updatedSelection);
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
  console.log(selectedOption, "this is select option");
  const handleBudget = () => {
    fetch(`${liveUrl}budget`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result, "this is services");
        setStore(data.result.budget);
        setFlat(data.result.flat);
        setVillaDataShow(data.result.villa);
        setKothiData(data.result.house);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    handleData();
    handleBudget();
  }, []);
  return (
    <>
      <div className="container mx-auto mt-4 mb-4 ">
        <div className="flex  justify-center items-center p-1">
          <div className="  shadow-lg border-2  lg:w-[1200px] md:w-full lg:p-14 p-4  rounded">
            <div className="flex items-center   justify-around">
              <div className="lg:flex sm:flex xl:flex gap-2 items-center">
                <div className="flex   items-center gap-2">
                  <input
                    className="w-4 h-4"
                    name="buy"
                    type="radio"
                    value="buy"
                    checked={selectedOption === "buy"}
                    onChange={handleRadioChange}
                  />
                  <div className="cursor-pointer uppercase lg:mr-6 lg:text-lg">
                    Buy
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="h-4 w-4"
                    name="buy"
                    type="radio"
                    value="rent"
                    checked={selectedOption === "rent"}
                    onChange={handleRadioChange}
                  />
                  <div className="cursor-pointer uppercase lg:mr-6 lg:text-lg">
                    Rent
                  </div>
                </div>
                {/* <svg
                  fill="green"
                  className="w-4 h-4 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                </svg> */}
                {/* <div onClick={toggleDropdown} className="cursor-pointer">
                  {selectedOptions.length > 0 ? (
                    <>
                      <div className="cursor-pointer">{selectedOptions}</div>
                    </>
                  ) : (
                    <>
                      <div className="cursor-pointer uppercase ml-4">
                        Property Type
                      </div>
                    </>
                  )}
                </div> */}

                {isOpen && (
                  <div
                    onClick={toggleDropdown}
                    className="absolute bg-white border mt-40 z-50 rounded-md p-2"
                  >
                    {newData.map((panel) => (
                      <div
                        key={panel.our_services}
                        className="flex items-center mb-2"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 mr-2"
                          checked={selectedOptions.includes(panel.our_services)}
                          onChange={() =>
                            handleCheckboxChange(panel.our_services)
                          }
                        />
                        <div>{panel.our_services}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center ml-2">
                <svg
                  fill="green"
                  className="w-4 h-4 ml-4 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                </svg>
                <div onClick={toggleProperty} className="cursor-pointer">
                  {selectedOptionsTwo.length > 0 ? (
                    <>
                      <div className="cursor-pointer">{selectedOptionsTwo}</div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <div className="cursor-pointer uppercase ml-4 lg:text-lg">
                          TYPE
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {isOpenData && (
                  <>
                    <div className="absolute mt-24 shadow-lg bg-white p-2 z-50 flex gap-5">
                      <div
                        onClick={flatShowData}
                        className="font-semibold text-green-600 cursor-pointer"
                      >
                        FLAT
                      </div>
                      <div
                        onClick={flatVillaData}
                        className="font-semibold text-green-600 uppercase cursor-pointer"
                      >
                        Villa
                      </div>
                      <div
                        onClick={flatVillaData}
                        className="font-semibold text-green-600 uppercase cursor-pointer"
                      >
                        Land
                      </div>
                    </div>
                  </>
                )}
                {flatShow && (
                  <>
                    <div
                      onClick={toggleProperty}
                      className="absolute bg-white grid grid-cols-3 gap-2 border mt-52  z-50 rounded-md p-2"
                    >
                      {flat.map((flatcheck) => {
                        return (
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              className="w-5 h-5 mr-2"
                              checked={selectedOptionsTwo.includes(flatcheck)}
                              onChange={() => handleCheckbox(flatcheck)}
                            />
                            <div className="flex">
                              <div className="font-bold">{flatcheck}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {villaShow && (
                  <>
                    <div
                      className="absolute bg-white grid grid-cols-3 gap-2 border
                         mt-64 z-50 rounded-md p-2"
                    >
                      {villaDataShow.map((test) => {
                        return (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <input className="h-4 w-4" type="checkbox" />
                              <div className="font-bold">{test}</div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </>
                )}
                {kothi && (
                  <>
                    <div
                      className="absolute bg-white grid grid-cols-3 gap-2 border
                         mt-56 z-50 rounded-md p-2"
                    >
                      {kothiData.map((testing) => {
                        return (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <input className="h-4 w-4" type="checkbox" />
                              <div className="font-bold">{testing}</div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              {selectedOption == "rent" ? (
                <></>
              ) : (
                <>
                  <div className="flex items-center">
                    <svg
                      fill="green"
                      className="w-5 h-5 ml-4 "
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                    </svg>
                    <div onClick={toggleBudget} className="cursor-pointer">
                      {selectedOptionsThree.length > 0 ? (
                        <>
                          <div className="cursor-pointer">
                            {selectedOptionsThree}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="cursor-pointer uppercase ml-4 lg:text-lg">
                            Budget
                          </div>
                        </>
                      )}
                    </div>
                    {isOpenBudget && (
                      <div
                        onClick={toggleBudget}
                        className="absolute  bg-white border mt-80  z-50 rounded-md p-2"
                      >
                        {store.map((check) => {
                          return (
                            <div className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                className="w-5 h-5 mr-2"
                                checked={selectedOptionsThree.includes(check)}
                                onChange={() => handleCheckboxThree(check)}
                              />
                              <div className="flex items-center">{check}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}

              <button className="h-10 ml-4  text-white font-semibold rounded-md bg-red-600 lg:w-40 w-24 flex justify-center items-center">
                {loader ? (
                  <>
                    <svg
                      fill="white"
                      className="animate-spin w-5 h-5 "
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                    </svg>
                  </>
                ) : (
                  <>
                    <div onClick={()=>{navigate("/rent")}}>Search</div>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
