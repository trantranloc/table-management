package com.spring_table_management.controller;

import com.spring_table_management.dto.response.ApiStatus;
import com.spring_table_management.dto.response.ResponseUtil;
import com.spring_table_management.model.BookingEntity;
import com.spring_table_management.model.TableEntity;
import com.spring_table_management.model.UserEntity;
import com.spring_table_management.repository.BookingRepository;
import com.spring_table_management.repository.TableRepository;
import com.spring_table_management.repository.UserRepository;
import com.spring_table_management.service.Bookingservice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    private final Bookingservice bookingservice;
    private final BookingRepository bookingRepository;
    private final TableRepository tableRepository;
    private final UserRepository userRepository;

    public BookingController(Bookingservice bookingservice, BookingRepository bookingRepository, TableRepository tableRepository, UserRepository userRepository) {
        this.bookingservice = bookingservice;
        this.bookingRepository = bookingRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllBookings(){
        return ResponseUtil.response(ApiStatus.SUCCESS,bookingservice.getAllBookings());
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id){
        BookingEntity booking = bookingRepository.findById(id).orElse(null);
        if(booking == null){
            return ResponseUtil.response(ApiStatus.NOT_FOUND,null);
        }
        return ResponseUtil.response(ApiStatus.SUCCESS,booking);
    }
    @PostMapping
    public ResponseEntity<?> addBooking(@RequestBody BookingEntity booking) {
        try {
            // Kiểm tra ID bàn hợp lệ
            if (booking.getTable() == null || booking.getTable().getId() == null) {
                return ResponseUtil.response(ApiStatus.BAD_REQUEST, "table id is required");
            }

            // Tìm bàn theo ID
            TableEntity table = tableRepository.findById(booking.getTable().getId()).orElse(null);

            // Kiểm tra nếu bàn không tồn tại
            if (table == null) {
                return ResponseUtil.response(ApiStatus.NOT_FOUND);
            }

            // Kiểm tra nếu bàn không có sẵn
            if (table.getStatus() == null || table.getStatus() != TableEntity.Status.AVAILABLE) {
                return ResponseUtil.response(ApiStatus.TABLE_UNAVAILABLE);
            }

            // Cập nhật trạng thái bàn
            table.setStatus(TableEntity.Status.UNAVAILABLE);
            tableRepository.save(table);
            // Kiểm tra user xử lý (handledBy) có hợp lệ không
            if (booking.getHandledBy() == null || booking.getHandledBy().getId() == null) {
                return ResponseUtil.response(ApiStatus.BAD_REQUEST, "handledBy user id is required");
            }

            // Tìm user theo ID
            UserEntity user = userRepository.findById(booking.getHandledBy().getId()).orElse(null);

            // Kiểm tra nếu user không tồn tại
            if (user == null) {
                return ResponseUtil.response(ApiStatus.NOT_FOUND, "User not found");
            }
            // Tạo booking
            BookingEntity bookingEntity = bookingservice.createBooking(booking);

            return ResponseUtil.response(ApiStatus.SUCCESS, bookingEntity);

        } catch (Exception e) {
            return ResponseUtil.response(ApiStatus.ERROR, e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable String id, @RequestBody BookingEntity booking) {
        return bookingservice.updateBooking(id, booking);
    }
}
