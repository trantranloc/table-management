import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Menu, Users, Book, BarChart, LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {logout} = useAuth()
    // Sidebar menu items
    const menuItems = [
        { path: '/admin', name: 'Dashboard', icon: <BarChart size={20} /> },
        { path: '/admin/employees', name: 'User Management', icon: <Users size={20} /> },
        { path: '/admin/tables', name: 'Table Management', icon: <Book size={20} /> },
        { path: '/admin/bookings', name: 'Reservations', icon: <Book size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`bg-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}
            >
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-semibold">Admin Dashboard</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden"
                        aria-label="Close Sidebar"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <nav>
                    <div className="space-y-2 px-4">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-700'
                                    }`
                                }
                                onClick={() => setSidebarOpen(false)} // Close sidebar on mobile after click
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                    <div className="px-4 mt-8">
                        <NavLink
                            to="/login"
                            className="flex items-center space-x-2 py-2.5 px-4 rounded hover:bg-blue-700 transition duration-200"
                            onClick={() => {
                                logout(); 
                                setSidebarOpen(false);
                            }}                        >
                            <LogOut size={20} />
                            <span>Log Out</span>
                        </NavLink>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="px-4 py-3 flex justify-between items-center">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden text-gray-600 focus:outline-none"
                            aria-label="Open Sidebar"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;