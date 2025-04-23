import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Table } from '../../type/table.type';

interface TableTableProps {
    tables: Table[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    loading: boolean;
}

const TableTable: React.FC<TableTableProps> = ({ tables, onEdit, onDelete, loading }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return 'bg-green-100 text-green-800';
            case 'UNAVAILABLE':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return 'Available';
            case 'UNAVAILABLE':
                return 'Unavailable';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6 text-center">
                    <div className="text-sm text-gray-500">Loading data...</div>
                </div>
            </div>
        );
    }

    if (tables.length === 0) {
        return (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6 text-center">
                    <div className="text-sm text-gray-500">No tables available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-b-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Table Number
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Capacity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Floor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tables.map((table) => (
                        <tr key={table.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {table.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{table.tableNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {table.capacity} people
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                Floor {table.floor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(table.status)}`}>
                                    {getStatusText(table.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(table.id)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    aria-label="Edit"
                                >
                                    <Pencil className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => onDelete(table.id)}
                                    className="text-red-600 hover:text-red-900"
                                    aria-label="Delete"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableTable;