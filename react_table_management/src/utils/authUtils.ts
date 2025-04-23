import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../type/auth.type";

export const isLoggedIn = (): boolean => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};

export const getUserRoles = (): string[] => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return [];
    try {
        const user = JSON.parse(userStr);
        return user.roles || [];
    } catch {
        return [];
    }
};

export const isAdmin = (): boolean => {
    return isLoggedIn() && getUserRoles().includes("ROLE_ADMIN");
};
