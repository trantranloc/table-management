import React from 'react';
import { Users, BookOpen, Utensils, Calendar } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // In a real application, you would fetch this data from an API
  const stats = {
    totalEmployees: 12,
    totalTables: 25,
    availableTables: 15,
    reservationsToday: 8,
    totalCapacity: 150, // Added: Total capacity of all tables
  };

  // Sample reservation data with status counts
  const reservations = [
    {
      id: '#1001',
      customer: 'Nguyen Van A',
      table: 'Table 05',
      time: '18/04/2025 18:00',
      status: 'CONFIRMED',
    },
    {
      id: '#1002',
      customer: 'Tran Thi B',
      table: 'Table 12',
      time: '18/04/2025 19:30',
      status: 'PENDING',
    },
    {
      id: '#1003',
      customer: 'Le Van C',
      table: 'Table 08',
      time: '19/04/2025 12:00',
      status: 'NEW',
    },
  ];

  // Calculate reservation status counts
  const statusCounts = {
    confirmed: reservations.filter((r) => r.status === 'CONFIRMED').length,
    pending: reservations.filter((r) => r.status === 'PENDING').length,
    new: reservations.filter((r) => r.status === 'NEW').length,
  };

  // Calculate table availability percentage
  const availabilityPercentage = ((stats.availableTables / stats.totalTables) * 100).toFixed(1);

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users size={24} className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Tables"
          value={stats.totalTables}
          icon={<Utensils size={24} className="text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Available Tables"
          value={`${stats.availableTables} (${availabilityPercentage}%)`}
          icon={<BookOpen size={24} className="text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Reservations Today"
          value={stats.reservationsToday}
          icon={<Calendar size={24} className="text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Capacity"
          value={stats.totalCapacity}
          icon={<Utensils size={24} className="text-white" />}
          color="bg-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Reservations</h2>
          {reservations.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No recent reservations</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Table</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{reservation.id}</td>
                      <td className="px-4 py-2">{reservation.customer}</td>
                      <td className="px-4 py-2">{reservation.table}</td>
                      <td className="px-4 py-2">{reservation.time}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${reservation.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : reservation.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {reservation.status === 'CONFIRMED'
                            ? 'Confirmed'
                            : reservation.status === 'PENDING'
                              ? 'Pending'
                              : 'New'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Table Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Available Tables</h3>
              <p className="text-2xl font-bold text-green-800">{stats.availableTables}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-medium text-red-800">Reserved Tables</h3>
              <p className="text-2xl font-bold text-red-800">{stats.totalTables - stats.availableTables}</p>
            </div>
          </div>
          <div className="mt-4 bg-blue-100 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Reservation Status</h3>
            <p className="text-sm text-blue-800">
              Confirmed: {statusCounts.confirmed} | Pending: {statusCounts.pending} | New: {statusCounts.new}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;