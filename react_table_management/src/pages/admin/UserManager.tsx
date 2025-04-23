import React, { useState, useEffect } from 'react';
import { PlusCircle, Filter, Search, X } from 'lucide-react';
import { User, Role } from '../../type/user.type';
import userService from '../../services/user.service';
import UserForm from '../../components/admin/UserForm';
import UserTable from '../../components/admin/UserTable';

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [formData, setFormData] = useState<Partial<Omit<User, 'id'>>>({
        username: '',
        email: '',
        phone: '',
        password: '',
        roles: [],
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await userService.fetchAllUsers();
                setUsers(response.result);
            } catch {
                setError('Failed to load user list');
            } finally {
                setLoading(false);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await userService.fetchAllRoles();
                setRoles(Array.isArray(response.result) ? response.result : [response.result]);
            } catch {
                setError('Failed to load role list');
            }
        };

        fetchUsers();
        fetchRoles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                // For update, only include password if it's not empty
                if (formData.password && formData.password.trim() !== '') {
                    await userService.updateUser(editingId, formData);
                    setUsers(users.map(user =>
                        user.id === editingId ? { ...user, ...formData } : user
                    ));
                } else {
                    // Remove password from the update data if it's empty
                    const { password, ...updateData } = formData;
                    await userService.updateUser(editingId, updateData);
                    setUsers(users.map(user =>
                        user.id === editingId ? { ...user, ...updateData } : user
                    ));
                }
            } else {
                const response = await userService.createUser(formData as Omit<User, 'id'>);
                setUsers([...users, { ...formData, id: response.result.id } as User]);
            }
            resetForm();
        } catch (err) {
            console.error("Error saving user:", err);
            setError('Error saving user');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id: string) => {
        try {
            setLoading(true);
            const response = await userService.fetchUserById(id);

            if (response && response.result) {
                const { id: _, ...userData } = response.result;
                const userRoles = userData.roles || [];
                setFormData({
                    ...userData,
                    password: '', // Clear password for security
                    roles: userRoles
                });
                setEditingId(id);
                setIsFormVisible(true);
            } else {
                throw new Error("No user data returned");
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setError('Failed to load user information');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        setLoading(true);
        try {
            await userService.deleteUser(id);
            setUsers(users.filter(user => user.id !== id));
        } catch {
            setError('Error deleting user');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.phone && user.phone.includes(searchTerm));

        const matchesRole = roleFilter === 'all' ||
            (user.roles && user.roles.some(role => role.id.toString() === roleFilter));

        return matchesSearch && matchesRole;
    });

    const openAddForm = () => {
        resetForm();
        setIsFormVisible(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ username: '', email: '', phone: '', password: '', roles: [] });
        setIsFormVisible(false);
        setError(null);
    };

    const closeForm = () => {
        resetForm();
    };

    return (
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                    User Management
                </h2>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                    <button
                        type="button"
                        onClick={openAddForm}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add User
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-100">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            {isFormVisible && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    {editingId ? 'Edit User' : 'Add New User'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <UserForm
                                formData={formData}
                                setFormData={setFormData}
                                editingId={editingId}
                                onSubmit={handleSubmit}
                                onCancel={closeForm}
                                loading={loading}
                                availableRoles={roles}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-200 sm:px-6 mt-6 shadow rounded-t-lg">
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center">
                    <div className="max-w-lg w-full lg:max-w-xs mb-2 sm:mb-0">
                        <label htmlFor="search" className="sr-only">
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="search"
                                name="search"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Search users..."
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="max-w-lg w-full lg:max-w-xs sm:ml-4">
                        <label htmlFor="role-filter" className="sr-only">
                            Filter by role
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <select
                                id="role-filter"
                                name="role-filter"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">All roles</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id.toString()}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <UserTable
                users={filteredUsers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />
        </div>
    );
};

export default UserManager;