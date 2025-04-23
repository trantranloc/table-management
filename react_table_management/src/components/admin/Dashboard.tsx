import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bookingService from '../../services/booking.service';
import tableService from '../../services/table.service';
import { Booking, BookingStatus } from '../../type/booking.type';
import { Table } from '../../type/table.type';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'bookings' | 'tables'>('bookings');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
    const [upcomingBookings, setUpcomingBookings] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch both bookings and tables data
            const [bookingsResponse, tablesResponse] = await Promise.all([
                bookingService.fetchAllBookings(),
                tableService.fetchAllTables()
            ]);

            setBookings(bookingsResponse.result);
            setTables(tablesResponse.result);

            // Process data for dashboard metrics
            const today = new Date().toISOString().split('T')[0];
            const todayBookingsData = bookingsResponse.result.filter(
                booking => booking.bookingTime.split('T')[0] === today
            );
            setTodayBookings(todayBookingsData);

            // Count upcoming bookings (future dates)
            const upcoming = bookingsResponse.result.filter(
                booking => booking.bookingTime.split('T')[0] > today &&
                    booking.status !== BookingStatus.CANCELLED
            );
            setUpcomingBookings(upcoming.length);

        } catch (err) {
            setError('Failed to load data. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
        console.log(bookingId, newStatus);
        try {
            await bookingService.updateStatus(bookingId, newStatus);
            if (newStatus === "COMPLETED") {
                // Giả sử mỗi booking có một trường `tableId` để xác định bàn
                const booking = await bookingService.fetchBookingById(bookingId); // Lấy thông tin booking
                const tableId = booking.result.table?.id; 

                // Cập nhật trạng thái bàn thành "AVAILABLE"
                if (tableId) {
                    await tableService.updateTableStatus(tableId, "AVAILABLE");
                } else {
                    console.error("Table ID is undefined. Cannot update table status.");
                }

                // Cập nhật lại bảng bookings
                setBookings(prev => prev.map(booking =>
                    booking.id === bookingId ? { ...booking, status: BookingStatus.COMPLETED } : booking
                ));
            } else {
                // Nếu trạng thái không phải "COMPLETED", chỉ cập nhật trạng thái booking bình thường
                setBookings(prev => prev.map(booking =>
                    booking.id === bookingId ? { ...booking, status: newStatus } : booking
                ));
            }
           
            setSuccessMessage('Booking status updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);

            fetchData();
        } catch (err) {
            // In thông tin chi tiết về lỗi
            if (err.response) {
                console.error('Response Error:', err.response);
                setError(`Server error: ${err.response.status} - ${err.response.data}`);
            } else {
                console.error('Error:', err.message);
                setError('Failed to update status. Please try again later.');
            }
            setTimeout(() => setError(null), 3000);
        }
    };


    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case BookingStatus.PENDING:
                return 'bg-yellow-100 text-yellow-800';
            case BookingStatus.CONFIRMED:
                return 'bg-green-100 text-green-800';
            case BookingStatus.CANCELLED:
                return 'bg-red-100 text-red-800';
            case BookingStatus.COMPLETED:
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTableStatusClass = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return 'bg-green-100 text-green-800';
            case 'BOOKED':
                return 'bg-red-100 text-red-800';
            case 'PROCESSING':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const filteredBookings = filterStatus === "ALL"
        ? bookings
        : bookings.filter(booking => booking.status === filterStatus);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Loading data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Bar */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-indigo-600">Restaurant Management</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                Staff
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Dashboard Summary */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Today's Bookings Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Today's Bookings</p>
                                    <p className="text-2xl font-semibold text-gray-800">{todayBookings.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Bookings Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Upcoming Bookings</p>
                                    <p className="text-2xl font-semibold text-gray-800">{upcomingBookings}</p>
                                </div>
                            </div>
                        </div>

                        {/* Available Tables Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Available Tables</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {tables.filter(table => table.status === 'AVAILABLE').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Bookings Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                                    <p className="text-2xl font-semibold text-gray-800">{bookings.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/booking')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New Booking
                        </button>

                        <button
                            onClick={() => setActiveTab('tables')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            View Table Status
                        </button>

                        <button
                            onClick={() => fetchData()}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh Data
                        </button>
                    </div>
                </div>

                {/* Tab Buttons */}
                <div className="mb-4 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Booking List
                        </button>
                        <button
                            onClick={() => setActiveTab('tables')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tables'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Table Status
                        </button>
                    </nav>
                </div>

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md">
                        <p>{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                        <p>{error}</p>
                    </div>
                )}

                {/* Content for Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="bg-white shadow rounded-lg">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-800">Booking List</h3>
                                <div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="ALL">All Statuses</option>
                                        <option value={BookingStatus.PENDING}>Pending</option>
                                        <option value={BookingStatus.CONFIRMED}>Confirmed</option>
                                        <option value={BookingStatus.CANCELLED}>Cancelled</option>
                                        <option value={BookingStatus.COMPLETED}>Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Table
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            People
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>
                                        {/* <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            Actions
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredBookings.length > 0 ? (
                                        filteredBookings.map((booking) => (
                                            <tr key={booking.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {booking.customerName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{booking.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {formatDateTime(booking.bookingTime)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {booking.table ? `Table ${booking.table.tableNumber}` : 'No Table Assigned'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {booking.numberOfPeople}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                                        {booking.status === BookingStatus.PENDING && 'Pending'}
                                                        {booking.status === BookingStatus.CONFIRMED && 'Confirmed'}
                                                        {booking.status === BookingStatus.CANCELLED && 'Cancelled'}
                                                        {booking.status === BookingStatus.COMPLETED && 'Completed'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        {booking.status === BookingStatus.PENDING && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(booking.id, BookingStatus.CONFIRMED)}
                                                                    className="text-green-600 hover:text-green-900"
                                                                >
                                                                    Confirm
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(booking.id, BookingStatus.CANCELLED)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}
                                                        {booking.status === BookingStatus.CONFIRMED && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(booking.id, BookingStatus.COMPLETED)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    Complete
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(booking.id, BookingStatus.CANCELLED)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}
                                                        {/* <Link
                                                            to={`/employee/bookings/edit/${booking.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Details
                                                        </Link> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No bookings found {filterStatus !== "ALL" ? "for this status" : ""}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Content for Tables Tab */}
                {activeTab === 'tables' && (
                    <div className="bg-white shadow rounded-lg">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-800">Table Status</h3>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tables.map((table) => (
                                    <div
                                        key={table.id}
                                        className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800">Table {table.tableNumber}</h4>
                                                <p className="text-sm text-gray-600 mt-1">Floor: {table.floor}</p>
                                                <p className="text-sm text-gray-600">Capacity: {table.capacity} people</p>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Status:{' '}
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTableStatusClass(table.status)}`}>
                                                        {table.status === 'AVAILABLE' && 'Available'}
                                                        {table.status === 'UNAVAILABLE' && 'Unailable'}
                                                    </span>
                                                </p>
                                            </div>
                                            {table.status === 'AVAILABLE' && (
                                                <button
                                                    onClick={() => navigate('/booking', { state: { selectedTableId: table.id } })}
                                                    className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                                                >
                                                    Book Table
                                                </button>
                                            )}
                                        </div>

                                        {/* Show booking info if table is booked */}
                                        {table.status !== 'AVAILABLE' && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Booking Information:</h5>
                                                {bookings.find(b => b.table && b.table.id === table.id && b.status === BookingStatus.CONFIRMED) ? (
                                                    <div className="text-xs text-gray-600">
                                                        {(() => {
                                                            const booking = bookings.find(b => b.table && b.table.id === table.id && b.status === BookingStatus.CONFIRMED);
                                                            return booking ? (
                                                                <>
                                                                    <p>Customer: {booking.customerName}</p>
                                                                    <p>Contact: {booking.phone}</p>
                                                                    <p>Time: {formatDateTime(booking.bookingTime)}</p>
                                                                    <p>People: {booking.numberOfPeople}</p>
                                                                </>
                                                            ) : null;
                                                        })()}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-500">No information available</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;