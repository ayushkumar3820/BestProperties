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
  const [itemsPerPage, setItemsPerPage] = useState(9); // Now dynamic
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve userId from sessionStorage
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("Please log in to view your wishlist.");
    }
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;

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
          if (response.status === 401) {
            setError("Session expired. Please log in again.");
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result?.status === "done" && Array.isArray(result.result)) {
          const uniqueProperties = result.result.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.id === item.id)
          );

          const transformed = uniqueProperties.map((item) => ({
            id: item.id || crypto.randomUUID(), // Ensure unique ID
            property_name: item.name || "N/A",
            budget: parseInt(item.budget) || 0,
            address: item.address || item.city || "N/A",
            property_type: item.property_type || "N/A",
            image:
              item.image_one && item.image_one !== "NULL"
                ? `${liveUrl}propertyimage/${item.image_one}`
                : NoImage,
            unique_id: item.unique_id || "N/A",
            sqft: item.sqft || null,
            built_up_area: item.built_up_area || null,
            land_area: item.land_area || null,
            bedrooms: item.bedrooms || null,
            bathrooms: item.bathrooms || null,
            verified:
              item.verified && typeof item.verified === "string"
                ? item.verified
                : null,
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
  }, [userId, navigate]);

  const formatBudget = (value) => {
    if (!value || isNaN(value)) return "N/A";
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lac`;
    return `₹${(value / 1000).toFixed(2)} Thousand`;
  };

  const isValidArea = (area) => {
    return area != null && !isNaN(area) && area > 0;
  };

  const convertArea = (area, unit) => {
    if (!isValidArea(area)) return "N/A";
    switch (unit) {
      case "sq.m.":
        return `${(area * 0.092903).toFixed(2)} sq.m.`; // sq.ft. to sq.m.
      case "sq.yards":
        return `${(area * 0.111111).toFixed(2)} sq.yards`; // sq.ft. to sq.yards
      default:
        return `${area.toFixed(2)} sq.ft.`;
    }
  };

  const [unitSelections, setUnitSelections] = useState({});

  const handleUnitChange = (id, unit, type) => {
    setUnitSelections((prev) => ({
      ...prev,
      [`${id}-${type}`]: unit,
    }));
  };

  const handleNavigate = (panel) => {
    const modifiedPanelName = (panel.property_name || "property")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .toLowerCase();
    navigate(`/property/-${panel.id}-${modifiedPanelName}`);
  };

  const handleRemove = async (propertyId) => {
    if (wishlistLoading.has(propertyId)) return;

    setWishlistLoading((prev) => new Set([...prev, propertyId]));

    try {
      const response = await fetch(`${liveUrl}api/User/removeFromWishlist`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userId,
          property_id: propertyId,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "success" || result.status === "done") {
        setWishlist((prev) => prev.filter((item) => item.id !== propertyId));
        const newWishlistLength = wishlist.length - 1;
        const newTotalPages = Math.ceil(newWishlistLength / itemsPerPage);
        if (newWishlistLength === 0) {
          setCurrentPage(1); // Reset to page 1 if wishlist is empty
        } else if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
        // Optionally, add toast notification for success
        // toast.success("Property removed from wishlist!");
      } else {
        throw new Error(result.message || "Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // Optionally, add toast notification for error
      // toast.error("Failed to remove property from wishlist.");
    } finally {
      setWishlistLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <svg
              className="animate-spin h-10 w-10"
              fill="#014108"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
            </svg>
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
            <p className="text-red-500 text-xl mb-4">{error}</p>
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
            {wishlist.length}{" "}
            {wishlist.length === 1 ? "Property" : "Properties"}
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
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 justify-items-center">
              {currentItems.map((panel) => (
                <div
                  className="property-div w-full max-w-[350px] rounded-md shadow-lg transition duration-300 ease-in-out border-2"
                  key={panel.id}
                >
                  <div className="flex flex-col h-full">
                    <div
                      className="flex-shrink-0 relative cursor-pointer"
                      onClick={() => handleNavigate(panel)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => handleNavigate(panel))
                      }
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        className="rounded-t-md h-[200px] w-full object-cover"
                        src={panel.image}
                        alt={`Property ${panel.property_name || "Image"}`}
                        onError={(e) => (e.target.src = NoImage)}
                      />
                      <div className="absolute bottom-0 left-0 bg-[#d7dde5] text-[#303030] px-2 py-1 text-xs">
                        ID: {panel.unique_id}
                      </div>
                      <div
                        className="absolute top-2 right-2 cursor-pointer z-10 p-1 bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(panel.id);
                        }}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => handleRemove(panel.id))
                        }
                        role="button"
                        tabIndex={0}
                        title="Remove from wishlist"
                        aria-label="Remove from wishlist"
                      >
                        {wishlistLoading.has(panel.id) ? (
                          <svg
                            className="animate-spin h-6 w-6 text-gray-500"
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
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-6 w-6 text-red-500 fill-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow text-left bg-white border border-t leading-4 p-3">
                      <div className="mr-2">
                        <div className="flex items-center justify-between whitespace-nowrap text-lg text-red-800 pr-3">
                          <div className="flex items-center space-x-4">
                            <span
                              className="cursor-pointer font-bold"
                              onClick={() => handleNavigate(panel)}
                              onKeyDown={(e) =>
                                handleKeyDown(e, () => handleNavigate(panel))
                              }
                              role="button"
                              tabIndex={0}
                            >
                              {formatBudget(panel.budget)}
                            </span>
                            {isValidArea(panel.sqft) && (
                              <div className="flex items-center space-x-2">
                                <span
                                  className="text-[#303030] text-sm cursor-pointer"
                                  onClick={() => handleNavigate(panel)}
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, () =>
                                      handleNavigate(panel)
                                    )
                                  }
                                  role="button"
                                  tabIndex={0}
                                >
                                  {convertArea(
                                    panel.sqft,
                                    unitSelections[`${panel.id}-main`] ||
                                      "sq.ft."
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {isValidArea(panel.built_up_area) && (
                          <div className="flex items-center space-x-2 mt-2">
                            <span
                              className="text-[#303030] text-sm cursor-pointer"
                              onClick={() => handleNavigate(panel)}
                              onKeyDown={(e) =>
                                handleKeyDown(e, () => handleNavigate(panel))
                              }
                              role="button"
                              tabIndex={0}
                            >
                              Built-Up:{" "}
                              {convertArea(
                                panel.built_up_area,
                                unitSelections[`${panel.id}-built`] || "sq.ft."
                              )}
                            </span>
                            <div className="relative">
                              <select
                                value={
                                  unitSelections[`${panel.id}-built`] ||
                                  "sq.ft."
                                }
                                onChange={(e) =>
                                  handleUnitChange(
                                    panel.id,
                                    e.target.value,
                                    "built"
                                  )
                                }
                                className="appearance-none bg-white border text-[#303030] p-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#050505]"
                                aria-label="Select area unit for built-up area"
                              >
                                <option value="sq.ft.">sq.ft.</option>
                                <option value="sq.m.">sq.m.</option>
                                <option value="sq.yards">sq.yards</option>
                              </select>
                              <svg
                                fill="black"
                                className="h-3 w-3 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#303030]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                              </svg>
                            </div>
                          </div>
                        )}
                        {isValidArea(panel.land_area) && (
                          <div className="flex items-center space-x-2 mt-2">
                            <span
                              className="text-[#303030] text-sm cursor-pointer"
                              onClick={() => handleNavigate(panel)}
                              onKeyDown={(e) =>
                                handleKeyDown(e, () => handleNavigate(panel))
                              }
                              role="button"
                              tabIndex={0}
                            >
                              Land Area:{" "}
                              {convertArea(
                                panel.land_area,
                                unitSelections[`${panel.id}-land`] || "sq.ft."
                              )}
                            </span>
                            <div className="relative">
                              <select
                                value={
                                  unitSelections[`${panel.id}-land`] || "sq.ft."
                                }
                                onChange={(e) =>
                                  handleUnitChange(
                                    panel.id,
                                    e.target.value,
                                    "land"
                                  )
                                }
                                className="appearance-none bg-white border text-[#303030] p-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#050505]"
                                aria-label="Select area unit for land area"
                              >
                                <option value="sq.ft.">sq.ft.</option>
                                <option value="sq.m.">sq.m.</option>
                                <option value="sq.yards">sq.yards</option>
                              </select>
                              <svg
                                fill="black"
                                className="h-3 w-3 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#303030]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                              </svg>
                            </div>
                          </div>
                        )}
                        <div
                          className="flex gap-2 mt-2 items-center text-[#303030] cursor-pointer"
                          onClick={() => handleNavigate(panel)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, () => handleNavigate(panel))
                          }
                          role="button"
                          tabIndex={0}
                        >
                          <svg
                            fill="#15803d"
                            className="h-4 w-4 fill-[#303030]"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                          >
                            <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 88.4c0 8-1.5 15.8-4.5 23.1l-88 0c-2.9 0-5.6-.6-8-1.7l-191-95c-5.6-2.8-9.2-8.3-9.8-14.3 l-4-160.2c0-17.7 14.3-32 32-32l31.1 0 0-80.2c0-26.5 21.5-48 48-48l32 0 0-63.9c0-8.7 3.5-17 10-23.6c6.4-6.6 15.2-10.3 24.2-10.3l96 0c9.1 0 17.8 3.7 24.2 10.3c6.5 6.6 10 14.9 10 23.6l0 63.9 32 0c26.5 0 48 21.5 48 48l0 80.2 0 31.9zM272 192a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm-48 256l0-112 96 48 0 112-96-48z" />
                          </svg>
                          <div className="leading-6 text-[#303030] text-sm truncate">
                            {panel.property_name || "N/A"}
                          </div>
                        </div>
                        <div
                          className="flex gap-2 mt-2 items-center text-[#303030] cursor-pointer"
                          onClick={() => handleNavigate(panel)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, () => handleNavigate(panel))
                          }
                          role="button"
                          tabIndex={0}
                        >
                          <svg
                            fill="#15803d"
                            className="h-4 w-4 fill-[#303030]"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M32 32C14.3 32 0 46.3 0 64V448c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H32zM160 160c0-17.7 14.3-32 32-32H320c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V160zM288 352c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V288c0-17.7 14.3-32 32-32H256c17.7 0 32 14.3 32 32v64z" />
                          </svg>
                          <div className="leading-6 text-[#303030] text-sm truncate">
                            {panel.property_type || "N/A"}
                          </div>
                        </div>
                        <div
                          className="flex gap-2 mt-2 items-center text-[#303030] cursor-pointer"
                          onClick={() => handleNavigate(panel)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, () => handleNavigate(panel))
                          }
                          role="button"
                          tabIndex={0}
                        >
                          <svg
                            fill="#15803d"
                            className="h-4 w-4 fill-[#303030]"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                          >
                            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                          </svg>
                          <div className="leading-6 text-[#303030] text-sm truncate">
                            {panel.address || "N/A"}
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-3 mt-2 cursor-pointer"
                          onClick={() => handleNavigate(panel)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, () => handleNavigate(panel))
                          }
                          role="button"
                          tabIndex={0}
                        >
                          {panel.bedrooms != null && panel.bedrooms > 0 && (
                            <div className="flex items-center gap-2">
                              <svg
                                fill="#15803d"
                                className="h-4 w-4 fill-[#303030]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"
                              >
                                <path d="M176 256c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 36.8-80 80 35.8 80 80 80zm0-128c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zm304 128c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 36.8-80 80 35.8 80 80 80zm0-128c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM64 384c0-17.7 14.3-32 32-32H544c17.7 0 32 14.3 32 32v64H64V384z" />
                              </svg>
                              <div className="text-sm font-bold text-[#303030]">
                                {panel.bedrooms}
                              </div>
                            </div>
                          )}
                          {panel.bathrooms != null && panel.bathrooms > 0 && (
                            <div className="flex items-center gap-2">
                              <svg
                                fill="#15803d"
                                className="h-4 w-4 fill-[#303030]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path
                                  d="M64 128C28.7 128 0 156.7 0 192v96c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32V192c0-35.3-28.7-64-64-64H64zm448 256H0V512===

H512V384z"
                                />
                              </svg>
                              <div className="text-sm font-bold text-[#303030]">
                                {panel.bathrooms}
                              </div>
                            </div>
                          )}
                          {panel.verified && (
                            <div className="flex items-center gap-2">
                              <img
                                className="w-5"
                                src={panel.verified}
                                alt="Verified property icon"
                                onError={(e) => (e.target.src = NoImage)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 mb-14 gap-4 items-center">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  Back
                </button>
                <span className="text-lg">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                </button>
                <select
                  className="bg-white border border-green-600 p-2 rounded-md min-w-[100px] focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  aria-label="Select items per page"
                >
                  <option value="9">9 per page</option>
                  <option value="18">18 per page</option>
                  <option value="36">36 per page</option>
                  <option value="100">100 per page</option>
                </select>
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
