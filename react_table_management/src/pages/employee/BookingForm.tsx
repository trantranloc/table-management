import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bookingService from '../../services/booking.service';
import tableService from '../../services/table.service';
import { Table } from '../../type/table.type';
import { BookingStatus } from '../../type/booking.type';

interface BookingFormData {
    tableId: string;
    customerName: string;
    phone: string;
    bookingTime: string;
    bookingDate: string;
    numberOfPeople: number;
    notes: string;
}

const EmployeeBookingForm: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [formData, setFormData] = useState<BookingFormData>({
        tableId: '',
        customerName: '',
        phone: '',
        bookingDate: '',
        bookingTime: '',
        numberOfPeople: 1,
        notes: '',
    });
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            try {
                const response = await tableService.fetchAllTables();
                // Filter only available tables
                const availableTables = response.result.filter((table) => table.status === 'AVAILABLE');
                setTables(availableTables);
            } catch (err) {
                setFormError('Failed to load tables. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'numberOfPeople' ? Number(value) : value,
        }));
        setFormError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.tableId) {
            setFormError('Please select a table.');
            return false;
        }
        if (!formData.customerName.trim()) {
            setFormError('Customer name is required.');
            return false;
        }
        if (!formData.phone.trim()) {
            setFormError('Phone number is required.');
            return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            setFormError('Phone number must be 10 digits.');
            return false;
        }
        if (!formData.bookingDate) {
            setFormError('Booking date is required.');
            return false;
        }
        if (!formData.bookingTime) {
            setFormError('Booking time is required.');
            return false;
        }
        if (formData.numberOfPeople < 1) {
            setFormError('Number of guests must be at least 1.');
            return false;
        }

        const selectedTable = tables.find((t) => t.id === formData.tableId);
        if (selectedTable && formData.numberOfPeople > selectedTable.capacity) {
            setFormError(`Number of guests exceeds table capacity (${selectedTable.capacity}).`);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setFormError(null);
        setSuccessMessage(null);

        try {
            // Format booking time as expected by API
            const bookingDateTime = `${formData.bookingDate}T${formData.bookingTime}:00`;

            // Create booking request object
            const bookingRequest = {
                customerName: formData.customerName,
                phone: formData.phone,
                bookingTime: bookingDateTime,
                numberOfPeople: formData.numberOfPeople,
                notes: formData.notes,
            };

            // Create booking
            const createRes = await bookingService.createBooking(bookingRequest);
            const bookingId = createRes.result.id;

            // Assign table to booking
            await bookingService.updateBookingTable(bookingId, formData.tableId);

            // Update booking status to CONFIRMED
            await bookingService.updateStatus(bookingId, BookingStatus.CONFIRMED);

            setSuccessMessage(`Booking successfully created for ${formData.customerName}!`);

            // Reset form
            setFormData({
                tableId: '',
                customerName: '',
                phone: '',
                bookingDate: '',
                bookingTime: '',
                numberOfPeople: 1,
                notes: '',
            });

        } catch (err) {
            setFormError('Failed to create booking. Please try again.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-gray-800">
                <p className="text-xl font-medium">Loading data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center px-4 py-8 bg-gray-100">
            <div className="max-w-3xl w-full">
                <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                    <h2 className="text-3xl font-semibold text-gray-800">Create New Booking</h2>
                    <div className="mt-3 sm:mt-0 sm:ml-4">
                        <Link
                            to="/employee/bookings"
                            className="inline-block text-indigo-600 font-medium hover:underline"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200 text-gray-800"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Customer Information</h3>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                                Customer Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="customerName"
                                name="customerName"
                                type="text"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        {/* Booking Information */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Booking Information</h3>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="tableId" className="block text-sm font-medium text-gray-700 mb-1">
                                Select Table <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="tableId"
                                name="tableId"
                                value={formData.tableId}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="">-- Select Table --</option>
                                {tables.map((table) => (
                                    <option key={table.id} value={table.id}>
                                        Table {table.tableNumber} (Floor {table.floor}, Capacity: {table.capacity})
                                    </option>
                                ))}
                            </select>
                            {tables.length === 0 && (
                                <p className="text-sm text-yellow-600 mt-1">
                                    No tables available. Please check again later.
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Guests <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="numberOfPeople"
                                name="numberOfPeople"
                                type="number"
                                value={formData.numberOfPeople}
                                onChange={handleInputChange}
                                min="1"
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Booking Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="bookingDate"
                                name="bookingDate"
                                type="date"
                                value={formData.bookingDate}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700 mb-1">
                                Booking Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="bookingTime"
                                name="bookingTime"
                                type="time"
                                value={formData.bookingTime}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="mb-4 md:col-span-2">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {formError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                            <p>{formError}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md">
                            <p>{successMessage}</p>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <Link
                            to="/employee/bookings"
                            className="mr-4 py-2 px-4 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition duration-200"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`py-2 px-6 rounded-md font-medium transition duration-200 ${submitting
                                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                        >
                            {submitting ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeBookingForm;