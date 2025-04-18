const Dashboard: React.FC = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Tables</h3>
                    <p className="text-2xl">20</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Active Bookings</h3>
                    <p className="text-2xl">15</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Available Tables</h3>
                    <p className="text-2xl">5</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;