import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Table interface based on TableEntity
interface Table {
    id: string;
    tableNumber: string;
    capacity: number;
    floor: number;
    status: 'BOOKED' | 'PROCESSING' | 'AVAILABLE';
}

// Booking form data
interface BookingFormData {
    tableId: string;
    customerName: string;
    date: string;
    time: string;
    guests: number;
}

const StaffBookingForm: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [formData, setFormData] = useState<BookingFormData>({
        tableId: '',
        customerName: '',
        date: '',
        time: '',
        guests: 1,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const fetchTables = async () => {
        try {
            // Replace with your API endpoint, e.g., '/api/v1/tables'
            const response = await axios.get('/api/v1/tables');
            setTables(response.data as Table[]);
            setLoading(false);
        } catch (err) {
            setError('Failed to load tables. Please try again.');
            setLoading(false);
        }
    };



    useEffect(() => {
        // Comment out mock data and uncomment fetchTables for real API
        setTables(tables);
        setLoading(false);
        fetchTables();
    }, [tables]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'guests' ? Number(value) : value,
        }));
        setFormError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.tableId) return false;
        if (!formData.customerName.trim()) return false;
        if (!formData.date) return false;
        if (!formData.time) return false;
        if (formData.guests < 1) return false;
        const selectedTable = tables.find((t) => t.id === formData.tableId);
        if (selectedTable && formData.guests > selectedTable.capacity) {
            setFormError(`Guests exceed table capacity (${selectedTable.capacity}).`);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            setFormError('Please fill all required fields correctly.');
            return;
        }

        setSubmitting(true);
        try {
            // Replace with your API endpoint, e.g., POST '/api/v1/bookings'
            await axios.post('/api/v1/bookings', {
                tableId: formData.tableId,
                customerName: formData.customerName,
                bookingDate: `${formData.date}T${formData.time}`,
                guests: formData.guests,
            });
            // Optionally update table status
            await axios.patch(`/api/v1/tables/${formData.tableId}`, { status: 'BOOKED' });
            alert('Booking created successfully!');
            navigate('/booking'); // Redirect to user-facing booking page or staff dashboard
        } catch (err) {
            setFormError('Failed to create booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center text-gray-800">
                <p className="text-xl font-medium">Loading tables...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center text-red-600">
                <p className="text-xl font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center px-4 py-8 bg-gray-100">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">Create Booking</h2>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg w-full"
            >
                <div className="mb-4">
                    <label htmlFor="tableId" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Table
                    </label>
                    <select
                        id="tableId"
                        name="tableId"
                        value={formData.tableId}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="">Choose a table</option>
                        {tables.map((table) => (
                            <option key={table.id} value={table.id}>
                                {table.tableNumber} (Floor {table.floor}, Capacity: {table.capacity}, {table.status})
                            </option>
                        ))}
                    </select>
                </div>
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
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Booking Date
                    </label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]} // Disable past dates
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
                {formError && (
                    <p className="text-sm text-red-600 mb-4">{formError}</p>
                )}
                <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-2 px-4 rounded-md font-medium transition duration-200 ${submitting
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                >
                    {submitting ? 'Submitting...' : 'Submit Booking'}
                </button>
            </form>
            <Link
                to="/booking"
                className="mt-4 inline-block text-indigo-600 font-medium hover:underline"
            >
                Back to Table List
            </Link>
        </div>
    );
};

export default StaffBookingForm;