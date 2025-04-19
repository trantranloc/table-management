export interface BaseResponse<T> {
    status: number;
    success: boolean;
    message: string;
    result: T;
}
