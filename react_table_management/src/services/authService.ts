// services/authService.js
import axiosClient from "../api/axiosClient";
import { AuthToken } from "../type/auth.type";
import { BaseResponse } from "../type/base.type";
import { User } from "../type/user.type";

const authService = {
  login: async (data: any): Promise<BaseResponse<AuthToken>> => {
    const response = await axiosClient.post<BaseResponse<AuthToken>>("auth/login", data);
    return response.data;
  },

  register: async (data: any): Promise<BaseResponse<User>> => {
    const response = await axiosClient.post<BaseResponse<User>>("auth/register", data);
    return response.data;
  },
};

export default authService;