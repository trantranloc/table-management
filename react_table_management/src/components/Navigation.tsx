const Navigation: React.FC = () => {
    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Booking Admin</h1>
                <div className="space-x-4">
                    <a href="" className="hover:underline">Dashboard</a>
                    <a href="tables" className="hover:underline">Tables</a>
                    <a href="bookings" className="hover:underline">Bookings</a>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;