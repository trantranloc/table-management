package com.spring_table_management.controller;

import com.spring_table_management.dto.request.RegisterRequest;
import com.spring_table_management.dto.response.ApiStatus;
import com.spring_table_management.dto.request.LoginRequest;
import com.spring_table_management.dto.response.ResponseUtil;
import com.spring_table_management.model.RoleEntity;
import com.spring_table_management.model.UserEntity;
import com.spring_table_management.util.JwtTokenUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.spring_table_management.repository.*;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final RoleRepository roleRepository;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
        this.roleRepository = roleRepository;
    }

    // API đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Kiểm tra người dùng có tồn tại không
        Optional<UserEntity> user = userRepository.findByUsername(request.getUsername());

        // Kiểm tra nếu người dùng không tồn tại
        if (user.isEmpty()) {
            return ResponseUtil.response(ApiStatus.USER_NOT_FOUND, "User not found");
        }

        // Kiểm tra mật khẩu có khớp không
        if (!passwordEncoder.matches(request.getPassword(), user.get().getPassword())) {
            return ResponseUtil.response(ApiStatus.INVALID_PASSWORD, "Invalid password");
        }

        // Lấy danh sách vai trò của người dùng
        List<RoleEntity.RoleName> roles = user.get().getRoles()
                .stream()
                .map(RoleEntity::getName)
                .toList();

        // Tạo token
        String token = jwtTokenUtil.generateToken(user.get().getUsername(), roles,user.get().getId());

        // Trả về token dưới dạng thành công
        return ResponseUtil.response(ApiStatus.SUCCESS, Map.of("token", token));
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            if (registerRequest.getUsername() == null || registerRequest.getUsername().trim().isEmpty()
                    || registerRequest.getPassword() == null || registerRequest.getPassword().trim().isEmpty()
                    || registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
                return ResponseUtil.response(ApiStatus.BAD_REQUEST, "Username, password or email is empty");
            }
            Optional<UserEntity> existsUser = userRepository.findByUsername(registerRequest.getUsername());
            if (existsUser.isPresent()) {
                return ResponseUtil.response(ApiStatus.USER_ALREADY_EXISTS);
            }
            UserEntity newUser = new UserEntity();
            newUser.setUsername(registerRequest.getUsername());
            newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            newUser.setEmail(registerRequest.getEmail());
            newUser.setStatus(UserEntity.Status.ACTIVE);
            RoleEntity userRole = roleRepository.findByName(RoleEntity.RoleName.ROLE_USER)
                    .orElseGet(() -> {
                        RoleEntity newRole = new RoleEntity();
                        newRole.setName(RoleEntity.RoleName.ROLE_USER);
                        return roleRepository.save(newRole);
                    });

            newUser.setRoles(Collections.singletonList(userRole));
            // Lưu user
            userRepository.save(newUser);
            // Trả về response
            return ResponseUtil.response(ApiStatus.CREATED,newUser );

        } catch (Exception e) {
            return ResponseUtil.response(ApiStatus.ERROR, e.getMessage());
        }
    }

}
