import { Table, TableRequest } from '../type/table.type';
import { BaseResponse } from '../type/base.type';
import axiosClient from '../api/axiosClient';

const API_URL = '/tables';

const tableService = {
    fetchAllTables: async (): Promise<BaseResponse<Table[]>> => {
        const response = await axiosClient.get<BaseResponse<Table[]>>(API_URL);
        return response.data;
    },

    fetchTableById: async (id: string): Promise<BaseResponse<Table>> => {
        const response = await axiosClient.get<BaseResponse<Table>>(`${API_URL}/${id}`);
        return response.data;
    },

    createTable: async (tableData: TableRequest): Promise<BaseResponse<Table>> => {
        const response = await axiosClient.post<BaseResponse<Table>>(API_URL, tableData);
        return response.data;
    },

    updateTable: async (id: string, tableData: Partial<TableRequest>): Promise<BaseResponse<Table>> => {
        const response = await axiosClient.put<BaseResponse<Table>>(`${API_URL}/${id}`, tableData);
        return response.data;
    },

    deleteTable: async (id: string): Promise<BaseResponse<void>> => {
        const response = await axiosClient.delete<BaseResponse<void>>(`${API_URL}/${id}`);
        return response.data;
    }
};

export default tableService;