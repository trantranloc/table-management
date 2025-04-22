import React from 'react';

interface TableFormProps {
    formData: {
        tableNumber?: string;
        capacity?: number;
        floor?: number;
        status?: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    editingId: string | null;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    loading: boolean;
}

const TableForm: React.FC<TableFormProps> = ({
    formData,
    setFormData,
    editingId,
    onSubmit,
    onCancel,
    loading
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'capacity' || name === 'floor' ? parseInt(value) || 0 : value
        });
    };

    return (
        <form onSubmit={onSubmit} className="px-6 py-4">
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
                            value={formData.tableNumber || ''}
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
                            value={formData.capacity || 0}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                        Tầng
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            name="floor"
                            id="floor"
                            required
                            min="1"
                            value={formData.floor || 1}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Trạng thái
                    </label>
                    <div className="mt-1">
                        <select
                            id="status"
                            name="status"
                            value={formData.status || 'AVAILABLE'}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                            <option value="AVAILABLE">Trống</option>
                            <option value="UNAVAILABLE">Không khả dụng</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                >
                    {loading ? 'Đang xử lý...' : (editingId ? 'Cập nhật' : 'Thêm')}
                </button>
                <button
                    type="button"
                    disabled={loading}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={onCancel}
                >
                    Hủy
                </button>
            </div>
        </form>
    );
};

export default TableForm;