import React from 'react';
import UserRow from './UserRow';
import { User } from '../type/user.type';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    formatRoleName: (role: string) => string;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, formatRoleName }) => {
    return (
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
                        {users.map((user) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                formatRoleName={formatRoleName}
                            />
                        ))}
                        {users.length === 0 && (
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
    );
};

export default UserTable;