import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../type/auth.type";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode<DecodedToken>(token);
                const isTokenValid = decodedToken.exp > Math.floor(Date.now() / 1000);

                if (isTokenValid) {
                    setIsAuthenticated(true);
                    if (decodedToken.roles.includes("ROLE_ADMIN")) {
                        setIsAdmin(true);
                    }
                } else {
                    logout();
                }
            } catch (error) {
                console.error("Token not :", error);
                logout();
            }
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);

        try {
            const decodedToken = jwtDecode<DecodedToken>(token);
            setIsAuthenticated(true);
            if (decodedToken.roles.includes("ROLE_ADMIN")) {
                setIsAdmin(true);
            }

            // Lưu thông tin user vào localStorage
            localStorage.setItem("user", JSON.stringify({
                userId: decodedToken.userId,
                username: decodedToken.username,
                roles: decodedToken.roles
            }));
        } catch (error) {
            console.error("Token không hợp lệ:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    return {
        isAuthenticated,
        isAdmin,
        login,
        logout,
    };
};

export default useAuth;
