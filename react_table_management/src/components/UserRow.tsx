import React from 'react';
import { Edit, Trash } from 'lucide-react';
import { User } from '../type/user.type';

interface UserRowProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    formatRoleName: (role: string) => string;
}

const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete, formatRoleName }) => {
    return (
        <tr>
            <td className="px-6 py-4">#{user.id}</td>
            <td className="px-6 py-4">{user.username}</td>
            <td className="px-6 py-4">{user.email}</td>
            <td className="px-6 py-4">{user.phone || '-'}</td>
            <td className="px-6 py-4">
                {user.roles.map((role) => formatRoleName(role.name)).join(', ') || 'None'}
            </td>
            <td className="px-6 py-4">
                <button
                    onClick={() => onEdit(user)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                >
                    <Edit size={18} />
                </button>
                <button
                    onClick={() => onDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                >
                    <Trash size={18} />
                </button>
            </td>
        </tr>
    );
};

export default UserRow;