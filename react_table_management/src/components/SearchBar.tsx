import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, onClear }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="relative">
                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchTerm && (
                    <button
                        onClick={onClear}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;