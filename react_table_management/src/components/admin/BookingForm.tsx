import React from 'react';
import { BookingRequest } from '../../type/booking.type';
import { Table } from '../../type/table.type';


interface BookingFormProps {
    formData: BookingRequest;
    setFormData: React.Dispatch<React.SetStateAction<BookingRequest>>;
    selectedTable: Table | null;
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
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox'
                ? checked
                : name === 'numberOfPeople'
                    ? Number(value)
                    : value,
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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Phone
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Date & Time
                </label>
                <input
                    id="bookingTime"
                    name="bookingTime"
                    type="datetime-local"
                    value={formData.bookingTime}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests
                </label>
                <input
                    id="numberOfPeople"
                    name="numberOfPeople"
                    type="number"
                    value={formData.numberOfPeople}
                    onChange={handleInputChange}
                    min="1"
                    max={selectedTable ? selectedTable.capacity : undefined}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
                {selectedTable && (
                    <p className="mt-1 text-sm text-gray-500">
                        Table capacity: {selectedTable.capacity} people
                    </p>
                )}
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
                    {submitting ? 'Submitting...' : 'Submit Bookings'}
                </button>
            </div>
        </form>
    );
};

export default BookingForm;