// AnimatedText.jsx
import React from "react";

const AnimatedText = ({ text }) => {
  return (
    <div className="animation">
      {text.split("").map((char, index) => (
        <span key={index}>{char === " " ? "\u00A0" : char}</span>
      ))}
    </div>
  );
};

export default AnimatedText;
