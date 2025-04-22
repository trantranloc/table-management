import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Intro from "../pages/user/Intro";
import UserLayout from "../layouts/UserLayout";
import EmployeeTableManager from "../pages/user/BookingPage";
import Register from "../pages/Register";
import TableManager from "../pages/admin/TableManager";
import UserManager from "../pages/admin/UserManager";
import BookingManagement from "../pages/admin/BookingManager";

function Router() {
    return (
        <Routes>
            {/* <Navigation /> */}

            {/* Routes cho user thường */}
            <Route path="/" element={<Intro />} />
                <Route element={<UserLayout />}>
                <Route path="/booking" element={<EmployeeTableManager />} />

            </Route>

            {/* Routes cho admin */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="tables" element={<TableManager />} />
                <Route path="employees" element={<UserManager />} />
                <Route path="bookings" element={<BookingManagement />} />
            </Route>

            {/* Các route chung */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    );
}

export default Router;
