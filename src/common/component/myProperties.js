import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoImage from "../../assets/img/image-not.jpg";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";
import BottomBar from "./bottomBar";
import { liveUrl, token } from "./url";

export default function MyProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${liveUrl}api/MyProperties/getMyProperties?Userid=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.status === "done" && Array.isArray(data.result)) {
          const transformed = data.result.map((item) => ({
            id: item.id,
            name: item.name || "N/A",
            price: item.budget_in_words || "N/A",
            location: item.address || item.city || "N/A",
            type: item.property_type || "N/A",
            image:
              item.image_one && item.image_one !== "NULL"
                ? `${liveUrl}propertyimage/${item.image_one}`
                : NoImage,
          }));
          setProperties(transformed);
        } else {
          setProperties([]);
        }
      } catch (err) {
        setError("Failed to load properties.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleRemove = async (propertyId) => {
    setRemoveLoading(propertyId);

    try {
      const res = await fetch(`${liveUrl}api/User/removeFromWishlist`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: userId, property_id: propertyId }),
      });

      const result = await res.json();

      if (result.status === "success" || result.status === "done") {
        const updated = properties.filter((p) => p.id !== propertyId);
        setProperties(updated);

        const newTotalPages = Math.ceil(updated.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }

        alert("Property removed successfully!");
      } else {
        throw new Error("Removal failed.");
      }
    } catch (err) {
      alert("Error removing property.");
    } finally {
      setRemoveLoading(null);
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = properties.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">My Properties</h1>
          <div className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-md">
            {properties.length} {properties.length === 1 ? "Property" : "Properties"}
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && currentItems.length === 0 && (
          <div className="text-center py-20 text-gray-600 text-lg">
            <p>No properties found.</p>
          </div>
        )}

        {!loading && !error && currentItems.length > 0 && (
          <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
              {currentItems.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => (e.target.src = NoImage)}
                    />
                    <button
                      onClick={() => handleRemove(property.id)}
                      disabled={removeLoading === property.id}
                      className={`absolute top-2 right-2 p-2 rounded-full ${
                        removeLoading === property.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                    >
                      {removeLoading === property.id ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <h2 className="font-bold text-lg mb-1">{property.name}</h2>
                    <p className="text-green-600 font-semibold">{property.price}</p>
                    <p className="text-gray-600 text-sm">📍 {property.location}</p>
                    <p className="text-gray-600 text-sm">🏠 {property.type}</p>
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => {
                          const slug = (property.name || "property")
                            .replace(/\s+/g, "-")
                            .replace(/[^\w-]/g, "")
                            .toLowerCase();
                          navigate(`/property/-${property.id}-${slug}`);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleRemove(property.id)}
                        disabled={removeLoading === property.id}
                        className={`text-red-500 hover:text-red-700 ${
                          removeLoading === property.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {removeLoading === property.id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <ul className="flex gap-1">
                  <li>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded ${
                        currentPage === 1 ? "bg-gray-300 text-gray-500" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      Prev
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <li key={num}>
                      <button
                        onClick={() => setCurrentPage(num)}
                        className={`px-3 py-2 rounded ${
                          currentPage === num
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {num}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded ${
                        currentPage === totalPages
                          ? "bg-gray-300 text-gray-500"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
