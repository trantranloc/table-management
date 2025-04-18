package com.spring_table_management.controller;

import com.spring_table_management.dto.response.ApiStatus;
import com.spring_table_management.dto.response.ResponseUtil;
import com.spring_table_management.model.UserEntity;
import com.spring_table_management.repository.UserRepository;
import com.spring_table_management.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping()
    public ResponseEntity<?> getAllUsers() {
        return ResponseUtil.response(ApiStatus.SUCCESS,userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<UserEntity> userOpt = userService.getUserById(id);

        if (userOpt.isEmpty()) {
            return ResponseUtil.response(ApiStatus.USER_NOT_FOUND);
        }

        return ResponseUtil.response(ApiStatus.SUCCESS, userOpt);
    }

    @PostMapping()
    public ResponseEntity<?> createUser(@RequestBody UserEntity user) {
        try {
            UserEntity createdUser = userService.createUser(user);
            return ResponseUtil.response(ApiStatus.CREATED, createdUser);
        } catch (Exception e) {
            return ResponseUtil.response(ApiStatus.ERROR, e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody UserEntity user) {
        Optional<UserEntity> existsUser = userRepository.findById(id);
        if (existsUser.isEmpty()) {
            return ResponseUtil.response(ApiStatus.USER_NOT_FOUND);
        }
        UserEntity updatedUser = userService.updateUser(id, user);
        return ResponseUtil.response(ApiStatus.UPDATE, updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            Optional<UserEntity> user = userRepository.findById(id);
            if (user.isPresent()) {
                userService.deleteUser(id);
                return ResponseUtil.response(ApiStatus.SUCCESS, "User successfully deleted");
            } else {
                return ResponseUtil.response(ApiStatus.USER_NOT_FOUND, "User not found with id: " + id);
            }
        } catch (Exception e) {
            return ResponseUtil.response(ApiStatus.ERROR, e.getMessage());
        }
    }

}
