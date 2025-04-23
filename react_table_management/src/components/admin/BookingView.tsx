// src/components/admin/BookingView.tsx
import React, { useState } from 'react';
import { Filter, Clock, AlertCircle } from 'lucide-react';
import { Booking, BookingStatus } from '../../type/booking.type';
import { Table } from '../../type/table.type';

interface BookingViewProps {
    bookings: Booking[];
    tables: Table[];
    onViewBookingDetails: (booking: Booking) => void;
}

const BookingView: React.FC<BookingViewProps> = ({ bookings, tables, onViewBookingDetails }) => {
    const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

    // Filter bookings based on status filter
    const filteredBookings = bookings.filter((booking) => {
        const matchesStatus = bookingStatusFilter === 'all' || booking.status === bookingStatusFilter;
        return matchesStatus;
    });

    // Format date string to readable format
    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Find table info by ID
    const getTableInfo = (tableId?: string) => {
        if (!tableId) return null;
        return tables.find(table => table.id === tableId);
    };

    return (
        <>
            {/* Bookings filters */}
            <div className="bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-200 sm:px-6 mt-6 shadow rounded-t-lg">
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center">
                    <div className="max-w-lg w-full lg:max-w-xs">
                        <label htmlFor="booking-status-filter" className="sr-only">
                            Filter by status
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <select
                                id="booking-status-filter"
                                name="booking-status-filter"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={bookingStatusFilter}
                                onChange={(e) => setBookingStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="SERVED">Served</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md mt-1">
                <ul  className="divide-y divide-gray-200">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => {
                            const tableInfo = booking.table ? getTableInfo(booking.table.id) : null;
                            return (
                                <li key={booking.id}>
                                    <div
                                        className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => onViewBookingDetails(booking)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium text-indigo-600 truncate">
                                                    {booking.customerName}
                                                </p>
                                                <div className="ml-4 flex-shrink-0 flex">
                                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${booking.status === BookingStatus.PENDING
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : booking.status === BookingStatus.CONFIRMED
                                                                ? 'bg-green-100 text-green-800'
                                                                : booking.status === BookingStatus.SERVED
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-red-100 text-red-800'}`}>
                                                        {booking.status}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="text-sm text-gray-500">
                                                    Table: {tableInfo?.tableNumber || '?'} ({tableInfo?.capacity || '?'} guests)
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                    {formatDateTime(booking.bookingTime)}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                    <AlertCircle className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                    {booking.numberOfPeople} guests
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>
                                                    Booked on {formatDateTime(booking.createdAt || '')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <li className="px-4 py-8 text-center text-gray-500">
                            No bookings found with the selected filters.
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
};

export default BookingView;