import React from 'react';
import { PlusCircle, Save } from 'lucide-react';
import { Role, User } from '../../type/user.type';

interface UserFormProps {
    formData: Partial<Omit<User, 'id'>>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Omit<User, 'id'>>>>;
    editingId: string | null;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    loading: boolean;
    availableRoles: Role[];
}

const UserForm: React.FC<UserFormProps> = ({
    formData,
    setFormData,
    editingId,
    onSubmit,
    onCancel,
    loading,
    availableRoles,
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleChange = (roleId: string) => {
        const selectedRoles = formData.roles || [];
        const isSelected = selectedRoles.some((role) => role.id.toString() === roleId);

        const updatedRoles = isSelected
            ? selectedRoles.filter((role) => role.id.toString() !== roleId)
            : [...selectedRoles, availableRoles.find((role) => role.id.toString() === roleId)!];

        setFormData({ ...formData, roles: updatedRoles });
    };

    const selectedRoleIds = formData.roles?.map((role) => role.id.toString()) || [];

    return (
        <form
            onSubmit={onSubmit}
            className="px-6 py-6 bg-white rounded-lg shadow-sm max-w-2xl mx-auto"
            aria-label={editingId ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
        >
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                {/* Username */}
                <div className="sm:col-span-1">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                        Tên người dùng
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        required
                        value={formData.username || ''}
                        onChange={handleInputChange}
                        className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        placeholder="Nhập tên người dùng"
                        aria-required="true"
                    />
                </div>

                {/* Email */}
                <div className="sm:col-span-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        placeholder="Nhập email"
                        aria-required="true"
                    />
                </div>

                {/* Phone */}
                <div className="sm:col-span-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                        Số điện thoại
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        placeholder="Nhập số điện thoại"
                    />
                </div>

                {/* Password */}
                <div className="sm:col-span-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                        Mật khẩu {editingId && <span className="text-xs text-gray-500">(để trống nếu không thay đổi)</span>}
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required={!editingId}
                        value={formData.password || ''}
                        onChange={handleInputChange}
                        className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        placeholder="Nhập mật khẩu"
                    />
                </div>

                {/* Roles */}
                <div className="sm:col-span-2">
                    <label htmlFor="roles" className="block text-sm font-medium text-gray-900">
                        Vai trò
                    </label>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {availableRoles.map((role) => (
                            <label
                                key={role.id}
                                className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    value={role.id.toString()}
                                    checked={selectedRoleIds.includes(role.id.toString())}
                                    onChange={() => handleRoleChange(role.id.toString())}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span>{role.name}</span>
                            </label>
                        ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Chọn một hoặc nhiều vai trò</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition duration-200"
                >
                    {loading ? (
                        <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
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
                    ) : editingId ? (
                        <>
                            <Save className="-ml-1 mr-2 h-5 w-5" />
                            Cập nhật
                        </>
                    ) : (
                        <>
                            <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                            Thêm
                        </>
                    )}
                    {loading ? 'Đang xử lý...' : editingId ? 'Cập nhật' : 'Thêm'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;