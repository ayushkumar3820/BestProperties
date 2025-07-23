import { createContext, useEffect, useState } from "react";
import Cookie from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(Cookie.get("userId") || null);
  const [authToken, setAuthToken] = useState(Cookie.get("authToken") || null);
  const [wishList, setWishList] = useState([]);
  const [wishListIds, setWishListIds] = useState(new Set());

  useEffect(() => {
    const storedUserId = Cookie.get("userId") || null;
    const storedToken = Cookie.get("authToken") || "";
    setUserId(storedUserId);
    setAuthToken(storedToken);
  }, []);

  const value = {
    userId,
    setUserId,
    authToken,
    setAuthToken,
    wishList,
    setWishList,
    wishListIds,
    setWishListIds,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
