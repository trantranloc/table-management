import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X, Check, Clock, AlertCircle } from 'lucide-react';
import BookingTable from '../../components/BookingTable';
import BookingForm from '../../components/BookingForm';
import tableService from '../../services/tableService';
import { Table } from '../../type/table.type';


interface Booking {
    id: string;
    tableId: string;
    customerName: string;
    customerPhone: string;
    bookingDate: string;
    guests: number;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
    createdAt: string;
}

interface BookingFormData {
    customerName: string;
    customerPhone: string;
    date: string;
    time: string;
    guests: number;
    overrideStatus: boolean;
}

const BookingManagement: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [formData, setFormData] = useState<BookingFormData>({
        customerName: '',
        customerPhone: '',
        date: '',
        time: '',
        guests: 1,
        overrideStatus: false,
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [floorFilter, setFloorFilter] = useState<string>('all');
    const [bookingView, setBookingView] = useState<boolean>(false);
    const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

    // Mock bookings data
    const mockBookings: Booking[] = [
        {
            id: '1',
            tableId: '2',
            customerName: 'Nguyen Van A',
            customerPhone: '0123456789',
            bookingDate: '2025-04-25T18:30:00',
            guests: 4,
            status: 'PENDING',
            createdAt: '2025-04-22T10:15:00'
        },
        {
            id: '2',
            tableId: '4',
            customerName: 'Tran Thi B',
            customerPhone: '0987654321',
            bookingDate: '2025-04-23T19:00:00',
            guests: 6,
            status: 'CONFIRMED',
            createdAt: '2025-04-21T14:30:00'
        },
        {
            id: '3',
            tableId: '1',
            customerName: 'Le Van C',
            customerPhone: '0369852147',
            bookingDate: '2025-04-24T20:00:00',
            guests: 2,
            status: 'PENDING',
            createdAt: '2025-04-22T09:45:00'
        }
    ];
    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            try {
                const response = await tableService.fetchAllTables();
                setTables(response.result);
            } catch {
                setFormError('Không thể tải danh sách bàn');
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);
    useEffect(() => {
        // Mock data for demo
        setLoading(false);

        setBookings(mockBookings);
        setLoadingBookings(false);
    }, []);

    const handleOpenForm = (table: Table) => {
        setSelectedTable(table);
        setFormData({
            customerName: '',
            customerPhone: '',
            date: '',
            time: '',
            guests: 1,
            overrideStatus: false,
        });
        setFormError(null);
        setSuccessMessage(null);
    };

    const handleCloseForm = () => {
        setSelectedTable(null);
    };

    const handleOpenBookingDetails = (booking: Booking) => {
        setSelectedBooking(booking);
    };

    const handleCloseBookingDetails = () => {
        setSelectedBooking(null);
    };

    const validateForm = (): boolean => {
        if (!formData.customerName.trim()) {
            setFormError('Customer name is required.');
            return false;
        }
        if (!formData.customerPhone.trim()) {
            setFormError('Customer phone is required.');
            return false;
        }
        if (!/^\d{10}$/.test(formData.customerPhone)) {
            setFormError('Phone number must be 10 digits.');
            return false;
        }
        if (!formData.date) {
            setFormError('Booking date is required.');
            return false;
        }
        if (!formData.time) {
            setFormError('Booking time is required.');
            return false;
        }
        if (formData.guests < 1) {
            setFormError('Number of guests must be at least 1.');
            return false;
        }
        if (selectedTable && formData.guests > selectedTable.capacity) {
            setFormError(`Guests exceed table capacity (${selectedTable.capacity}).`);
            return false;
        }
        if (selectedTable && selectedTable.status !== 'AVAILABLE' && !formData.overrideStatus) {
            setFormError('Table is not available. Check "Override Status" to book.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTable || !validateForm()) return;

        setSubmitting(true);
        setFormError(null);
        setSuccessMessage(null);

        try {
            // Mock API call (replace with real endpoint)
            // await axios.post('/api/v1/bookings', {
            //   tableId: selectedTable.id,
            //   customerName: formData.customerName,
            //   customerPhone: formData.customerPhone,
            //   bookingDate: `${formData.date}T${formData.time}`,
            //   guests: formData.guests,
            // });
            // await axios.patch(`/api/v1/tables/${selectedTable.id}`, { status: 'PROCESSING' });

            // Add the new booking to the mock data
            const newBooking: Booking = {
                id: String(bookings.length + 1),
                tableId: selectedTable.id,
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                bookingDate: `${formData.date}T${formData.time}`,
                guests: formData.guests,
                status: 'PENDING',
                createdAt: new Date().toISOString()
            };

            setBookings(prev => [...prev, newBooking]);

            setTables((prev) =>
                prev.map((t) =>
                    t.id === selectedTable.id ? { ...t, status: 'PROCESSING' } : t
                )
            );
            setSuccessMessage(`Table ${selectedTable.tableNumber} booked successfully.`);
            setSelectedTable(null);
            setFormData({
                customerName: '',
                customerPhone: '',
                date: '',
                time: '',
                guests: 1,
                overrideStatus: false,
            });
        } catch (err) {
            setFormError('Failed to book table. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateBookingStatus = async (bookingId: string, newStatus: 'CONFIRMED' | 'REJECTED') => {
        try {
            // Mock API call (replace with real endpoint)
            // await axios.patch(`/api/v1/bookings/${bookingId}`, { status: newStatus });

            setBookings(prev =>
                prev.map(booking =>
                    booking.id === bookingId ? { ...booking, status: newStatus } : booking
                )
            );

            // If confirmed, update the table status to BOOKED
            // If rejected, update the table status to AVAILABLE
            if (selectedBooking) {
                const tableStatus = newStatus === 'CONFIRMED' ? 'BOOKED' : 'AVAILABLE';
                setTables(prev =>
                    prev.map(table =>
                        table.id === selectedBooking.tableId ? { ...table, status: tableStatus } : table
                    )
                );

                setSelectedBooking({
                    ...selectedBooking,
                    status: newStatus
                });

                setSuccessMessage(`Booking ${newStatus.toLowerCase()} successfully.`);

                // Close the modal after a delay
                setTimeout(() => {
                    setSelectedBooking(null);
                    setSuccessMessage(null);
                }, 2000);
            }
        } catch (err) {
            setFormError(`Failed to ${newStatus.toLowerCase()} booking. Please try again.`);
        }
    };

    // Filter tables based on search term and filters
    const filteredTables = tables.filter((table) => {
        const matchesSearch =
            table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            table.capacity.toString().includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
        const matchesFloor = floorFilter === 'all' || table.floor.toString() === floorFilter;

        return matchesSearch && matchesStatus && matchesFloor;
    });

    // Filter bookings based on status filter
    const filteredBookings = bookings.filter((booking) => {
        const matchesStatus = bookingStatusFilter === 'all' || booking.status === bookingStatusFilter;
        return matchesStatus;
    });

    // Get unique floor values for the filter
    const uniqueFloors = Array.from(new Set(tables.map(table => table.floor))).sort((a, b) => a - b);

    // Format date string to readable format
    const formatDateTime = (dateString: string) => {
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
    const getTableInfo = (tableId: string) => {
        return tables.find(table => table.id === tableId);
    };

    if (loading || loadingBookings) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-gray-800">
                <p className="text-xl font-medium">Loading data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center px-4 py-8 bg-gray-100">
            <div className="max-w-7xl w-full">
                <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                    <h2 className="text-3xl font-semibold text-gray-800">Admin Table Booking</h2>
                    <div className="mt-3 sm:mt-0 sm:ml-4">
                        <Link
                            to="/admin/dashboard"
                            className="inline-block text-indigo-600 font-medium hover:underline"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>

                {/* View toggle */}
                <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex" aria-label="Tabs">
                            <button
                                onClick={() => setBookingView(false)}
                                className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${!bookingView
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Table Management
                            </button>
                            <button
                                onClick={() => setBookingView(true)}
                                className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${bookingView
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Booking Requests
                            </button>
                        </nav>
                    </div>
                </div>

                {!bookingView ? (
                    // Tables View
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
                                            <option value="BOOKED">Booked</option>
                                            <option value="PROCESSING">Processing</option>
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
                            onBookTable={handleOpenForm}
                            loading={loading}
                        />
                    </>
                ) : (
                    // Bookings View
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
                                            <option value="REJECTED">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bookings List */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-md mt-1">
                            <ul role="list" className="divide-y divide-gray-200">
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => {
                                        const table = getTableInfo(booking.tableId);
                                        return (
                                            <li key={booking.id}>
                                                <div
                                                    className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => handleOpenBookingDetails(booking)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <p className="text-sm font-medium text-indigo-600 truncate">
                                                                {booking.customerName}
                                                            </p>
                                                            <div className="ml-4 flex-shrink-0 flex">
                                                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                    ${booking.status === 'PENDING'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : booking.status === 'CONFIRMED'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-red-100 text-red-800'}`}>
                                                                    {booking.status}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="ml-2 flex-shrink-0 flex">
                                                            <p className="text-sm text-gray-500">
                                                                Table: {table?.tableNumber || '?'} ({table?.capacity || '?'} guests)
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 sm:flex sm:justify-between">
                                                        <div className="sm:flex">
                                                            <p className="flex items-center text-sm text-gray-500">
                                                                <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                                {formatDateTime(booking.bookingDate)}
                                                            </p>
                                                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                                <AlertCircle className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                                {booking.guests} guests
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                            <p>
                                                                Booked on {formatDateTime(booking.createdAt)}
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
                )}
            </div>

            {/* Modal Booking Form */}
            {selectedTable && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-md max-w-lg w-full">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Book Table {selectedTable.tableNumber}
                            </h3>
                            <button
                                type="button"
                                onClick={handleCloseForm}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <BookingForm
                            formData={formData}
                            setFormData={setFormData}
                            selectedTable={selectedTable}
                            onSubmit={handleSubmit}
                            onCancel={handleCloseForm}
                            submitting={submitting}
                            formError={formError}
                            successMessage={successMessage}
                        />
                    </div>
                </div>
            )}

            {/* Modal Booking Details */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-md max-w-lg w-full">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Booking Details
                            </h3>
                            <button
                                type="button"
                                onClick={handleCloseBookingDetails}
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

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status:</span>
                                    <span className={`font-medium ${selectedBooking.status === 'PENDING'
                                            ? 'text-yellow-600'
                                            : selectedBooking.status === 'CONFIRMED'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Customer Name:</span>
                                    <span className="font-medium">{selectedBooking.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Phone Number:</span>
                                    <span className="font-medium">{selectedBooking.customerPhone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Booking Date:</span>
                                    <span className="font-medium">{formatDateTime(selectedBooking.bookingDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Number of Guests:</span>
                                    <span className="font-medium">{selectedBooking.guests}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Table:</span>
                                    <span className="font-medium">
                                        {getTableInfo(selectedBooking.tableId)?.tableNumber || 'Unknown'}
                                        (Floor {getTableInfo(selectedBooking.tableId)?.floor || '?'})
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Created At:</span>
                                    <span className="font-medium">{formatDateTime(selectedBooking.createdAt)}</span>
                                </div>

                                {selectedBooking.status === 'PENDING' && (
                                    <div className="flex justify-between space-x-4 pt-4 border-t">
                                        <button
                                            onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'CONFIRMED')}
                                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                                        >
                                            <Check className="h-5 w-5 mr-1" />
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'REJECTED')}
                                            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center justify-center"
                                        >
                                            <X className="h-5 w-5 mr-1" />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;