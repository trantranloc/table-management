package com.spring_table_management.controller;

import com.spring_table_management.dto.request.UpdateTableRequest;
import com.spring_table_management.dto.response.ApiStatus;
import com.spring_table_management.dto.response.ResponseUtil;
import com.spring_table_management.model.*;
import com.spring_table_management.repository.*;
import com.spring_table_management.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final TableRepository tableRepository;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingservice, BookingRepository bookingRepository,
            TableRepository tableRepository, UserRepository userRepository) {
        this.bookingService = bookingservice;
        this.bookingRepository = bookingRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        return ResponseUtil.response(ApiStatus.SUCCESS, bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        BookingEntity booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) {
            return ResponseUtil.response(ApiStatus.NOT_FOUND, null);
        }
        return ResponseUtil.response(ApiStatus.SUCCESS, booking);
    }

    @PostMapping
    public ResponseEntity<?> addBooking(@RequestBody BookingEntity booking) {
        try {
            // Xử lý bàn (có thể null)
            if (booking.getTable() != null && booking.getTable().getId() != null) {
                TableEntity table = tableRepository.findById(booking.getTable().getId()).orElse(null);

                if (table == null) {
                    return ResponseUtil.response(ApiStatus.NOT_FOUND, "Table not found");
                }

                if (table.getStatus() == null || table.getStatus() != TableEntity.Status.AVAILABLE) {
                    return ResponseUtil.response(ApiStatus.TABLE_UNAVAILABLE);
                }

                table.setStatus(TableEntity.Status.UNAVAILABLE);
                tableRepository.save(table);
            }

            // Xử lý handledBy (nếu không null)
            if (booking.getHandledBy() != null) {
                if (booking.getHandledBy().getId() == null) {
                    return ResponseUtil.response(ApiStatus.BAD_REQUEST, "HandledBy ID is null");
                }

                UserEntity user = userRepository.findById(booking.getHandledBy().getId()).orElse(null);
                if (user == null) {
                    return ResponseUtil.response(ApiStatus.NOT_FOUND, "User not found");
                }

                booking.setHandledBy(user); // gán user thật vào
            }

            // Tạo booking
            BookingEntity bookingEntity = bookingService.createBooking(booking);
            return ResponseUtil.response(ApiStatus.SUCCESS, bookingEntity);

        } catch (Exception e) {
            return ResponseUtil.response(ApiStatus.ERROR, e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable String id, @RequestBody BookingEntity booking) {
        return bookingService.updateBooking(id, booking);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return bookingService.updateStatus(id, body.get("status"));
    }

    @PatchMapping("/{bookingId}/table")
    public ResponseEntity<?> updateBookingTable(@PathVariable String bookingId,
            @RequestBody UpdateTableRequest request) {
        return bookingService.updateTable(bookingId, request.getTableId());
    }

}
