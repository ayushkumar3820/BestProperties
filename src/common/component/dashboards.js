import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BottomBar from "./bottomBar";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";
import { liveUrl, token } from "./url";
import Cookie from "js-cookie";

export default function Dashboards() {
  const navigate = useNavigate();
  const [wishlistData, setWishlistData] = useState([]);
  const [myPropertiesData, setMyPropertiesData] = useState([]);
  const [requestPropertiesData, setrequestPropertiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("request");

  const getUserId = () => {
    const storedUserId = Cookie.get("userId");
    if (storedUserId) {
      return storedUserId;
    }
    console.warn("User ID not found in Cookie");
    return null;
  };

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchAllData(userId);
    } else {
      setError("User not logged in. Please login first.");
      setLoading(false);
    }
  }, []);

  const fetchAllData = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const [
        wishlistResponse,
        myPropertiesResponse,
        requestPropertiesResponse,
      ] = await Promise.all([
        fetch(`${liveUrl}api/User/getWishlist/?userid=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${liveUrl}api/MyProperties/getMyProperties?Userid=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${liveUrl}api/Buyer/getRequestedProperties?Userid=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (
        !wishlistResponse.ok ||
        !myPropertiesResponse.ok ||
        !requestPropertiesResponse.ok
      ) {
        const errorMessages = [];
        if (!wishlistResponse.ok)
          errorMessages.push(`Wishlist: ${wishlistResponse.status}`);
        if (!myPropertiesResponse.ok)
          errorMessages.push(`My Properties: ${myPropertiesResponse.status}`);
        if (!requestPropertiesResponse.ok)
          errorMessages.push(`request: ${requestPropertiesResponse.status}`);
        throw new Error(`Failed to fetch data - ${errorMessages.join(", ")}`);
      }

      const wishlistData = await wishlistResponse.json();
      const myPropertiesData = await myPropertiesResponse.json();
      const requestPropertiesData = await requestPropertiesResponse.json();

      setWishlistData(
        Array.isArray(wishlistData?.result)
          ? wishlistData.result
          : Array.isArray(wishlistData?.data)
          ? wishlistData.data
          : Array.isArray(wishlistData)
          ? wishlistData
          : []
      );

      setMyPropertiesData(
        Array.isArray(myPropertiesData?.result)
          ? myPropertiesData.result
          : Array.isArray(myPropertiesData?.data)
          ? myPropertiesData.data
          : Array.isArray(myPropertiesData)
          ? myPropertiesData
          : []
      );

      setrequestPropertiesData(
        Array.isArray(requestPropertiesData?.result)
          ? requestPropertiesData.result
          : Array.isArray(requestPropertiesData?.data)
          ? requestPropertiesData.data
          : Array.isArray(requestPropertiesData)
          ? requestPropertiesData
          : []
      );
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    const userId = getUserId();
    if (userId) {
      fetchAllData(userId);
    } else {
      setError("User not logged in. Please login first.");
    }
  };

 

  const TableSection = ({ title, data }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-2">Property ID</th>
              <th className="px-4 py-2">Property Type</th>
              <th className="px-4 py-2">Property Name</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Property For</th>
              <th className="px-4 py-2">Created at</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2">{item?.id || "N/A"}</td>
                <td className="px-4 py-2">{item?.property_type}</td>
                <td className="px-4 py-2">
                  {item?.name || item?.fullName || "N/A"}
                </td>
                <td className="px-4 py-2">
                  {item?.location || item?.address || "N/A"}
                </td>
                <td className="px-4 py-2">
                  ₹{item?.price || item?.budget || "N/A"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item?.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : item?.status === "shipped"
                        ? "bg-red-100 text-red-600"
                        : item?.status === "processing"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item?.property_for || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-2">{item?.created_at || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
        <BottomBar />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-gray-100 px-4 py-8"
        style={{ paddingLeft: "5rem", paddingRight: "6rem" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg cursor-pointer"
              onClick={() => setActiveSection("request")}
            >
              <h3 className="text-lg font-semibold mb-2">Schedule Properties</h3>
              <p className="text-3xl font-bold">
                {requestPropertiesData?.length || 0}
              </p>
            </div>
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white/CN p-6 rounded-xl shadow-lg cursor-pointer"
              onClick={() => setActiveSection("wishlist")}
            >
              <h3 className="text-lg font-semibold mb-2">Total Wishlist</h3>
              <p className="text-3xl font-bold">{wishlistData?.length || 0}</p>
            </div>
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg cursor-pointer"
              onClick={() => setActiveSection("myproperties")}
            >
              <h3 className="text-lg font-semibold mb-2">My Properties</h3>
              <p className="text-3xl font-bold">
                {myPropertiesData?.length || 0}
              </p>
            </div>
            
          </div>

          {activeSection && (
            <div className="mt-6">
              {activeSection === "wishlist" && (
                <TableSection title="Wishlist Details" data={wishlistData} />
              )}
              {activeSection === "myproperties" && (
                <TableSection
                  title="My Properties Details"
                  data={myPropertiesData}
                />
              )}
              {activeSection === "request" && (
                <TableSection
                  title="Schedule Properties "
                  data={requestPropertiesData}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
