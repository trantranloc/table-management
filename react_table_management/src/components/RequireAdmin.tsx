// components/RequireAdmin.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/authUtils";

const RequireAdmin = ({ children }: { children: any }) => {
    if (!isAdmin()) {
        return <Navigate to="/unauthorized" replace />;
    }
    return children;
};


export default RequireAdmin;  
