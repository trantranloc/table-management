import React from 'react';

interface BookingFormProps {
    formData: {
        customerName: string;
        customerPhone: string;
        date: string;
        time: string;
        guests: number;
        overrideStatus: boolean;
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            customerName: string;
            customerPhone: string;
            date: string;
            time: string;
            guests: number;
            overrideStatus: boolean;
        }>
    >;
    selectedTable: { id: string; tableNumber: string; capacity: number } | null;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    submitting: boolean;
    formError: string | null;
    successMessage: string | null;
}

const BookingForm: React.FC<BookingFormProps> = ({
    formData,
    setFormData,
    selectedTable,
    onSubmit,
    onCancel,
    submitting,
    formError,
    successMessage
}) => {
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
    ) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : name === 'guests' ? Number(value) : value,
        }));
    };

    return (
        <form onSubmit={onSubmit} className="p-6">
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
                    onClick={onCancel}
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
    );
};

export default BookingForm;