import { useState } from "react";
import authService from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { isAdmin } from "../utils/authUtils";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const data = await authService.login({ username, password });
            if (data.success) {
                login(data.result.token);

                if (isAdmin()) {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transform transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Login</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Login
                    </button>
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                </form>
                <div className="mt-6 text-center space-y-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200">
                        Forgot Password?
                    </button>
                    <div>
                        <span className="text-gray-600 text-sm">Don't have an account? </span>
                        <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;