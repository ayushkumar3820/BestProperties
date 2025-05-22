import React, { useState } from "react";
import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import { useNavigate } from "react-router-dom";
import { liveUrl } from "./url";
import AnimatedText from "./HeadingAnimation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function AboutProperty() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [active, setActive] = useState("");
  const [activeButton, setActiveButton] = useState("");
  const [measure, setMeasure] = useState("sq.ft");
  const [measureUnit, setMeasureUnit] = useState("ft");
  const [sale, setSale] = useState("Buy");
  const [property_type, SetProperty_type] = useState("");
  const [button, setButton] = useState("");
  const [runButton, setRunButton] = useState("");
  const [click, setClick] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [store, setStore] = useState({
    plot_area: "",
    carpet_area: "",
    title: "",
    shop_front_details: "",
    price: "",
    bedrooms: "",
    bathroom: "",
    property_type: "",
    property_name: "",
    address: "",
    property_description: "",
    address: "",
  });
  const [storeData, setStoreData] = useState({
    title: "",
    areaSqft: "",
    sector: "",
    rentpermonth: "",
    bathroom: "",
    bedrooms: "",
    property_description: "",
    address: "",
    bookedby: "",
    bookingamount: "",
    agreement: "",
    commission: "",
    security: "",
    police_verification: "",
  });
  console.log(storeData, "this is storedata");
  const handleChangeDate = (date) => {
    setSelectedDate(date);
  };
  const storedData = localStorage.getItem("responseData");
  function handleSelect(event) {
    setMeasure(event.target.value);
  }
  function handleSelectMeasure(event) {
    setMeasureUnit(event.target.value);
  }
  function handlePurpose(event) {
    setSale(event.target.value);
  }
  function handleproperty(event) {
    SetProperty_type(event.target.value);
  }
  const handleChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };
  const handleChangeData = (e) => {
    setStoreData({ ...storeData, [e.target.name]: e.target.value });
  };
  const token = localStorage.getItem("token");
  function HandleApi() {
    setClick(true);
    setLoader(false);
    fetch(`${liveUrl}api/PropertyDetail/propertyDetails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Add any other headers you need
      },
      body: JSON.stringify({
        ...store,
        ...measure,
        ...storeData,
        located_near: activeButton,
        washroom_details: active,
        age_of_property: runButton,
        availability_status: button,
        measure_unit: measure,
        measure: measureUnit,
        token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "done") {
          setLoader(true);
          setClick(false);
          navigate("/success");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  function HandleRent() {
    setClick(true);
    setLoader(false);
    fetch(`${liveUrl}add-rent-property`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Add any other headers you need
      },
      body: JSON.stringify({
        // ...store,
        // ...measure,
        ...storeData,
        located_near: activeButton,
        washroom_details: active,
        age_of_property: runButton,
        availability_status: button,
        measure_unit: measure,
        measure: measureUnit,
        property_type: property_type,
        available_from: selectedDate,
        token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "done") {
          setLoader(true);
          setClick(false);
          navigate("/success");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <div className="">
      <Navbar />
      <div className="border border-green-800"></div>
      <div className="container lg:w-6/12 shadow-lg mt-5 mb-4  mx-auto  ">
        <div className="border border-grey-600 mt-5 px-4 py-4">
          <div className="mt-5 uppercase mb-10 text-green-600 text-center font-bold text-2xl">
            <AnimatedText text="Tell Us about Your Property" />
          </div>
          {storedData == '"Rent/Lease"' ? (
            <>
              <div className="lg:flex sm:flex items-center w-full gap-14 mt-4">
                <div className="w-1/2">
                  <div className="mt-2 mb-2">Title</div>
                  <input
                    onChange={handleChangeData}
                    value={storeData.title}
                    name="title"
                    className="border p-2 w-full border-black rounded "
                  />
                </div>
                <div className="mt-4 w-1/2">
                  <div className="mb-1">Property Type*</div>
                  <select
                    onChange={handleproperty}
                    name="property_type"
                    value={property_type}
                    className="border bg-white  h-11  border-black rounded p-2 "
                  >
                    <option value="kothi">1 BHK</option>
                    <option value="2bhk">2 BHK</option>
                    <option value="3bhk">3 BHK</option>
                    <option value="Room Only">Room Only</option>
                    <option value="Room With Kitchen">Room With Kitchen</option>
                    <option value="kothi">Rooms Only</option>
                    <option value="Rooms With Kitchen">
                      Rooms With Kitchen
                    </option>
                    <option value="Boys PG">Boys PG</option>
                    <option value="Girls PG">Girls PG</option>
                    <option value="Shop">Shop</option>
                    <option value="annex House">Annex House</option>
                    <option value="annex House">Other</option>
                  </select>
                  {click && property_type == "" ? (
                    <div className="text-red-600">Select any one option</div>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-14 mt-4">
                <div className="w-1/2">
                  <div className="mt-2 mb-2">Add Rent</div>
                  <input
                    type="number"
                    onChange={handleChangeData}
                    value={storeData.addrent}
                    name="addrent"
                    className="border p-2 w-full border-black rounded "
                  />
                </div>
                <div className="w-1/2">
                  <div className="mt-2 mb-2">Owner Name</div>
                  <input
                    onChange={handleChangeData}
                    value={storeData.ownername}
                    name="ownername"
                    className="border p-2 w-full border-black rounded "
                  />
                </div>
              </div>
              <div className=" mt-5">
                <div className="text-lg ">Area In Square Feet</div>
                <input
                  type="number"
                  onChange={handleChangeData}
                  value={storeData.areaSqft}
                  name="areaSqft"
                  className="border  border-black rounded-md w-full p-2"
                />
              </div>
              <div className="lg:flex sm:flex gap-14 mt-4">
                <div className="w-1/2">
                  <div className="mt-2 mb-2">Sector*</div>
                  <input
                    type="number"
                    onChange={handleChangeData}
                    value={storeData.sector}
                    name="sector"
                    className="border p-2 w-full border-black rounded "
                  />
                </div>
                {click && storeData.sector == "" ? (
                  <div className="text-red-600">Required to fill</div>
                ) : null}
                <div className="w-1/2">
                  <div className="mt-4">Rent per month *</div>
                  <input
                    type="number"
                    className="border w-full border-black rounded p-2 "
                    onChange={handleChangeData}
                    value={storeData.rentpermonth}
                    name="rentpermonth"
                  />
                  {click && store.price == "" ? (
                    <div className="text-red-600">set price</div>
                  ) : null}
                </div>
              </div>
              <div className="lg:flex sm:flex gap-14 mt-4">
                <div className="w-1/2">
                  <div className="mt-2 mb-2">Booking Amount</div>
                  <input
                    type="number"
                    onChange={handleChangeData}
                    value={storeData.bookingamount}
                    name="bookingamount"
                    className="border p-2 w-full border-black rounded "
                  />
                </div>
                <div className="w-1/2">
                  <div className="mt-4">Booked By</div>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleChangeDate}
                    className="border w-full border-black rounded p-2"
                  />
                  {click && selectedDate == "" ? (
                    <div className="text-red-600">set Data</div>
                  ) : null}
                </div>
              </div>
              <div className="lg:flex sm:flex gap-14 mt-4">
                <div className="w-1/2">
                  <div className="mt-2 mb-2">Bathrooms</div>
                  <input
                    onChange={handleChangeData}
                    value={storeData.bathroom}
                    name="bathroom"
                    type="number"
                    className="border w-full p-2 border-black rounded "
                  />
                </div>
                <div className="w-1/2">
                  <div className="mt-2 mb-2">Bedrooms</div>
                  <input
                    onChange={handleChangeData}
                    value={storeData.bedrooms}
                    name="bedrooms"
                    type="number"
                    className="border w-full  p-2 border-black rounded "
                  />
                </div>
              </div>
              <div className="flex gap-10">
                <div>
                  <div className="mt-4 text-lg mb-2">Agreement</div>
                  <div className="flex gap-4">
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        className="border h-6 w-6  border-black rounded p-2 "
                        onChange={handleChangeData}
                        name="agreement"
                        value="yes"
                      />
                      <div>Yes</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        className="border w-6 h-6  border-black rounded p-2 "
                        onChange={handleChangeData}
                        name="agreement"
                        value="no"
                      />
                      <div>No</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-lg mb-2">Police Verification</div>
                  <div className="flex gap-4">
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        className="border h-6 w-6  border-black rounded p-2 "
                        onChange={handleChangeData}
                        name="police_verification"
                        value="yes"
                      />
                      <div>Yes</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        className="border w-6 h-6  border-black rounded p-2 "
                        onChange={handleChangeData}
                        name="police_verification"
                        value="no"
                      />
                      <div>No</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-lg mb-2">Security</div>
                  <div className="flex gap-4">
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        className="border h-6 w-6  border-black rounded p-2 "
                        onChange={handleChangeData}
                        name="security"
                        value="yes"
                      />
                      <div>Yes</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        className="border w-6 h-6  border-black rounded p-2 "
                        onChange={handleChangeData}
                        name="security"
                        value="no"
                      />
                      <div>No</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-lg mb-2">Commission</div>
                  <div className="flex gap-4">
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        className="border h-6 w-6  border-black rounded p-2 "
                        onChange={handleChangeData}
                        name="commission"
                        value="paid"
                      />
                      <div>Paid</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        className="border w-6 h-6  border-black rounded p-2 "
                        onChange={handleChangeData}
                        name="commission"
                        value="not"
                      />
                      <div>Not</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="mt-2 mb-2">Property Description</div>
                <textarea
                  onChange={handleChangeData}
                  value={storeData.property_description}
                  name="property_description"
                  className="border h-24 w-full p-2 border-black rounded "
                />
              </div>
              <div className="mt-4">
                <div className="mt-2 mb-2">Address*</div>
                <textarea
                  onChange={handleChangeData}
                  value={storeData.address}
                  name="address"
                  className="border h-24 w-full p-2 border-black rounded "
                />
              </div>
              {click && storeData.address == "" ? (
                <div className="text-red-600">Required to fill address</div>
              ) : null}
              <div className="flex items-center gap-2">
                <input name="checkbox" className="h-4 w-4" type="checkbox" />
                <div className="text-sm">
                  By submitting this form, you hereby agree that we may collect,
                  store and process your data that you provided.
                </div>
              </div>
              <div className="flex justify-center mb-10 mt-10  items-center">
                <div
                  onClick={() => {
                    HandleRent();
                  }}
                  className="bg-red-600 text-white lg:w-[400px]  cursor-pointer w-full   mt-4 rounded-md  p-2 text-center"
                >
                  Continue
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-xl">Carpet Area </div>
              <div className="flex  items-center ">
                <input
                  type="number"
                  onChange={handleChange}
                  value={store.carpet_area}
                  name="carpet_area"
                  className=" p-2  border-l rounded-l-md border-black border-t border-b "
                  placeholder="Carpet Area"
                />
                <select
                  onChange={handleSelect}
                  name="measure_unit"
                  value={measure}
                  className="bg-white h-[42px] p-2 border-l rounded-r-md  border-r border-t border-b border-black
          "
                >
                  <option value="sq.ft">sq.ft</option>
                  <option value="sq.yards">sq.yards</option>
                  <option value="sq.m">sq.m</option>
                  <option value="acres">acres</option>
                  <option value="marla">marla</option>
                  <option value="cents">cents</option>
                </select>
              </div>
              {click && store.carpet_area == "" ? (
                <div className="text-red-600"> carpet area is blank </div>
              ) : null}
              <div className=" mt-5 w-1/1 ">
                <div className="text-lg ">+ Add Plot Area</div>
                <input
                  type="number"
                  onChange={handleChange}
                  value={store.plot_area}
                  name="plot_area"
                  className="border w-full border-black rounded-md  p-2"
                />
              </div>
              {click && store.plot_area == "" ? (
                <div className="text-red-600"> plot area is blank </div>
              ) : null}
              <div className="items-center gap-14 mt-4 w-100">
                <div className="mt-6 w-100">
                  <div>Property for *</div>
                  <select
                    onChange={handlePurpose}
                    name="purpose"
                    value={sale}
                    className="border bg-white w-full h-11  border-black rounded p-2 "
                  >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                    <option value="rent">Rent</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              {click && sale == "" ? (
                <div className="text-red-600">Select any one option</div>
              ) : null}
              <div className="lg:flex  sm:flex gap-14 mt-4">
                <div className="w-1/2">
                  <div className="mt-2 mb-2">Property Name*</div>
                  <input
                    onChange={handleChange}
                    value={store.property_name}
                    name="property_name"
                    className="border p-2  w-full  border-black rounded "
                  />
                </div>
                <div className="w-1/2">
                  <div className="mt-4">Price *</div>
                  <input
                    type="number"
                    className="border w-full  border-black rounded p-2 "
                    onChange={handleChange}
                    value={store.price}
                    name="price"
                  />
                  {click && store.price == "" ? (
                    <div className="text-red-600">set price</div>
                  ) : null}
                </div>
              </div>

              <div className="lg:flex sm:flex gap-14 mt-4">
                <div className="w-1/2">
                  <div className="mt-2 mb-2">Bathrooms</div>
                  <input
                    onChange={handleChange}
                    value={store.bathroom}
                    name="bathroom"
                    type="number"
                    className="border w-full p-2 border-black rounded "
                  />
                </div>
                {click && store.bathroom == "" ? (
                  <>
                    <div className="text-red-600">fill betroom details</div>
                  </>
                ) : null}
                <div className="w-1/2">
                  <div className="mt-2 mb-2">Bedrooms</div>
                  <input
                    onChange={handleChange}
                    value={store.bedrooms}
                    name="bedrooms"
                    type="number"
                    className="border w-full  p-2 border-black rounded "
                  />
                </div>
                {click && store.bedrooms == "" ? (
                  <>
                    <div className="text-red-600">fill betroom details</div>
                  </>
                ) : null}
              </div>

              <div className="mt-4">
                <div className="mt-2 mb-2">Property Description</div>
                <textarea
                  onChange={handleChange}
                  value={store.property_description}
                  name="property_description"
                  className="border h-24 w-full p-2 border-black rounded "
                />
              </div>
              {click && store.property_description == "" ? (
                <>
                  <div className="text-red-600">
                    required to fill description
                  </div>
                </>
              ) : null}
              <div className="mt-4">
                <div className="mt-2 mb-2">Address*</div>
                <textarea
                  onChange={handleChange}
                  value={store.address}
                  name="address"
                  className="border h-24 w-full p-2 border-black rounded "
                />
              </div>
              {click && store.address == "" ? (
                <>
                  <div className="text-red-600">required to fill address</div>
                </>
              ) : null}
              <div className="flex items-center gap-2">
                <input name="checkbox" className="h-4 w-4" type="checkbox" />
                <div className="text-sm">
                  By submitting this form, you hereby agree that we may collect,
                  store and process your data that you provided.
                </div>
              </div>
              <div className="flex justify-center mb-10 mt-10  items-center">
                <div
                  onClick={() => {
                    HandleApi();
                  }}
                  className="bg-red-600 text-white lg:w-[400px]  cursor-pointer w-full   mt-4 rounded-md  p-2 text-center"
                >
                  Continue
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
