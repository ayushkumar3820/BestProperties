import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Bed from "../../assets/img/bed.png";
import Bath from "../../assets/img/bath.png";
import NoImage from "../../assets/img/image-not.jpg";
import OurServices from "./ourServices";
import Navbar from "./navbar";
import Searching from "./searching";
import BottomBar from "./bottomBar";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [userId] = useState(1); // You can set this dynamically based on your app logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const data = await response.json();

        // Transform the fetched data to match your wishlist structure
        const transformedData = data.map(item => ({
          id: item.id,
          name: item.title,
          price: Math.floor(Math.random() * 20000000), // Random price for demonstration
          location: `Location ${Math.floor(Math.random() * 100)}`, // Random location for demonstration
          type: ["Villa", "Apartment", "Cottage"][Math.floor(Math.random() * 3)], // Random type for demonstration
          image: NoImage,
        }));

        setWishlist(transformedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [userId]);

  const removeFromWishlist = (propertyId) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== propertyId);
    setWishlist(updatedWishlist);
  };

  const formatBudget = (value) => {
    if (!value || isNaN(value)) return "N/A";
    if (value >= 10000000) {
      return (
        "₹" +
        (value / 10000000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) +
        " Cr"
      );
    } else if (value >= 100000) {
      return (
        "₹" +
        (value / 100000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) +
        " Lac"
      );
    } else {
      return (
        "₹" +
        (value / 1000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }) +
        " Thousand"
      );
    }
  };

  // Logic for displaying current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(wishlist.length / itemsPerPage); i++) {
    pageNumbers.push(i);
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
                      src={property.image || NoImage}
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => removeFromWishlist(property.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
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
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {property.name || "N/A"}
                    </h3>
                    <p className="text-green-600 font-bold text-xl mb-2">
                      {formatBudget(property.price)}
                    </p>
                    <p className="text-gray-600 mb-2">
                      📍 {property.location || "N/A"}
                    </p>
                    <p className="text-gray-600 mb-4">
                      🏠 {property.type || "N/A"}
                    </p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          const modifiedName = (property.name || "property")
                            .replace(/\s/g, "-")
                            .replace(/[^\w\s]/g, "-")
                            .toLowerCase();
                          navigate(`/property/-${property.id}-${modifiedName}`);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => removeFromWishlist(property.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <nav className="block">
                <ul className="flex pl-0 rounded list-none flex-wrap">
                  {pageNumbers.map(number => (
                    <li key={number} className="mx-1">
                      <button
                        onClick={() => setCurrentPage(number)}
                        className={`px-3 py-2 rounded-md ${currentPage === number ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
