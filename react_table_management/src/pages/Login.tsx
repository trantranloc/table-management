
const Login = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
                        <input type="text" id="username" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input type="password" id="password" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
                </form>
                <div className="mt-4 text-center">
                    <button className="text-blue-500 hover:underline">
                        Forgot Password?
                    </button>
                </div>
                <div className="mt-4 text-center">
                {/* <Link to="/register" className="text-blue-500 hover:underline">
                Create an Account
                </Link> */}
                </div>
            </div>
        </div>
    );
}

export default Login;
