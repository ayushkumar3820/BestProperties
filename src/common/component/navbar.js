import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const mobileDropdownRef = useRef(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token");
      const flag = sessionStorage.getItem("isLoggedIn");
      const isValid =
        token &&
        token !== "undefined" &&
        token !== "null" &&
        token.trim() &&
        flag === "true";
      setIsLoggedIn(isValid);
      if (!isValid && token) {
        sessionStorage.clear();
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("sessionStorageChange", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("sessionStorageChange", checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    window.dispatchEvent(new Event("sessionStorageChange"));
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const menuItems = [
    { path: "/property", label: "For Sale" },
    { path: "/buyer-data", label: "Buy" },
    { path: "/for-rent", label: "For Rent" },
    { path: "/projects", label: "Projects" },
    {
      path: isLoggedIn ? "/sell-with-us" : "/login",
      label: "Sell With Us",
      state: !isLoggedIn ? { from: location.pathname } : undefined,
    },
    { path: "/home-loan", label: "Home Loan" },
  ];

  const dropdownItems = isLoggedIn
    ? [
        { path: "/dashboards", label: "Dashboards" },
        { path: "/wishlist", label: "WishList" },
         { path: "/myProperties", label: "MyProperties" },
        { path: "/resetPassword/:token", label: "Reset Password" },

        { path: null, label: "Logout", onClick: handleLogout },
      ]
    : [
        { path: "/login", label: "Login", state: { from: location.pathname } },
        {
          path: isLoggedIn ? "/wishlist" : "/login",
          label: "WishList",
          state: !isLoggedIn ? { form: location.pathname } : undefined,
        },
           {
          path: isLoggedIn ? "/myProperties" : "/login",
          label: "MyProperties",
          state: !isLoggedIn ? { form: location.pathname } : undefined,
        },
        // { path: "/myProperties",  label: "MyProperties" },
        //  { path: "/forget-password", label: "Forget Password" },
        // { path: "/wishl ist", label: "Recommends Properties" },
      ];

  const renderMenuItem = (item) => {
    if (item.hideWhenLoggedIn && isLoggedIn) return null;
    const isActive = location.pathname === item.path;
    const className = `menu-item text-black font-semibold p-3 border-b border-gray-200 ${
      isActive ? "bg-green-600 text-white" : ""
    }`;
    return item.path ? (
      <Link
        key={item.path}
        to={item.path}
        state={item.state}
        onClick={() => setIsMenuOpen(false)}
        className={className}
      >
        {item.label}
      </Link>
    ) : (
      <button
        key={item.label}
        onClick={() => {
          item.onClick();
          setIsMenuOpen(false);
        }}
        className={className}
      >
        {item.label}
      </button>
    );
  };

  const renderDesktopMenuItem = (item) => {
    if (item.hideWhenLoggedIn && isLoggedIn) return null;
    const isActive = location.pathname === item.path;
    const className = `menu-item text-black font-semibold rounded-sm p-1 lg:px-1 ${
      isActive ? "bg-green-600 text-white" : ""
    }`;
    return item.path ? (
      <Link
        key={item.path}
        to={item.path}
        state={item.state}
        className={className}
      >
        {item.label}
      </Link>
    ) : (
      <button key={item.label} onClick={item.onClick} className={className}>
        {item.label}
      </button>
    );
  };

  return (
    <div className="relative">
      <div className="w-full bg-white z-50">
        <div className="container mx-auto">
          <div className="main-navbar-div flex justify-between items-center p-2">
            <div className="logo-div">
              <Link to="/">
                <img
                  className="w-full p-2"
                  alt="logo"
                  src="https://bestpropertiesmohali.com/assets/images/logo1.png"
                />
              </Link>
            </div>
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black focus:outline-none"
              >
                <svg
                  className="w-9 h-9"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
            <div className="hidden lg:flex lg:ml-2 mb-2 mt-2 lg:gap-5 justify-center items-center nav-items-div">
              {menuItems.map(renderDesktopMenuItem)}
              {/* Desktop Hover Dropdown */}
              <div className="relative group inline-block">
                <div className="menu-item text-red-600 font-semibold p-1 lg:px-1 flex items-center gap-1 cursor-pointer">
                  <span>{isLoggedIn ? "Profile" : "Login"}</span>
                  <svg
                    className="w-4 h-4 transform transition-transform group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 opacity-0 invisible transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:visible">
                  {dropdownItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.path) {
                          navigate(item.path, { state: item.state });
                        } else item.onClick();
                      }}
                      className="block w-full text-left px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Mobile Dropdown */}
          {isMenuOpen && (
            <div className="lg:hidden flex flex-col bg-white text-center shadow-md absolute top-full left-0 w-full z-50">
              {menuItems.map(renderMenuItem)}
              <div className="relative" ref={mobileDropdownRef}>
                <button
                  className="menu-item text-red-600 font-semibold p-3 border-b border-gray-200 w-full flex items-center justify-center gap-1"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{isLoggedIn ? "Me" : "Login"}</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="flex flex-col bg-white border border-gray-200 shadow-lg w-full">
                    {dropdownItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          if (item.path) {
                            setIsDropdownOpen(false);
                            setIsMenuOpen(false);
                            navigate(item.path, { state: item.state });
                          } else item.onClick();
                        }}
                        className="text-left px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full border-t border-gray-200" />
    </div>
  );
}
