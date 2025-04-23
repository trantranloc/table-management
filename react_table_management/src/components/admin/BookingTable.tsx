import React from 'react';
import { Table } from '../../type/table.type';


interface BookingTableProps {
    tables: Table[];
    onBookTable: (table: Table) => void;
    loading: boolean;
}

const BookingTable: React.FC<BookingTableProps> = ({ tables, onBookTable, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Loading tables...</p>
            </div>
        );
    }

    if (tables.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No tables available.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {tables.map((table) => (
                <div
                    key={table.id}
                    className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
                >
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Table {table.tableNumber}</h4>
                    <p className="text-sm text-gray-600">Capacity: {table.capacity}</p>
                    <p className="text-sm text-gray-600">Floor: {table.floor}</p>
                    <p className="text-sm text-gray-600">
                        Status:{' '}
                        <span
                            className={
                                table.status === 'AVAILABLE'
                                    ? 'text-green-600'
                                    : table.status === 'UNAVAILABLE'
                                        ? 'text-red-600'
                                        : 'text-yellow-600'
                            }
                        >
                            {table.status}
                        </span>
                    </p>
                    <button
                        onClick={() => onBookTable(table)}
                        className="mt-4 w-full py-2 px-4 rounded-md font-medium transition duration-200 bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Book Table
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BookingTable;