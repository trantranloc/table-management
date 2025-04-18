// src/pages/Dashboard.tsx
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
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng nhân viên"
          value={stats.totalEmployees}
          icon={<Users size={24} className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Tổng số bàn"
          value={stats.totalTables}
          icon={<Utensils size={24} className="text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Bàn còn trống"
          value={stats.availableTables}
          icon={<BookOpen size={24} className="text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Đặt bàn hôm nay"
          value={stats.reservationsToday}
          icon={<Calendar size={24} className="text-white" />}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Đơn đặt bàn gần đây</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Khách hàng</th>
                  <th className="px-4 py-2 text-left">Bàn</th>
                  <th className="px-4 py-2 text-left">Thời gian</th>
                  <th className="px-4 py-2 text-left">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">#1001</td>
                  <td className="px-4 py-2">Nguyễn Văn A</td>
                  <td className="px-4 py-2">Bàn 05</td>
                  <td className="px-4 py-2">18/04/2025 18:00</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Đã xác nhận
                    </span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">#1002</td>
                  <td className="px-4 py-2">Trần Thị B</td>
                  <td className="px-4 py-2">Bàn 12</td>
                  <td className="px-4 py-2">18/04/2025 19:30</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Chờ xác nhận
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2">#1003</td>
                  <td className="px-4 py-2">Lê Văn C</td>
                  <td className="px-4 py-2">Bàn 08</td>
                  <td className="px-4 py-2">19/04/2025 12:00</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Mới
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Tình trạng bàn</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Bàn trống</h3>
              <p className="text-2xl font-bold text-green-800">{stats.availableTables}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-medium text-red-800">Bàn đã đặt</h3>
              <p className="text-2xl font-bold text-red-800">{stats.totalTables - stats.availableTables}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;