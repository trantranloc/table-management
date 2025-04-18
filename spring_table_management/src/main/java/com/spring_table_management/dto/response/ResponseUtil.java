package com.spring_table_management.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseUtil {

    public static <T> ResponseEntity<ApiResponse<T>> response(ApiStatus status, T data) {
        return ResponseEntity.status(status.getStatusCode())
                .body(new ApiResponse<>(status.getStatusCode(), status.isSuccess(), status.getMessage(), data));
    }

    public static <T> ResponseEntity<ApiResponse<T>> response(ApiStatus status) {
        return response(status, null);
    }
    public static <T> ResponseEntity<ApiResponse<T>> response(HttpStatus status,T data) {
        return response(status, data);
    }
}