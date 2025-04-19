package com.spring_table_management.dto.response;

public class ApiResponse<T> {
    private int status;
    private boolean success;
    private String message;
    private T result;

    // constructors, getters, setters
    public ApiResponse() {

    }
    public ApiResponse(int status, boolean success, String message, T result) {
        this.status = status;
        this.success = success;
        this.message = message;
        this.result = result;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getResult() {
        return result;
    }

    public void setResult(T result) {
        this.result = result;
    }
}
