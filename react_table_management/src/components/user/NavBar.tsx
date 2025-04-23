import React from 'react';

const NavBar: React.FC = () => {
    return (
        <nav className="bg-blue-600 text-white p-4 sticky top-0 shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Restaurant</h1>
                <ul className="flex space-x-6">
                    <li>
                        <a href="#home" className="hover:text-blue-200 transition">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#about" className="hover:text-blue-200 transition">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="#menu" className="hover:text-blue-200 transition">
                            Menu
                        </a>
                    </li>
                    <li>
                        <a href="#booking" className="hover:text-blue-200 transition">
                            Booking
                        </a>
                    </li>
                    <li>
                        <a href="#contact" className="hover:text-blue-200 transition">
                            Contact
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;