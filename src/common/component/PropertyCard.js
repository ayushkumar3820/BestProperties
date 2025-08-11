import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Bed from "../../assets/img/bed.png";
import Bath from "../../assets/img/bath.png";
import NoImage from "../../assets/img/image-not.jpg";

// Helper functions for localStorage
const loadWishlistFromStorage = () => {
  const stored = localStorage.getItem("wishlist");
  return stored ? JSON.parse(stored) : [];
};

const saveWishlistToStorage = (wishlist) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

// Helper function to normalize budget - same as in main component
const normalizeBudget = (panel) => {
  // First try budget_in_words as it's more descriptive
  const budgetInWords = panel.budget_in_words || '';
  const budgetValue = panel.budget || '';
  
  // Handle budget_in_words first (more accurate)
  if (budgetInWords) {
    const budgetStr = String(budgetInWords).toLowerCase().trim();
    
    // Handle "lakhs" format like "41,00,000 lakhs"
    if (budgetStr.includes('lakh')) {
      const numStr = budgetStr.replace(/[^\d.,]/g, '').replace(/,/g, '');
      const num = parseFloat(numStr);
      if (!isNaN(num)) {
        return num * 100000;
      }
    }
    
    // Handle "crore" format like "4.50 crore"
    if (budgetStr.includes('crore')) {
      const numStr = budgetStr.match(/[\d.]+/);
      if (numStr) {
        const num = parseFloat(numStr[0]);
        if (!isNaN(num)) {
          return num * 10000000;
        }
      }
    }
  }
  
  // Then handle simple budget field
  if (budgetValue) {
    const budgetStr = String(budgetValue).toLowerCase().trim();
    
    // If it's already a large number, use as is
    if (!isNaN(budgetValue) && parseInt(budgetValue) > 1000000) {
      return parseInt(budgetValue);
    }
    
    // If it's a small number, check if it should be converted
    const numericValue = parseFloat(budgetStr);
    if (!isNaN(numericValue)) {
      // Small numbers (1-100) might be in crores
      if (numericValue <= 100) {
        return numericValue * 10000000;
      }
      // Otherwise use as is
      return numericValue;
    }
  }
  
  return 0;
};

// Helper function to format budget
const formatBudgetDisplay = (panel) => {
  const normalizedBudget = normalizeBudget(panel);
  
  if (!normalizedBudget || normalizedBudget === 0) {
    // Fallback to budget_in_words if available
    if (panel.budget_in_words) {
      return panel.budget_in_words;
    }
    return "Price on Request";
  }
  
  if (normalizedBudget >= 10000000) {
    return `₹${(normalizedBudget / 10000000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Cr`;
  }
  
  if (normalizedBudget >= 100000) {
    return `₹${(normalizedBudget / 100000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Lac`;
  }
  
  if (normalizedBudget >= 1000) {
    return `₹${(normalizedBudget / 1000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })} Thousand`;
  }
  
  return `₹${normalizedBudget.toLocaleString()}`;
};

