import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash, Search, X } from 'lucide-react';
import { User, Role } from '../../type/user.type';
import userService from '../../services/userService';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        roles: [] as string[],
    });

    const roles: Role[] = [
        { id: '1', name: 'Admin' },
        { id: '2', name: 'User' },
        { id: '3', name: 'Editor' },
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.fetchAllUsers();
            setUsers(data.result);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const formatRoleName = (role: string) => {
        return role.replace(/^ROLE_/, '').toLowerCase().replace(/^\w/, c => c.toUpperCase());
    };

    const handleOpenModal = (user: User | null = null) => {
        if (user) {
            setCurrentUser(user);
            setFormData({
                username: user.username,
                email: user.email,
                phone: user.phone || '',
                password: '',
                roles: user.roles.map((role) => role.id),
            });
        } else {
            setCurrentUser(null);
            setFormData({
                username: '',
                email: '',
                phone: '',
                password: '',
                roles: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRoles = Array.from(e.target.selectedOptions).map((option) => option.value);
        setFormData((prev) => ({ ...prev, roles: selectedRoles }));
    };

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">User Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus size={18} className="mr-2" />
                    Add User
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="relative">
                    <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Username</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3">Roles</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4">#{user.id}</td>
                                    <td className="px-6 py-4">{user.username}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.phone || '-'}</td>
                                    <td className="px-6 py-4">
                                        {user.roles
                                            .map((role) => formatRoleName(role.name))
                                            .join(', ') || 'None'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleOpenModal(user)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900">
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-medium">
                                {currentUser ? 'Edit User' : 'Add New User'}
                            </h3>
                        </div>
                        <form>
                            <div className="p-6">
                                {[
                                    { name: 'username', label: 'Username', type: 'text' },
                                    { name: 'email', label: 'Email', type: 'email' },
                                    { name: 'phone', label: 'Phone', type: 'text' },
                                    { name: 'password', label: 'Password', type: 'password' },
                                ].map((field) => (
                                    <div key={field.name} className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            {field.label}
                                            {field.name === 'password' && currentUser && ' (optional)'}
                                        </label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name as keyof typeof formData]}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required={field.name !== 'password' || !currentUser}
                                        />
                                    </div>
                                ))}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Roles
                                    </label>
                                    <select
                                        multiple
                                        name="roles"
                                        value={formData.roles}
                                        onChange={handleRoleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        {currentUser ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
