import React, { useState, useEffect } from "react";
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
  const [formErrors, setFormErrors] = useState({});
  const [measure, setMeasure] = useState("sq.ft");
  const [sale, setSale] = useState("Buy");
  const [propertyType, setPropertyType] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isChecked, setIsChecked] = useState(true);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData
      ? JSON.parse(savedData)
      : {
          plot_area: "",
          carpet_area: "",
          title: "",
          price: "",
          bedrooms: "",
          bathroom: "",
          property_type: "",
          property_name: "",
          address: "",
          property_description: "",
          areaSqft: "",
          sector: "",
          rentpermonth: "",
          bookedby: "",
          bookingamount: "",
          agreement: "",
          commission: "",
          security: "",
          police_verification: "",
        };
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // Safely parse responseData from localStorage
  let storedData;
  try {
    storedData = JSON.parse(localStorage.getItem("responseData") || "{}");
  } catch (error) {
    console.error("Error parsing responseData:", error);
    storedData = {};
  }
  const propertyAction = storedData.propertyType || "sale"; // Default to 'sale' if undefined

  const handleChangeDate = (date) => {
    setSelectedDate(date);
    setFormErrors((prev) => ({ ...prev, available_from: "" }));
  };

  const handleSelectMeasure = (event) => {
    setMeasure(event.target.value);
    setFormErrors((prev) => ({ ...prev, measure: "" }));
  };

  const handlePurpose = (event) => {
    setSale(event.target.value);
    setFormErrors((prev) => ({ ...prev, sale: "" }));
  };

  const handlePropertyType = (event) => {
    setPropertyType(event.target.value);
    setFormErrors((prev) => ({ ...prev, property_type: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    setFormErrors((prev) => ({ ...prev, checkbox: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (propertyAction === "Rent/Lease") {
      if (!formData.title) errors.title = "Title is required";
      if (!propertyType) errors.property_type = "Property type is required";
      if (!formData.sector) errors.sector = "Sector is required";
      if (!formData.rentpermonth)
        errors.rentpermonth = "Rent per month is required";
      if (!formData.address) errors.address = "Address is required";
      if (!selectedDate) errors.available_from = "Available date is required";
    } else {
      if (!formData.carpet_area) errors.carpet_area = "Carpet area is required";
      if (!formData.plot_area) errors.plot_area = "Plot area is required";
      if (!formData.property_name)
        errors.property_name = "Property name is required";
      if (!formData.price) errors.price = "Price is required";
      if (!formData.address) errors.address = "Address is required";
      if (!formData.property_description)
        errors.property_description = "Description is required";
      if (!sale) errors.sale = "Purpose is required";
    }
    if (!isChecked) errors.checkbox = "You must agree to the terms";
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmissionStatus("error");
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const tokens = localStorage.getItem("tokens");
    if (
      !tokens ||
      tokens === "undefined" ||
      tokens === "null" ||
      tokens.trim() === ""
    ) {
      console.error("Invalid tokens:", tokens);
      setSubmissionStatus("error");
      setErrorMessage("Please log in to continue.");
      navigate("/success");
      return;
    }

    setLoader(true);
    setSubmissionStatus(null);
    const url =
      propertyAction === "Rent/Lease"
        ? `${liveUrl}add-rent-property`
        : `${liveUrl}api/PropertyDetail/propertyDetails`;

    const payload = {
      ...formData,
      measure_unit: measure,
      property_type: propertyType,
      available_from: selectedDate ? selectedDate.toISOString() : null,
      tokens,
      propertyType: propertyAction,
    };

    console.log("Submitting to URL:", url);
    console.log("Payload:", payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.status === "done") {
        setSubmissionStatus("success");
        localStorage.removeItem("formData");
        localStorage.removeItem("responseData");
        setTimeout(() => navigate("/success"), 2000);
      } else {
        setSubmissionStatus("error");
        setErrorMessage(
          data.message || "Failed to submit property details. Please try again."
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionStatus("error");
      setErrorMessage(
        "An error occurred while submitting. Please check your connection and try again."
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="border border-green-800" />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-extrabold text-green-600 text-center uppercase mb-8">
            <AnimatedText text="Tell Us about Your Property" />
          </h1>
          {submissionStatus === "success" ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-green-600">
                Submission Successful!
              </h2>
              <p className="text-gray-600 mt-2">
                Your property details have been submitted. Redirecting...
              </p>
            </div>
          ) : (
            <>
              {submissionStatus === "error" && (
                <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-md">
                  <p>{errorMessage}</p>
                </div>
              )}
              <div className="space-y-6">
                {propertyAction === "Rent/Lease" ? (
                  <>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Title*
                        </label>
                        <input
                          onChange={handleChange}
                          value={formData.title}
                          name="title"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Enter title"
                        />
                        {formErrors.title && (
                          <p className="text-red-600 text-sm mt-1">
                            {formErrors.title}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Property Type*
                        </label>
                        <select
                          onChange={handlePropertyType}
                          name="property_type"
                          value={propertyType}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                          <option value="">Select Property Type</option>
                          <option value="1 BHK">1 BHK</option>
                          <option value="2 BHK">2 BHK</option>
                          <option value="3 BHK">3 BHK</option>
                          <option value="Room Only">Room Only</option>
                          <option value="Room With Kitchen">
                            Room With Kitchen
                          </option>
                          <option value="Rooms Only">Rooms Only</option>
                          <option value="Rooms With Kitchen">
                            Rooms With Kitchen
                          </option>
                          <option value="Boys PG">Boys PG</option>
                          <option value="Girls PG">Girls PG</option>
                          <option value="Shop">Shop</option>
                          <option value="Annex House">Annex House</option>
                          <option value="Other">Other</option>
                        </select>
                        {formErrors.property_type && (
                          <p className="text-red-600 text-sm mt-1">
                            {formErrors.property_type}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Add Rent*
                        </label>
                        <input
                          type="number"
                          onChange={handleChange}
                          value={formData.rentpermonth}
                          name="rentpermonth"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Enter rent amount"
                        />
                        {formErrors.rentpermonth && (
                          <p className="text-red-600 text-sm mt-1">
                            {formErrors.rentpermonth}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Owner Name
                        </label>
                        <input
                          onChange={handleChange}
                          value={formData.bookedby}
                          name="bookedby"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Enter owner name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Area (Square Feet)
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        value={formData.areaSqft}
                        name="areaSqft"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Enter area"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Sector*
                        </label>
                        <input
                          type="number"
                          onChange={handleChange}
                          value={formData.sector}
                          name="sector"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Enter sector"
                        />
                        {formErrors.sector && (
                          <p className="text-red-600 text-sm mt-1">
                            {formErrors.sector}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Available From*
                        </label>
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleChangeDate}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          dateFormat="MM/dd/yyyy"
                        />
                        {formErrors.available_from && (
                          <p className="text-red-600 text-sm mt-1">
                            {formErrors.available_from}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          onChange={handleChange}
                          value={formData.bathroom}
                          name="bathroom"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Enter number of bathrooms"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Bedrooms
                        </label>
                        <input
                          type="number"
                          onChange={handleChange}
                          value={formData.bedrooms}
                          name="bedrooms"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Enter number of bedrooms"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Agreement
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="agreement"
                              value="yes"
                              onChange={handleChange}
                              className="h-5 w-5"
                              checked={formData.agreement === "yes"}
                            />
                            Yes
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="agreement"
                              value="no"
                              onChange={handleChange}
                              className="h-5 w-5"
                              checked={formData.agreement === "no"}
                            />
                            No
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Police Verification
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="police_verification"
                              value="yes"
                              onChange={handleChange}
                              className="h-5 w-5"
                              checked={formData.police_verification === "yes"}
                            />
                            Yes
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="police_verification"
                              value="no"
                              onChange={handleChange}
                              className="h-5 w-5"
                              checked={formData.police_verification === "no"}
                            />
                            No
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Security
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="security"
                              value="yes"
                              onChange={handleChange}
                              className="h-5 w-5"
                              checked={formData.security === "yes"}
                            />
                            Yes
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="security"
                              value="no"
                              onChange={handleChange}
                              className="h-5 w-5"
                              checked={formData.security === "no"}
                            />
                            No
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">
                          Commission
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="commission"
                              value="paid"
                              onChange={handleChange}
                              className="h-5 w-5"
                              checked={formData.commission === "paid"}
                            />
                            Paid
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="commission"
                              value="not"
                              onChange={handleChange}
                              className="h-5 w-5"
                              checked={formData.commission === "not"}
                            />
                            Not
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Property Description
                      </label>
                      <textarea
                        onChange={handleChange}
                        value={formData.property_description}
                        name="property_description"
                        className="w-full p-2 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Describe your property"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Address*
                      </label>
                      <textarea
                        onChange={handleChange}
                        value={formData.address}
                        name="address"
                        className="w-full p-2 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Enter address"
                      />
                      {formErrors.address && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.address}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Carpet Area*
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          onChange={handleChange}
                          value={formData.carpet_area}
                          name="carpet_area"
                          className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Enter carpet area"
                        />
                        <select
                          onChange={handleSelectMeasure}
                          name="measure_unit"
                          value={measure}
                          className="w-32 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                          <option value="sq.ft">sq.ft</option>
                          <option value="sq.yards">sq.yards</option>
                          <option value="sq.m">sq.m</option>
                          <option value="acres">acres</option>
                          <option value="marla">marla</option>
                          <option value="cents">cents</option>
                        </select>
                      </div>
                      {formErrors.carpet_area && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.carpet_area}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Plot Area*
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        value={formData.plot_area}
                        name="plot_area"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Enter plot area"
                      />
                      {formErrors.plot_area && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.plot_area}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Property Feature*
                      </label>
                      <select
                        onChange={handlePurpose}
                        name="purpose"
                        value={sale}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      >
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                        <option value="Rent">Rent</option>
                        <option value="Other">Other</option>
                      </select>
                      {formErrors.sale && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.sale}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Property Name*
                        </label>
                        <input
                          onChange={handleChange}
                          value={formData.property_name}
                          name="property_name"
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Enter property name"
                        />
                        {formErrors.property_name && (
                          <p className="text-red-600 text-sm mt-1">
                            {formErrors.property_name}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Price*
                        </label>
                        <input
                          type="number"
                          onChange={handleChange}
                          value={formData.price}
                          name="price"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Enter price"
                        />
                        {formErrors.price && (
                          <p className="text-red-600 text-sm mt-1">
                            {formErrors.price}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          onChange={handleChange}
                          value={formData.bathroom}
                          name="bathroom"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Enter number of bathrooms"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                          Bedrooms
                        </label>
                        <input
                          type="number"
                          onChange={handleChange}
                          value={formData.bedrooms}
                          name="bedrooms"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Enter number of bedrooms"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Property Heading*
                      </label>
                      <textarea
                        onChange={handleChange}
                        value={formData.property_description}
                        name="property_description"
                        className="w-full p-2 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Describe your property"
                      />
                      {formErrors.property_description && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.property_description}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Address*
                      </label>
                      <textarea
                        onChange={handleChange}
                        value={formData.address}
                        name="address"
                        className="w-full p-2 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Enter address"
                      />
                      {formErrors.address && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.address}
                        </p>
                      )}
                    </div>
                  </>
                )}
                <div className="mt-6">
                  <div className="flex items-start gap-2">
                    <input
                      name="checkbox"
                      className="h-4 w-4 mt-1"
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <div>
                      <p className="text-sm text-gray-600">
                        By submitting this form, you hereby agree that we may
                        collect, store, and process your data that you provided.
                      </p>
                      {formErrors.checkbox && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.checkbox}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleSubmit}
                    disabled={loader}
                    className="w-full max-w-sm bg-red-600 text-white p-2 rounded-md font-semibold hover:bg-red-700 transition flex justify-center items-center"
                  >
                    {loader ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                        ></path>
                      </svg>
                    ) : (
                      "Continue"
                    )}
                  </button>
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