const PropertyCard = ({
  panel,
  index,
  isWishlist,
  toggleWishlist,
  wishlistLoading,
  formatBudget, // Keep this prop but we'll use our own function
  convertArea,
  unitSelections,
  handleUnitChange,
  sanitizePropertyName,
}) => {
  const navigate = useNavigate();
  const [localWishlist, setLocalWishlist] = useState(loadWishlistFromStorage());
  const [wishlistStatus, setWishlistStatus] = useState(false);

  // Sync wishlist status with localStorage and prop
  useEffect(() => {
    const propertyId = panel.id || panel.property_id;
    const storedWishlist = loadWishlistFromStorage();
    setLocalWishlist(storedWishlist);
    setWishlistStatus(isWishlist(propertyId) || storedWishlist.includes(propertyId));
  }, [panel.id, panel.property_id, isWishlist]);

  // Handle wishlist toggle
  const handleToggleWishlist = useCallback(
    async (e) => {
      e.stopPropagation();
      const propertyId = panel.id || panel.property_id;
      if (!propertyId) return;

      try {
        // Optimistically update UI
        setWishlistStatus(!wishlistStatus);
        const updatedWishlist = wishlistStatus
          ? localWishlist.filter((id) => id !== propertyId)
          : [...localWishlist, propertyId];
        setLocalWishlist(updatedWishlist);
        saveWishlistToStorage(updatedWishlist);

        // Call server to sync
        await toggleWishlist(panel);

        // Re-sync with server state
        const storedWishlist = loadWishlistFromStorage();
        setWishlistStatus(isWishlist(propertyId) || storedWishlist.includes(propertyId));
      } catch (error) {
        console.error("Failed to toggle wishlist:", error);
        // Revert optimistic update on error
        setWishlistStatus(wishlistStatus);
        setLocalWishlist(loadWishlistFromStorage());
      }
    },
    [panel, toggleWishlist, wishlistStatus, localWishlist, isWishlist]
  );

  return (
    <div
      className="property-div w-full max-w-[350px] rounded-md shadow-lg transition duration-300 ease-in-out"
      key={`${panel.id || index}-${wishlistStatus}`}
    >
      <div className="flex flex-col h-full">
        <div
          className="flex-shrink-0 relative cursor-pointer"
          onClick={() => {
            const modifiedPanelName = sanitizePropertyName(
              panel.property_name || panel.name
            );
            navigate(`/property/-${panel.id || index}-${modifiedPanelName}`);
          }}
        >
          {panel.image &&
          typeof panel.image === "string" &&
          (panel.image.endsWith(".jpg") ||
            panel.image.endsWith(".jpeg") ||
            panel.image.endsWith(".png") ||
            panel.image.endsWith(".svg")) ? (
            <img
              className="rounded-t-md h-[200px] w-full object-cover"
              src={panel.image}
              alt={`Property ${panel.property_name || panel.name || "Image"}`}
            />
          ) : (
            <img
              className="rounded-t-md h-[200px] w-full object-cover"
              src={NoImage}
              alt="No image available for this property"
            />
          )}
          <div className="absolute bottom-0 left-0 bg-[#d7dde5] text-[#303030] px-2 py-1 text-xs">
            ID: {panel.unique_id || "N/A"}
          </div>
          <div
            className="absolute top-2 right-2 cursor-pointer z-10 p-1 bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200"
            onClick={handleToggleWishlist}
            title={wishlistStatus ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlistLoading.has(panel.id || panel.property_id) ? (
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              <svg
                className={`h-6 w-6 cursor-pointer transition-all duration-300 transform ${
                  wishlistStatus
                    ? "fill-red-500 text-red-500 scale-110"
                    : "fill-gray-400 text-gray-400 hover:fill-red-300 hover:text-red-300"
                }`}
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
                <span className="cursor-pointer font-bold">
                  {formatBudgetDisplay(panel)}
                </span>
                {panel.sqft && (
                  <div className="flex items-center space-x-2">
                    <span className="text-[#303030] text-sm cursor-pointer">
                      {convertArea(
                        panel.sqft,
                        unitSelections[`${panel.id || index}-main`] || "sq.ft.",
                        panel.id || index,
                        "main"
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {panel.built_up_area && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-[#303030] text-sm cursor-pointer">
                  Built-Up:{" "}
                  {convertArea(
                    panel.built_up_area,
                    unitSelections[`${panel.id || index}-built`] || "sq.ft.",
                    panel.id || index,
                    "built"
                  )}
                </span>
                <div className="relative">
                  <select
                    value={
                      unitSelections[`${panel.id || index}-built`] || "sq.ft."
                    }
                    onChange={(e) =>
                      handleUnitChange(panel.id || index, e.target.value, "built")
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
            {panel.land_area && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-[#303030] text-sm cursor-pointer">
                  Land Area:{" "}
                  {convertArea(
                    panel.land_area,
                    unitSelections[`${panel.id || index}-land`] || "sq.ft.",
                    panel.id || index,
                    "land"
                  )}
                </span>
                <div className="relative">
                  <select
                    value={
                      unitSelections[`${panel.id || index}-land`] || "sq.ft."
                    }
                    onChange={(e) =>
                      handleUnitChange(panel.id || index, e.target.value, "land")
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
            <div className="flex gap-2 mt-2 items-center text-[#303030] cursor-pointer">
              <div>
                <svg
                  fill="#15803d"
                  className="h-4 w-4 fill-[#303030]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 88.4c0 8-1.5 15.8-4.5 23.1l-88 0c-2.9 0-5.6-.6-8-1.7l-191-95c-5.6-2.8-9.2-8.3-9.8-14.3l-4-160.2c0-17.7 14.3-32 32-32l31.1 0 0-80.2c0-26.5 21.5-48 48-48l32 0 0-63.9c0-8.7 3.5-17 10-23.6c6.4-6.6 15.2-10.3 24.2-10.3l96 0c9.1 0 17.8 3.7 24.2 10.3c6.5 6.6 10 14.9 10 23.6l0 63.9 32 0c26.5 0 48 21.5 48 48l0 80.2 0 31.9zM272 192a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm-48 256l0-112 96 48 0 112-96-48z" />
                </svg>
              </div>
              <div className="leading-6 text-[#303030] text-sm truncate">
                {panel.property_name || panel.name || "N/A"}
              </div>
            </div>
            <div className="flex gap-2 mt-2 items-center text-[#303030] cursor-pointer">
              <div>
                <svg
                  fill="#15803d"
                  className="h-4 w-4 fill-[#303030]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M32 32C14.3 32 0 46.3 0 64V448c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H32zM160 160c0-17.7 14.3-32 32-32H320c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V160zM288 352c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V288c0-17.7 14.3-32 32-32H256c17.7 0 32 14.3 32 32v64z" />
                </svg>
              </div>
              <div className="leading-6 text-[#303030] text-sm truncate">
                {panel.property_type || "N/A"}
              </div>
            </div>
            <div className="flex gap-2 mt-2 items-center text-[#303030] cursor-pointer">
              <div>
                <svg
                  fill="#15803d"
                  className="h-4 w-4 fill-[#303030]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                </svg>
              </div>
              <div className="leading-6 text-[#303030] text-sm truncate">
                {panel.address || "N/A"}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 cursor-pointer">
              <div className="flex items-center gap-2">
                {panel.bedrooms != null && panel.bedrooms > 0 && (
                  <img className="w-6" src={Bed} alt="Bedroom icon" />
                )}
                <div className="text-sm font-bold text-[#303030]">
                  {panel.bedrooms != null && panel.bedrooms > 0
                    ? panel.bedrooms
                    : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {panel.bathrooms != null && panel.bathrooms > 0 && (
                  <img className="w-6" src={Bath} alt="Bathroom icon" />
                )}
                <div className="text-sm font-bold text-[#303030]">
                  {panel.bathrooms != null && panel.bathrooms > 0
                    ? panel.bathrooms
                    : null}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {panel.verified && typeof panel.verified === "string" && (
                  <img
                    className="w-5"
                    src={panel.verified}
                    alt="Verified property icon"
                    onError={(e) => (e.target.src = NoImage)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;