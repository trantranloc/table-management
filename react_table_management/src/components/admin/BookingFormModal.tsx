// src/components/admin/BookingFormModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { Table } from '../../type/table.type';
import { BookingRequest } from '../../type/booking.type';
import BookingForm from './BookingForm';

interface BookingFormModalProps {
    selectedTable: Table;
    formData: BookingRequest;
    setFormData: React.Dispatch<React.SetStateAction<BookingRequest>>;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    formError: string | null;
    successMessage: string | null;
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({
    selectedTable,
    formData,
    setFormData,
    onSubmit,
    onCancel,
    submitting,
    formError,
    successMessage
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md max-w-lg w-full">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Book Table {selectedTable.tableNumber}
                    </h3>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <BookingForm
                    formData={formData}
                    setFormData={setFormData}
                    selectedTable={selectedTable}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    submitting={submitting}
                    formError={formError}
                    successMessage={successMessage}
                />
            </div>
        </div>
    );
};

export default BookingFormModal;