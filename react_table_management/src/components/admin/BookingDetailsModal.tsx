import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Booking, BookingStatus } from '../../type/booking.type';
import tableService from '../../services/table.service';

// Giả định interface Table
interface Table {
    id: string;
    tableNumber: string;
    floor: number;
    capacity: number;
}

interface BookingDetailsModalProps {
    booking: Booking;
    onClose: () => void;
    onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
    onUpdateTable: (bookingId: string, tableId: string) => Promise<void>; 
    formError: string | null;
    successMessage: string | null;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
    booking,
    onClose,
    onUpdateStatus,
    onUpdateTable, // Thêm prop
    formError,
    successMessage,
}) => {
    const [tables, setTables] = useState<Table[]>([]); // State để lưu danh sách bàn
    const [selectedTableId, setSelectedTableId] = useState<string>(
        booking.table?.id || ''
    ); // State để lưu bàn được chọn
    const [tableError, setTableError] = useState<string | null>(null); // Lỗi khi cập nhật bàn

    // Format date string to readable format
    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    // Fetch danh sách bàn khi component mount
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await tableService.fetchAllTables();
                setTables(response.result);
            } catch (error) {
                console.error('Error fetching tables:', error);
                setTableError('Không thể tải danh sách bàn.');
            }
        };
        fetchTables();
    }, []);

    // Xử lý thay đổi bàn
    const handleTableChange = async (tableId: string) => {
        setSelectedTableId(tableId);
        try {
            await onUpdateTable(booking.id, tableId);
            setTableError(null);
        } catch (error) {
            console.error('Error updating table:', error);
            setTableError('Không thể cập nhật bàn.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md max-w-lg w-full">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Booking Details</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6">
                    {formError && (
                        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                            {formError}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
                            {successMessage}
                        </div>
                    )}
                    {tableError && (
                        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                            {tableError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span
                                className={`font-medium ${booking.status === BookingStatus.PENDING
                                        ? 'text-yellow-600'
                                        : booking.status === BookingStatus.CONFIRMED
                                            ? 'text-green-600'
                                            : booking.status === BookingStatus.SERVED
                                                ? 'text-blue-600'
                                                : 'text-red-600'
                                    }`}
                            >
                                {booking.status}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Customer Name:</span>
                            <span className="font-medium">{booking.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Phone Number:</span>
                            <span className="font-medium">{booking.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Booking Date:</span>
                            <span className="font-medium">{formatDateTime(booking.bookingTime)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Number of Guests:</span>
                            <span className="font-medium">{booking.numberOfPeople}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Table:</span>
                            {booking.status === BookingStatus.PENDING ? (
                                <select
                                    value={selectedTableId}
                                    onChange={(e) => handleTableChange(e.target.value)}
                                    className="border rounded-md p-1 text-gray-700"
                                >
                                    <option value="">Chọn bàn</option>
                                    {tables.map((table) => (
                                        <option key={table.id} value={table.id}>
                                            {table.tableNumber} (Tầng {table.floor}, Sức chứa: {table.capacity})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span className="font-medium">
                                    {booking.table
                                        ? `${booking.table.tableNumber} (Tầng ${booking.table.floor})`
                                        : 'Chưa chọn bàn'}
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Created At:</span>
                            <span className="font-medium">{formatDateTime(booking.createdAt || '')}</span>
                        </div>

                        {booking.status === BookingStatus.PENDING && (
                            <div className="flex justify-between space-x-4 pt-4 border-t">
                                <button
                                    onClick={() => onUpdateStatus(booking.id, BookingStatus.CONFIRMED)}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                                >
                                    <Check className="h-5 w-5 mr-1" />
                                    Confirm
                                </button>
                                <button
                                    onClick={() => onUpdateStatus(booking.id, BookingStatus.CANCELLED)}
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center justify-center"
                                >
                                    <X className="h-5 w-5 mr-1" />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;