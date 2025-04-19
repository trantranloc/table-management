import axiosClient from "../api/axiosClient";
import { BaseResponse } from "../type/base.type";
import { User } from "../type/user.type";

const userService = {
    fetchAllUsers: async (): Promise<BaseResponse<User[]>> => {
        const response = await axiosClient.get<BaseResponse<User[]>>("/users");
        return response.data;
    },

    fetchUserById: async (id: number): Promise<BaseResponse<User>> => {
        const response = await axiosClient.get<BaseResponse<User>>(`/users/${id}`);
        return response.data;
    },

    createUser: async (user: any): Promise<BaseResponse<User>> => {
        const response = await axiosClient.post<BaseResponse<User>>("/users", user);
        return response.data;
    },

    updateUser: async (id: string, user: any): Promise<BaseResponse<User>> => {
        const response = await axiosClient.put<BaseResponse<User>>(`/users/${id}`, user);
        return response.data;
    },

    deleteUser: async (id: string): Promise<void> => {
        await axiosClient.delete(`/users/${id}`);
    }
};

export default userService;
