package com.spring_table_management.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(name = "number_of_people", nullable = false)
    private Integer numberOfPeople;

    @Column(name = "booking_time", nullable = false)
    private LocalDateTime bookingTime;

    @Lob
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private TableEntity table;

    @ManyToOne
    @JoinColumn(name = "handled_by")
    private UserEntity handledBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, CONFIRMED, CANCELLED, COMPLETED
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UserEntity getHandledBy() {
        return handledBy;
    }

    public void setHandledBy(UserEntity handledBy) {
        this.handledBy = handledBy;
    }

    public TableEntity getTable() {
        return table;
    }

    public void setTable(TableEntity table) {
        this.table = table;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public Integer getNumberOfPeople() {
        return numberOfPeople;
    }

    public void setNumberOfPeople(Integer numberOfPeople) {
        this.numberOfPeople = numberOfPeople;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
}
