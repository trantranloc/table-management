export interface Table {
    id: number;
    number: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved';
}


const TableList: React.FC = () => {
    const tables: Table[] = [
        { id: 1, number: 'T01', capacity: 4, status: 'available' },
        { id: 2, number: 'T02', capacity: 6, status: 'occupied' },
        { id: 3, number: 'T03', capacity: 2, status: 'reserved' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Table Management</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Table Number</th>
                            <th className="p-3 text-left">Capacity</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.map((table) => (
                            <tr key={table.id} className="border-t">
                                <td className="p-3">{table.number}</td>
                                <td className="p-3">{table.capacity}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-white ${table.status === 'available' ? 'bg-green-500' :
                                        table.status === 'occupied' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}>
                                        {table.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                        Edit
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

export default TableList;