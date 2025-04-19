package com.spring_table_management.service;

import com.spring_table_management.dto.response.ApiStatus;
import com.spring_table_management.dto.response.ResponseUtil;
import com.spring_table_management.model.BookingEntity;
import com.spring_table_management.model.TableEntity;
import com.spring_table_management.model.UserEntity;
import com.spring_table_management.repository.BookingRepository;
import com.spring_table_management.repository.TableRepository;
import com.spring_table_management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Bookingservice {
    private final BookingRepository bookingRepository;
    private final TableRepository tableRepository;
    private final UserRepository userRepository;

    public Bookingservice(BookingRepository bookingRepository, TableRepository tableRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
    }

    public List<BookingEntity> getAllBookings() {
        return bookingRepository.findAll();
    }
    public Optional<BookingEntity> getBookingById(String id) {
        return bookingRepository.findById(id);
    }
    public BookingEntity createBooking(BookingEntity bookingEntity) {
        return bookingRepository.save(bookingEntity);
    }
    public ResponseEntity<?> updateBooking(String id, BookingEntity booking) {
        try {
            BookingEntity existing = bookingRepository.findById(id).orElse(null);
            if (existing == null) {
                return ResponseUtil.response(ApiStatus.NOT_FOUND);
            }

            // Bàn mới (nếu có)
            if (booking.getTable() != null && booking.getTable().getId() != null) {
                TableEntity newTable = tableRepository.findById(booking.getTable().getId()).orElse(null);
                if (newTable == null) return ResponseUtil.response(ApiStatus.NOT_FOUND, "Table not found");

                if (newTable.getStatus() != TableEntity.Status.AVAILABLE)
                    return ResponseUtil.response(ApiStatus.TABLE_UNAVAILABLE);

                if (!existing.getTable().getId().equals(newTable.getId())) {
                    // Giải phóng bàn cũ
                    TableEntity oldTable = existing.getTable();
                    oldTable.setStatus(TableEntity.Status.AVAILABLE);
                    tableRepository.save(oldTable);

                    // Đặt bàn mới
                    newTable.setStatus(TableEntity.Status.UNAVAILABLE);
                    tableRepository.save(newTable);

                    existing.setTable(newTable);
                }
            }

            // Xử lý user mới
            if (booking.getHandledBy() != null && booking.getHandledBy().getId() != null) {
                UserEntity user = userRepository.findById(booking.getHandledBy().getId()).orElse(null);
                if (user == null) {
                    return ResponseUtil.response(ApiStatus.NOT_FOUND, "User not found");
                }
                existing.setHandledBy(user);
            }

            // Cập nhật dữ liệu
            existing.setBookingTime(booking.getBookingTime());
            existing.setCustomerName(booking.getCustomerName());
            existing.setPhone(booking.getPhone());
            existing.setNote(booking.getNote());
            existing.setNumberOfPeople(booking.getNumberOfPeople());
            existing.setStatus(booking.getStatus());

            bookingRepository.save(existing);
            return ResponseUtil.response(ApiStatus.SUCCESS, existing);

        } catch (Exception e) {
            return ResponseUtil.response(ApiStatus.ERROR, e.getMessage());
        }
    }
    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }
}
