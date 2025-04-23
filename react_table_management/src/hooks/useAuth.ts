import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { DecodedToken } from "../type/auth.type";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp > Date.now() / 1000) {
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<DecodedToken>(token);
    localStorage.setItem("user", JSON.stringify(decoded));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};
export default useAuth;