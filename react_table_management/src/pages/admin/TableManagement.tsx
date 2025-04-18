import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, Filter } from 'lucide-react';

interface Table {
    id: number;
    tableNumber: string;
    capacity: number;
    location: string;
    status: 'available' | 'reserved' | 'occupied';
}

export const TableManagement: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([
        {
            id: 1,
            tableNumber: '01',
            capacity: 4,
            location: 'Tầng trệt',
            status: 'available',
        },
        {
            id: 2,
            tableNumber: '02',
            capacity: 2,
            location: 'Tầng trệt',
            status: 'reserved',
        },
        {
            id: 3,
            tableNumber: '03',
            capacity: 6,
            location: 'Tầng trệt',
            status: 'occupied',
        },
        {
            id: 4,
            tableNumber: '04',
            capacity: 8,
            location: 'Tầng trệt',
            status: 'available',
        },
        {
            id: 5,
            tableNumber: '05',
            capacity: 4,
            location: 'Tầng 1',
            status: 'reserved',
        },
        {
            id: 6,
            tableNumber: '06',
            capacity: 2,
            location: 'Tầng 1',
            status: 'available',
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTable, setCurrentTable] = useState<Table | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const initialTableState: Table = {
        id: 0,
        tableNumber: '',
        capacity: 0,
        location: '',
        status: 'available',
    };

    const [formData, setFormData] = useState<Table>(initialTableState);

    const openAddModal = () => {
        setCurrentTable(null);
        setFormData(initialTableState);
        setIsModalOpen(true);
    };

    const openEditModal = (table: Table) => {
        setCurrentTable(table);
        setFormData(table);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialTableState);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'capacity' ? parseInt(value) || 0 : value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentTable) {
            // Update existing table
            setTables(
                tables.map((table) => (table.id === currentTable.id ? { ...formData } : table))
            );
        } else {
            // Add new table
            const newTable = {
                ...formData,
                id: tables.length > 0 ? Math.max(...tables.map((table) => table.id)) + 1 : 1,
            };
            setTables([...tables, newTable]);
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa bàn này?')) {
            setTables(tables.filter((table) => table.id !== id));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'reserved':
                return 'bg-yellow-100 text-yellow-800';
            case 'occupied':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available':
                return 'Trống';
            case 'reserved':
                return 'Đã đặt';
            case 'occupied':
                return 'Đang sử dụng';
            default:
                return status;
        }
    };

    const filteredTables = tables.filter((table) => {
        const matchesSearch =
            table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            table.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || table.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                    Quản lý bàn
                </h2>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Thêm bàn
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <div className="bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center">
                                        <div className="max-w-lg w-full lg:max-w-xs mb-2 sm:mb-0">
                                            <label htmlFor="search" className="sr-only">
                                                Tìm kiếm
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg
                                                        className="h-5 w-5 text-gray-400"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="search"
                                                    name="search"
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="Tìm kiếm bàn..."
                                                    type="search"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="max-w-lg w-full lg:max-w-xs sm:ml-4">
                                            <label htmlFor="status-filter" className="sr-only">
                                                Lọc theo trạng thái
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
                                                    <option value="all">Tất cả trạng thái</option>
                                                    <option value="available">Trống</option>
                                                    <option value="reserved">Đã đặt</option>
                                                    <option value="occupied">Đang sử dụng</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Số bàn
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Sức chứa
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Vị trí
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Trạng thái
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTables.map((table) => (
                                            <tr key={table.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {table.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{table.tableNumber}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {table.capacity} người
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {table.location}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                            table.status
                                                        )}`}
                                                    >
                                                        {getStatusText(table.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => openEditModal(table)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        <Pencil className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(table.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for adding/editing table */}
            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {currentTable ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}
                                    </h3>
                                    <div className="mt-2">
                                        <form onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">
                                                        Số bàn
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            type="text"
                                                            name="tableNumber"
                                                            id="tableNumber"
                                                            required
                                                            value={formData.tableNumber}
                                                            onChange={handleInputChange}
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                                                        Sức chứa
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            type="number"
                                                            name="capacity"
                                                            id="capacity"
                                                            required
                                                            min="1"
                                                            value={formData.capacity}
                                                            onChange={handleInputChange}
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-6">
                                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                                        Vị trí
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            id="location"
                                                            required
                                                            value={formData.location}
                                                            onChange={handleInputChange}
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-6">
                                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                        Trạng thái
                                                    </label>
                                                    <div className="mt-1">
                                                        <select
                                                            id="status"
                                                            name="status"
                                                            value={formData.status}
                                                            onChange={handleInputChange}
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        >
                                                            <option value="available">Trống</option>
                                                            <option value="reserved">Đã đặt</option>
                                                            <option value="occupied">Đang sử dụng</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                                <button
                                                    type="submit"
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                                                >
                                                    {currentTable ? 'Cập nhật' : 'Thêm'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                                    onClick={closeModal}
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};