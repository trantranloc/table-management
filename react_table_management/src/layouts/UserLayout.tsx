import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

// UserLayout component với kiểm tra authentication thực tế
const UserLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');

    // Kiểm tra authentication khi component được render
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserName = localStorage.getItem('userName');
        const storedUserRole = localStorage.getItem('userRole');

        if (token) {
            setIsAuthenticated(true);
            setUserName(storedUserName || 'User');
            setUserRole(storedUserRole || '');
        } else {
            setIsAuthenticated(false);
            setUserName('');
            setUserRole('');
        }
    }, []);

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
            {/* Navbar */}
            <nav className="bg-opacity-90 bg-indigo-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-2xl font-bold">
                                TableEase
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <NavLink
                                to="/home"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`
                                }
                            >
                                Home
                            </NavLink>

                            {/* Hiển thị "Book a Table" dựa trên vai trò */}
                            {(isAuthenticated && userRole === 'employee') && (
                                <NavLink
                                    to="/booking"
                                    className={({ isActive }) =>
                                        `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`
                                    }
                                >
                                    Book a Table
                                </NavLink>
                            )}

                            {/* Hiển thị liên kết Admin Dashboard nếu user có vai trò admin */}
                            {(isAuthenticated && userRole === 'admin') && (
                                <NavLink
                                    to="/admin"
                                    className={({ isActive }) =>
                                        `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`
                                    }
                                >
                                    Admin Dashboard
                                </NavLink>
                            )}

                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`
                                }
                            >
                                Contact
                            </NavLink>

                            {/* Authentication buttons */}
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium">
                                        Welcome, {userName}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-indigo-800 bg-opacity-90 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm">© 2025 TableEase. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/about" className="text-sm hover:underline">
                                About
                            </Link>
                            <Link to="/contact" className="text-sm hover:underline">
                                Contact
                            </Link>
                            <Link to="/privacy" className="text-sm hover:underline">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;