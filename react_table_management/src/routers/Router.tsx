import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import BookingList from "../components/BookingList";
import BookingForm from "../components/BookingForm";
import AdminLayout from "../layouts/AdminLayout";
import { TableManagement } from "../pages/admin/TableManagement";
import EmployeeManagement from "../pages/admin/EmployeeManagement";
import Dashboard from "../pages/admin/Dashboard";
import Intro from "../pages/user/Intro";
import UserLayout from "../layouts/UserLayout";
import EmployeeTableManager from "../pages/user/BookingPage";

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
                <Route path="tables" element={<TableManagement />} />
                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="bookings" element={<BookingList />} />
                <Route path="create-booking" element={<BookingForm />} />
            </Route>

            {/* Các route chung */}
            <Route path="/login" element={<Login />} />
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    );
}

export default Router;
