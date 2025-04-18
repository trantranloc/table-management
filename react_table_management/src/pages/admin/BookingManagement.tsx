import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Table {
    id: string;
    tableNumber: string;
    capacity: number;
    floor: number;
    status: 'BOOKED' | 'PROCESSING' | 'AVAILABLE';
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
    const [loading, setLoading] = useState(true);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
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

    // Mock data
    const mockTables: Table[] = [
        { id: '1', tableNumber: 'T01', capacity: 4, floor: 1, status: 'AVAILABLE' },
        { id: '2', tableNumber: 'T02', capacity: 6, floor: 2, status: 'BOOKED' },
        { id: '3', tableNumber: 'T03', capacity: 2, floor: 1, status: 'AVAILABLE' },
        { id: '4', tableNumber: 'T04', capacity: 8, floor: 3, status: 'PROCESSING' },
        { id: '5', tableNumber: 'T05', capacity: 4, floor: 2, status: 'AVAILABLE' },
    ];

    useEffect(() => {
        // Mock data for demo
        setTables(mockTables);
        setLoading(false);
        // Real API call (uncomment when ready)
        // axios
        //   .get('/api/v1/tables')
        //   .then((res) => setTables(res.data as Table[]))
        //   .catch((err) => {
        //     console.error(err);
        //     setFormError('Failed to load tables.');
        //   })
        //   .finally(() => setLoading(false));
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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
    ) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : name === 'guests' ? Number(value) : value,
        }));
        setFormError(null);
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

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-gray-800">
                <p className="text-xl font-medium">Loading tables...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center px-4 py-8 bg-gray-100">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">Admin Table Booking</h2>
            <div className="max-w-4xl w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tables</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tables.map((table) => (
                        <div
                            key={table.id}
                            className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
                        >
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Table {table.tableNumber}</h4>
                            <p className="text-sm text-gray-600">Capacity: {table.capacity}</p>
                            <p className="text-sm text-gray-600">Floor: {table.floor}</p>
                            <p className="text-sm text-gray-600">
                                Status:{' '}
                                <span
                                    className={
                                        table.status === 'AVAILABLE'
                                            ? 'text-green-600'
                                            : table.status === 'BOOKED'
                                                ? 'text-red-600'
                                                : 'text-yellow-600'
                                    }
                                >
                                    {table.status}
                                </span>
                            </p>
                            <button
                                onClick={() => handleOpenForm(table)}
                                className="mt-4 w-full py-2 px-4 rounded-md font-medium transition duration-200 bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                Book Table
                            </button>
                        </div>
                    ))}
                </div>
                {tables.length === 0 && (
                    <p className="text-center text-gray-600 mt-6">No tables available.</p>
                )}
                <Link
                    to="/admin/dashboard"
                    className="mt-6 inline-block text-indigo-600 font-medium hover:underline"
                >
                    Back to Dashboard
                </Link>
            </div>

            {/* Modal Booking Form */}
            {selectedTable && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Book Table {selectedTable.tableNumber}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Customer Name
                                </label>
                                <input
                                    id="customerName"
                                    name="customerName"
                                    type="text"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Customer Phone
                                </label>
                                <input
                                    id="customerPhone"
                                    name="customerPhone"
                                    type="text"
                                    value={formData.customerPhone}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Booking Date
                                </label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                    Booking Time
                                </label>
                                <input
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Guests
                                </label>
                                <input
                                    id="guests"
                                    name="guests"
                                    type="number"
                                    value={formData.guests}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="overrideStatus" className="flex items-center text-sm font-medium text-gray-700">
                                    <input
                                        id="overrideStatus"
                                        name="overrideStatus"
                                        type="checkbox"
                                        checked={formData.overrideStatus}
                                        onChange={handleInputChange}
                                        className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    Override Table Status (Admin Only)
                                </label>
                            </div>
                            {formError && <p className="text-sm text-red-600 mb-4">{formError}</p>}
                            {successMessage && <p className="text-sm text-green-600 mb-4">{successMessage}</p>}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="py-2 px-4 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`py-2 px-4 rounded-md font-medium transition duration-200 ${submitting
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;