import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '../../type/table.type';
import tableService from '../../services/table.service';
import { Booking, BookingRequest, BookingStatus } from '../../type/booking.type';
import bookingService from '../../services/booking.service';
import TabNavigation from '../../components/admin/TabNavigation';
import TableView from '../../components/admin/TableView';
import BookingView from '../../components/admin/BookingView';
import BookingFormModal from '../../components/admin/BookingFormModal';
import BookingDetailsModal from '../../components/admin/BookingDetailsModal';


const BookingManagement: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);

    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [formData, setFormData] = useState<BookingRequest>({
        customerName: '',
        phone: '',
        bookingTime: '',
        numberOfPeople: 1,
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [bookingView, setBookingView] = useState<boolean>(false);

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            try {
                const response = await tableService.fetchAllTables();
                setTables(response.result);
                setLoadingBookings(false);
            } catch {
                setFormError('Không thể tải danh sách bàn');
            } finally {
                setLoading(false);
            }
        };
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const response = await bookingService.fetchAllBookings();
                setBookings(response.result);
            } catch {
                setFormError('Không thể tải danh sách bàn');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
        fetchTables();
    }, []);


    const handleOpenForm = (table: Table) => {
        setSelectedTable(table);
        setFormData({
            customerName: '',
            phone: '',
            bookingTime: '',
            numberOfPeople: 1,
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
        if (!formData.phone.trim()) {
            setFormError('Customer phone is required.');
            return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            setFormError('Phone number must be 10 digits.');
            return false;
        }
        if (formData.numberOfPeople < 1) {
            setFormError('Number of guests must be at least 1.');
            return false;
        }
        if (selectedTable && formData.numberOfPeople > selectedTable.capacity) {
            setFormError(`Guests exceed table capacity (${selectedTable.capacity}).`);
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
            // Gửi request tạo booking
            const bookingRequest: BookingRequest = {
                customerName: formData.customerName,
                phone: formData.phone,
                bookingTime: formData.bookingTime,
                numberOfPeople: formData.numberOfPeople,
            };

            const createRes = await bookingService.createBooking(bookingRequest);
            const bookingId = createRes.result.id;

            // Gán bàn cho booking vừa tạo
            await bookingService.updateBookingTable(bookingId, selectedTable.id);

            // Cập nhật giao diện
            setSuccessMessage(`Đặt bàn ${selectedTable.tableNumber} thành công.`);
            setSelectedTable(null);
            setFormData({
                customerName: '',
                phone: '',
                bookingTime: '',
                numberOfPeople: 1,
            });

            // await fetchBookings();
            // await fetchTables();

        } catch (err) {
            setFormError('Không thể đặt bàn. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };


    const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
        try {
            // Call the updateStatus method from bookingService
            await bookingService.updateStatus(bookingId, newStatus);

            // Update the booking list in the state with the new status
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));

            // Check if the selected booking has a table and update its status
            if (selectedBooking?.table) {
                const tableStatus = newStatus === BookingStatus.CONFIRMED ? 'UNAVAILABLE' : 'AVAILABLE';
                setTables(prev => prev.map(t =>
                    t.id === selectedBooking.table!.id ? { ...t, status: tableStatus as "AVAILABLE" | "UNAVAILABLE" } : t
                ));
            }

            // Set the selected booking's new status and show success message
            setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
            setSuccessMessage(`✔ Booking ${newStatus.toLowerCase()}!`);

            // Clear the selected booking and success message after 2 seconds
            setTimeout(() => {
                setSelectedBooking(null);
                setSuccessMessage(null);
            }, 2000);
        } catch (err) {
            // If an error occurs, set the form error message
            setFormError('❌ Không thể cập nhật. Vui lòng thử lại.');
        }
    };

    const handleUpdateTable = async (bookingId: string, tableId: string): Promise<void> => {
        try {
            const response = await bookingService.updateBookingTable(bookingId, tableId);
            console.log("✅ Cập nhật bàn thành công:", response);
        } catch (error) {
            console.error("Lỗi khi cập nhật bàn:", error);
        }
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
                <TabNavigation
                    bookingView={bookingView}
                    setBookingView={setBookingView}
                />

                {!bookingView ? (
                    <TableView
                        tables={tables}
                        loading={loading}
                        onBookTable={handleOpenForm}
                    />
                ) : (
                    <BookingView
                        bookings={bookings}
                        tables={tables}
                        onViewBookingDetails={handleOpenBookingDetails}
                    />
                )}
            </div>

            {/* Modal Booking Form */}
            {selectedTable && (
                <BookingFormModal
                    selectedTable={selectedTable}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseForm}
                    submitting={submitting}
                    formError={formError}
                    successMessage={successMessage}
                />
            )}
            {/* Modal Booking Details */}
            {selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    onClose={handleCloseBookingDetails}
                    onUpdateStatus={handleUpdateBookingStatus}
                    onUpdateTable={handleUpdateTable}
                    formError={formError}
                    successMessage={successMessage}
                />
            )}
        </div>
    );
};

export default BookingManagement;