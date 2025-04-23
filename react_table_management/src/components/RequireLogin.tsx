// components/RequireAdmin.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/authUtils";


const RequireLogin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isLoggedIn()) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};



export default RequireLogin;  
