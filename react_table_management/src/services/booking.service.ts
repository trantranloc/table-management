import axiosClient from "../api/axiosClient";
import { BaseResponse } from "../type/base.type";
import { Booking, BookingRequest } from "../type/booking.type";

const API_URL = "/bookings";

const bookingService = {
    fetchAllBookings: async (): Promise<BaseResponse<Booking[]>> => {
        const response = await axiosClient.get<BaseResponse<Booking[]>>(API_URL);
        return response.data;
    },

    fetchBookingById: async (id: string): Promise<BaseResponse<Booking>> => {
        const response = await axiosClient.get<BaseResponse<Booking>>(`${API_URL}/${id}`);
        return response.data;
    },

    createBooking: async (booking: BookingRequest): Promise<BaseResponse<Booking>> => {
        const response = await axiosClient.post<BaseResponse<Booking>>(API_URL, booking);
        console.log(response)
        return response.data;
    },

    updateBooking: async (id: string, booking: any): Promise<BaseResponse<Booking>> => {
        const response = await axiosClient.put<BaseResponse<Booking>>(`${API_URL}/${id}`, booking);
        return response.data;
    },

    deleteBooking: async (id: string): Promise<BaseResponse<void>> => {
        const response = await axiosClient.delete<BaseResponse<void>>(`${API_URL}/${id}`);
        return response.data;
    },
    updateStatus: async (id: string, status: string): Promise<BaseResponse<Booking>> => {
        const response = await axiosClient.patch<BaseResponse<Booking>>(`${API_URL}/${id}`, { status });
        return response.data;
    },
    updateBookingTable: async (bokingid: string, tableId: string): Promise<BaseResponse<Booking>> => {
    const response = await axiosClient.patch<BaseResponse<Booking>>(`${API_URL}/${bokingid}/table`, { tableId });
    return response.data;
}
};

export default bookingService;