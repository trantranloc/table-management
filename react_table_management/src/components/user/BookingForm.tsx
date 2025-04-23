import React, { useState, FormEvent } from 'react';
import { BookingRequest } from '../../type/booking.type';

const BookingForm: React.FC<{ addBooking: (booking: BookingRequest) => void }> = ({ addBooking }) => {
    const [formData, setFormData] = useState<BookingRequest>({
        customerName: '',
        phone: '',
        bookingTime: '',
        numberOfPeople: 1,
        note: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'numberOfPeople' ? parseInt(value) || 1 : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccess(null);

        try {
            await addBooking(formData);
            setSuccess('Booking request submitted successfully!');
            setFormData({ customerName: '', phone: '', bookingTime: '', numberOfPeople: 1, note: '' });
        } catch (err) {
            // Lỗi được xử lý trong Home
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto bg-white p-8 rounded-xl transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Book Your Table</h2>
            {success && (
                <p className="text-green-600 bg-green-50 py-2 px-4 rounded-md mb-6 text-center">
                    {success}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cột 1 */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 disabled:opacity-50"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 disabled:opacity-50"
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>
                    {/* Cột 2 */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Booking Time
                            </label>
                            <input
                                type="datetime-local"
                                name="bookingTime"
                                value={formData.bookingTime}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Number of People
                            </label>
                            <input
                                type="number"
                                name="numberOfPeople"
                                value={formData.numberOfPeople}
                                onChange={handleChange}
                                min="1"
                                required
                                disabled={isLoading}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 disabled:opacity-50"
                                placeholder="Enter number of people"
                            />
                        </div>
                    </div>
                </div>
                {/* Note field (full width) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note (Optional)
                    </label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 disabled:opacity-50"
                        placeholder="Any special requests?"
                        rows={4}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Submitting...
                        </span>
                    ) : (
                        'Submit Request'
                    )}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;