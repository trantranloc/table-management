import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
    onAddUser: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddUser }) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">User Management</h1>
            <button
                onClick={onAddUser}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                <Plus size={18} className="mr-2" />
                Add User
            </button>
        </div>
    );
};

export default Header;