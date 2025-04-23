import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, X } from 'lucide-react';
import { Table } from '../../type/table.type';
import tableService from '../../services/table.service';
import TableTable from '../../components/admin/TableTable';
import TableForm from '../../components/admin/Tableform';

const TableManager: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [formData, setFormData] = useState<Partial<Omit<Table, 'id'>>>({
        tableNumber: '',
        capacity: 0,
        floor: 1,
        status: 'AVAILABLE',
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            try {
                const response = await tableService.fetchAllTables();
                setTables(response.result); // Chỉnh sửa theo cấu trúc dữ liệu trả về
            } catch (err) {
                setError('Failed to load table list');
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                // Update existing table
                await tableService.updateTable(editingId, formData);
                setTables(tables.map(table =>
                    table.id === editingId ? { ...table, ...formData } : table
                ));
            } else {
                // Create new table
                const response = await tableService.createTable(formData as Omit<Table, 'id'>);
                setTables([...tables, { ...formData, id: response.result.id } as Table]);
            }
            resetForm();
        } catch (err) {
            console.error('Error saving table:', err);
            setError('Error saving table information');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id: string) => {
        try {
            setLoading(true);
            const response = await tableService.fetchTableById(id);
            setFormData(response.result); // Chỉnh sửa theo cấu trúc dữ liệu trả về
            setEditingId(id);
            setIsFormVisible(true);
        } catch (err) {
            console.error('Error fetching table:', err);
            setError('Failed to load table information');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this table?')) return;
        setLoading(true);
        try {
            await tableService.deleteTable(id);
            setTables(tables.filter((table) => table.id !== id));
        } catch (err) {
            console.error('Error deleting table:', err.message);
            setError('Error deleting table');
        } finally {
            setLoading(false);
        }
    };

    const filteredTables = tables.filter((table) => {
        const matchesSearch =
            table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            table.floor.toString().includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || table.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const openAddForm = () => {
        resetForm();
        setIsFormVisible(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            tableNumber: '',
            capacity: 0,
            floor: 1,
            status: 'AVAILABLE',
        });
        setIsFormVisible(false);
        setError(null);
    };

    const closeForm = () => {
        resetForm();
    };

    return (
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                    Table Management
                </h2>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                    <button
                        type="button"
                        onClick={openAddForm}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Table
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-100">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            {isFormVisible && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    {editingId ? 'Edit Table' : 'Add New Table'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <TableForm
                                formData={formData}
                                setFormData={setFormData}
                                editingId={editingId}
                                onSubmit={handleSubmit}
                                onCancel={closeForm}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            )}

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
                    <div className="mt-2 sm:mt-0 sm:ml-4">
                        <label htmlFor="statusFilter" className="sr-only">
                            Status Filter
                        </label>
                        <select
                            id="statusFilter"
                            name="statusFilter"
                            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="AVAILABLE">Available</option>
                            <option value="OCCUPIED">Occupied</option>
                        </select>
                    </div>
                </div>
            </div>

            <TableTable
                tables={filteredTables}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />
        </div>
    );
};

export default TableManager;
