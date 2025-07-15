import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoImage from "../../assets/img/image-not.jpg";
import OurServices from "./ourServices";
import Navbar from "./navbar";
import Searching from "./searching";
import BottomBar from "./bottomBar";
import { liveUrl, token } from "./url";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(null);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  useEffect(() => {
    // Retrieve userId from sessionStorage
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return; // Don't fetch if userId is not set

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${liveUrl}api/User/getWishlist/?userid=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result?.status === "done" && Array.isArray(result.result)) {
          // Remove duplicates based on property ID
          const uniqueProperties = result.result.filter((item, index, self) =>
            index === self.findIndex(t => t.id === item.id)
          );

          const transformed = uniqueProperties.map((item) => ({
            id: item.id,
            name: item.name || "N/A",
            price: parseInt(item.budget) || 0,
            location: item.address || item.city || "N/A",
            type: item.property_type || "N/A",
            image:
              item.image_one && item.image_one !== "NULL"
                ? `${liveUrl}propertyimage/${item.image_one}`
                : NoImage,
          }));

          setWishlist(transformed);
        } else {
          setWishlist([]);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load wishlist. Please try again.");
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  const handleRemove = async (propertyId) => {
    if (removeLoading === propertyId) return;

    setRemoveLoading(propertyId);

    try {
      const response = await fetch(
        `${liveUrl}api/User/removeFromWishlist`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: userId,
            property_id: propertyId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "success" || result.status === "done") {
        setWishlist((prev) =>
          prev.filter((item) => item.id !== propertyId)
        );

        const newWishlistLength = wishlist.length - 1;
        const newTotalPages = Math.ceil(newWishlistLength / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }

        alert("Property removed from wishlist successfully!");
      } else {
        throw new Error(result.message || "Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert(`Error: ${error.message || "Something went wrong while removing property"}`);
    } finally {
      setRemoveLoading(null);
    }
  };

  const formatBudget = (value) => {
    if (!value || isNaN(value)) return "N/A";
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lac`;
    return `₹${(value / 1000).toFixed(2)} Thousand`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          </div>
        </div>
        <OurServices />
        <Searching />
        <BottomBar />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        </div>
        <OurServices />
        <Searching />
        <BottomBar />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">My Wishlist</h1>
          <div className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-md">
            {wishlist.length} {wishlist.length === 1 ? "Property" : "Properties"}
          </div>
        </div>
        {currentItems.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="text-xl text-gray-600 mb-4">Your wishlist is empty</p>
            <button
              onClick={() => navigate("/property")}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
              {currentItems.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = NoImage;
                      }}
                    />
                    <button
                      onClick={() => handleRemove(property.id)}
                      disabled={removeLoading === property.id}
                      className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {property.name}
                    </h3>
                    <p className="text-green-600 font-bold text-xl mb-2">
                      {formatBudget(property.price)}
                    </p>
                    <p className="text-gray-600 mb-2">📍 {property.location}</p>
                    <p className="text-gray-600 mb-4">🏠 {property.type}</p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          const slug = (property.name || "property")
                            .replace(/\s+/g, "-")
                            .replace(/[^\w-]/g, "")
                            .toLowerCase();
                          navigate(`/property/-${property.id}-${slug}`);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleRemove(property.id)}
                        disabled={removeLoading === property.id}
                        className={`transition-colors ${
                          removeLoading === property.id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500 hover:text-red-700"
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
                <nav>
                  <ul className="flex pl-0 rounded list-none flex-wrap">
                    <li className="mx-1">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-md ${
                          currentPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (num) => (
                        <li key={num} className="mx-1">
                          <button
                            onClick={() => setCurrentPage(num)}
                            className={`px-3 py-2 rounded-md ${
                              currentPage === num
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                          >
                            {num}
                          </button>
                        </li>
                      )
                    )}
                    <li className="mx-1">
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-md ${
                          currentPage === totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
