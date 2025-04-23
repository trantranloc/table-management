const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
            <div className="flex gap-4">
                <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
                    Login
                </a>
                <a href="/home" className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300">
                    Return Home
                </a>
            </div>
        </div>
    );
};
export default Unauthorized;
