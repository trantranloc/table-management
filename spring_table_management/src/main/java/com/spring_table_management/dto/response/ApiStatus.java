package com.spring_table_management.dto.response;

public enum ApiStatus {

    // === Success ===
    SUCCESS(200, true, "Success"),
    CREATED(201, true, "Created successfully"),
    UPDATE(202, true, "Update successfully"),
    ERROR(202, true, "Error"),
    // === General Errors ===
    BAD_REQUEST(400, false, "Invalid request"),
    UNAUTHORIZED(401, false, "Unauthorized access"),
    FORBIDDEN(403, false, "Forbidden"),
    NOT_FOUND(404, false, "Not found"),
    INTERNAL_ERROR(500, false, "System error"),

    // === Specific Errors ===
    INVALID_PASSWORD(401, false, "Incorrect password"),
    USER_NOT_FOUND(404, false, "User not found"),
    USER_ALREADY_EXISTS(409, false, "User already exists"),
    PRODUCT_NOT_FOUND(404, false, "Product not found"),
    ORDER_NOT_FOUND(404, false, "Order not found"),
    VALIDATION_FAILED(400, false, "Invalid data");

    private final int statusCode;
    private final boolean success;
    private final String message;

    ApiStatus(int statusCode, boolean success, String message) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}