import { Link, NavLink, Outlet } from 'react-router-dom';



const UserLayout: React.FC = () => {
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
                                to="/"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-700'
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/booking"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-700'
                                    }`
                                }
                            >
                                Book a Table
                            </NavLink>
                            <NavLink
                                to="/tables"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-700'
                                    }`
                                }
                            >
                                Contact
                            </NavLink>
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