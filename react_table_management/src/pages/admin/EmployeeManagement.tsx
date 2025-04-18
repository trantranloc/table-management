// src/pages/EmployeeManagement.tsx
import React, { useState } from 'react';
import { Plus, Edit, Trash, Search, X } from 'lucide-react';

interface Employee {
    id: number;
    name: string;
    position: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
}

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([
        {
            id: 1,
            name: 'Nguyễn Văn A',
            position: 'Quản lý',
            email: 'nguyenvana@example.com',
            phone: '0123456789',
            status: 'active',
        },
        {
            id: 2,
            name: 'Trần Thị B',
            position: 'Phục vụ',
            email: 'tranthib@example.com',
            phone: '0987654321',
            status: 'active',
        },
        {
            id: 3,
            name: 'Lê Văn C',
            position: 'Đầu bếp',
            email: 'levanc@example.com',
            phone: '0369852147',
            status: 'inactive',
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // For creating/editing employee
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        email: '',
        phone: '',
        status: 'active' as 'active' | 'inactive',
    });

    const handleOpenModal = (employee: Employee | null = null) => {
        if (employee) {
            setCurrentEmployee(employee);
            setFormData({
                name: employee.name,
                position: employee.position,
                email: employee.email,
                phone: employee.phone,
                status: employee.status,
            });
        } else {
            setCurrentEmployee(null);
            setFormData({
                name: '',
                position: '',
                email: '',
                phone: '',
                status: 'active',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (currentEmployee) {
            // Update existing employee
            const updatedEmployees = employees.map((emp) =>
                emp.id === currentEmployee.id
                    ? { ...emp, ...formData }
                    : emp
            );
            setEmployees(updatedEmployees);
        } else {
            // Add new employee
            const newEmployee: Employee = {
                id: employees.length ? Math.max(...employees.map((emp) => emp.id)) + 1 : 1,
                ...formData,
            };
            setEmployees([...employees, newEmployee]);
        }

        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            setEmployees(employees.filter((emp) => emp.id !== id));
        }
    };

    // Filter employees based on search term
    const filteredEmployees = employees.filter(
        (emp) =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Quản lý nhân viên</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus size={18} className="mr-2" />
                    Thêm nhân viên
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="relative">
                    <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhân viên..."
                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Employees Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên nhân viên
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vị trí
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số điện thoại
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">#{employee.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{employee.position}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{employee.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${employee.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {employee.status === 'active' ? 'Đang làm việc' : 'Ngưng làm việc'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleOpenModal(employee)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(employee.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                        Không tìm thấy nhân viên nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Employee Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-medium">
                                {currentEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Tên nhân viên
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Vị trí
                                    </label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Trạng thái
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="active">Đang làm việc</option>
                                        <option value="inactive">Ngưng làm việc</option>
                                    </select>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {currentEmployee ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;