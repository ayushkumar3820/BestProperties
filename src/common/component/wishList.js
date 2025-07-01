// src/components/WishlistPage.js
import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";
import BottomBar from "./bottomBar";

export default function WishlistPage() {
  const [properties, setProperties] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Dummy API
  const fetchProperties = () =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: "3BHK Luxury Flat",
            location: "Mohali",
            price: 5200000,
            image: "https://via.placeholder.com/300x200?text=3BHK+Flat",
            type: "Flat",
          },
          {
            id: 2,
            name: "Independent Villa",
            location: "Chandigarh",
            price: 9500000,
            image: "https://via.placeholder.com/300x200?text=Villa",
            type: "Villa",
          },
          {
            id: 3,
            name: "Residential Plot",
            location: "Kharar",
            price: 3000000,
            image: "https://via.placeholder.com/300x200?text=Plot",
            type: "Plot",
          },
        ]);
      }, 1000)
    );

  useEffect(() => {
    fetchProperties().then((data) => setProperties(data));
    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isWished = (id) => wishlist.some((item) => item.id === id);

  const toggleWishlist = (property) => {
    if (isWished(property.id)) {
      setWishlist(wishlist.filter((item) => item.id !== property.id));
    } else {
      setWishlist([...wishlist, property]);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
          🏠 Available Properties
        </h2>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {properties.map((property) => (
            <div
              key={property.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                width: "300px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={property.image}
                alt={property.name}
                style={{ width: "100%", borderRadius: "4px" }}
              />
              <h3>{property.name}</h3>
              <p>
                <strong>📍 Location:</strong> {property.location}
              </p>
              <p>
                <strong>🏷 Type:</strong> {property.type}
              </p>
              <p>
                <strong>💰 Price:</strong> ₹
                {property.price.toLocaleString("en-IN")}
              </p>
              <button
                style={{
                  background: isWished(property.id) ? "#dc2626" : "#16a34a",
                  color: "#fff",
                  padding: "8px 12px",
                  border: "none",
                  marginTop: "10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => toggleWishlist(property)}
              >
                {isWished(property.id)
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </button>
            </div>
          ))}
        </div>

        <h2 style={{ marginTop: "40px", fontSize: "22px" }}>❤️ My Wishlist</h2>
        {wishlist.length === 0 ? (
          <p>No properties added to wishlist yet.</p>
        ) : (
          <ul>
            {wishlist.map((item) => (
              <li key={item.id}>
                {item.name} in {item.location} – ₹
                {item.price.toLocaleString("en-IN")}
              </li>
            ))}
          </ul>
        )}
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
