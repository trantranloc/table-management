import React from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';

export interface Booking {
    id: string;
    customerName: string;
    customerPhone: string;
    bookingTime: string;
    numberOfPeople: number;
    tableNumber: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'SERVED';
    note?: string;
}

interface BookingListProps {
    bookings: Booking[];
    onEdit: (booking: Booking) => void;
    onDelete: (id: string) => void;
    onChangeStatus: (id: string, status: 'CONFIRMED' | 'CANCELLED' | 'SERVED') => void;
    loading: boolean;
}

const BookingList: React.FC<BookingListProps> = ({
    bookings,
    onEdit,
    onDelete,
    onChangeStatus,
    loading
}) => {
    const formatDateTime = (dateTimeStr: string) => {
        const dateTime = new Date(dateTimeStr);
        return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'SERVED':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Loading bookings...</p>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No bookings found.</p>
            </div>
        );
    }

    return (
        <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Table
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Guests
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                                <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{booking.tableNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatDateTime(booking.bookingTime)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{booking.numberOfPeople}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-3">
                                    {booking.status === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => onChangeStatus(booking.id, 'CONFIRMED')}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Confirm"
                                            >
                                                <Check className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => onChangeStatus(booking.id, 'CANCELLED')}
                                                className="text-red-600 hover:text-red-900"
                                                title="Cancel"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'CONFIRMED' && (
                                        <button
                                            onClick={() => onChangeStatus(booking.id, 'SERVED')}
                                            className="text-green-600 hover:text-green-900"
                                            title="Mark as Served"
                                        >
                                            <Check className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onEdit(booking)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                        title="Edit"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(booking.id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingList;