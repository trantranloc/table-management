const BookingForm: React.FC = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Create Booking</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Customer Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Table</label>
                    <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select table</option>
                        <option>Table T01</option>
                        <option>Table T02</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Date</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Time</label>
                    <input
                        type="time"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Create Booking
                </button>
            </div>
        </div>
    );
};

export default BookingForm;