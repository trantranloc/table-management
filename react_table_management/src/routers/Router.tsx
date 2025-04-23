import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminLayout from "../layouts/AdminLayout";
import Intro from "../pages/user/Intro";
import Home from "../pages/user/Home";
import UserLayout from "../layouts/UserLayout";
import Register from "../pages/Register";
import TableManager from "../pages/admin/TableManager";
import UserManager from "../pages/admin/UserManager";
import BookingManagement from "../pages/admin/BookingManager";
import EmployeeBookingForm from "../pages/employee/BookingForm";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
import Dashboard from "../components/admin/Dashboard";
import RequireAdmin from "../components/RequireAdmin";
import RequireLogin from "../components/RequireLogin";

function Router() {
    return (
        <Routes>
            {/* Route trang giới thiệu */}
            <Route path="/" element={<Intro />} />

            {/* Routes cho user thường */}
            <Route element={<UserLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/booking" element={<RequireLogin><EmployeeBookingForm /></RequireLogin>} />
            </Route>

            {/* Routes cho admin */}
            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                <Route index element={<Dashboard />} />
                <Route path="tables" element={<TableManager />} />
                <Route path="employees" element={<UserManager />} />
                <Route path="bookings" element={<BookingManagement />} />
            </Route>


            {/* Các route chung - không nằm trong layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="*" element={<NotFound />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

        </Routes>
    );
}

export default Router;