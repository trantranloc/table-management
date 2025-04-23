// src/components/admin/TabNavigation.tsx
import React from 'react';

interface TabNavigationProps {
  bookingView: boolean;
  setBookingView: (value: boolean) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ bookingView, setBookingView }) => {
  return (
    <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setBookingView(false)}
            className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
              !bookingView
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Table Management
          </button>
          <button
            onClick={() => setBookingView(true)}
            className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
              bookingView
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Booking Requests
          </button>
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;