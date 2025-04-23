// src/components/admin/TableView.tsx
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Table } from '../../type/table.type';
import BookingTable from './BookingTable';

interface TableViewProps {
    tables: Table[];
    loading: boolean;
    onBookTable: (table: Table) => void;
}

const TableView: React.FC<TableViewProps> = ({ tables, loading, onBookTable }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [floorFilter, setFloorFilter] = useState<string>('all');

    // Filter tables based on search term and filters
    const filteredTables = tables.filter((table) => {
        const matchesSearch =
            table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            table.capacity.toString().includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
        const matchesFloor = floorFilter === 'all' || table.floor.toString() === floorFilter;

        return matchesSearch && matchesStatus && matchesFloor;
    });

    // Get unique floor values for the filter
    const uniqueFloors = Array.from(new Set(tables.map(table => table.floor))).sort((a, b) => a - b);

    return (
        <>
            {/* Search and filters */}
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
                                placeholder="Search tables..."
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="max-w-lg w-full lg:max-w-xs sm:ml-4 mt-2 sm:mt-0">
                        <label htmlFor="status-filter" className="sr-only">
                            Filter by status
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <select
                                id="status-filter"
                                name="status-filter"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="AVAILABLE">Available</option>
                                <option value="UNAVAILABLE">Unavailable</option>
                            </select>
                        </div>
                    </div>

                    <div className="max-w-lg w-full lg:max-w-xs sm:ml-4 mt-2 sm:mt-0">
                        <label htmlFor="floor-filter" className="sr-only">
                            Filter by floor
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <select
                                id="floor-filter"
                                name="floor-filter"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={floorFilter}
                                onChange={(e) => setFloorFilter(e.target.value)}
                            >
                                <option value="all">All Floors</option>
                                {uniqueFloors.map(floor => (
                                    <option key={floor} value={floor}>Floor {floor}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Grid */}
            <BookingTable
                tables={filteredTables}
                onBookTable={onBookTable}
                loading={loading}
            />
        </>
    );
};

export default TableView;