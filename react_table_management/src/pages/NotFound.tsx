import React from "react";

// NotFound Page Component
const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
            <a href="/home" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
                Return Home
            </a>
        </div>
    );
};
export default NotFound;


