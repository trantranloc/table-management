import React from 'react';
import { Role } from '../type/user.type';
import { useSelector } from 'react-redux';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: any | null;
    formData: {
        username: string;
        email: string;
        password: string;
        phone: string;
        roles: string[];
    };
    roles: Role[];
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    currentUser,
    formData,
    roles,
    onInputChange,
    onRoleChange,
    onSubmit,
}) => {
    const isError = useSelector((state: any) => state.users.error);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-medium">
                        {currentUser ? 'Edit User' : 'Add New User'}
                    </h3>
                </div>
                <form onSubmit={onSubmit}>
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
                                    onChange={onInputChange}
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
                                onChange={onRoleChange}
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
                                onClick={onClose}
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
    );
};

export default UserModal;