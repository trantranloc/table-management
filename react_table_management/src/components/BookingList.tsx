export interface Booking {
    id: number;
    tableId: number;
    customerName: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}
const BookingList: React.FC = () => {
    const bookings: Booking[] = [
        { id: 1, tableId: 1, customerName: 'John Doe', date: '2025-04-17', time: '18:00', status: 'confirmed' },
        { id: 2, tableId: 2, customerName: 'Jane Smith', date: '2025-04-17', time: '19:00', status: 'pending' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Booking Management</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Customer</th>
                            <th className="p-3 text-left">Table</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Time</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="border-t">
                                <td className="p-3">{booking.customerName}</td>
                                <td className="p-3">T0{booking.tableId}</td>
                                <td className="p-3">{booking.date}</td>
                                <td className="p-3">{booking.time}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-white ${booking.status === 'confirmed' ? 'bg-green-500' :
                                        booking.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2">
                                        Edit
                                    </button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingList;