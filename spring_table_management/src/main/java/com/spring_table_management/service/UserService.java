package com.spring_table_management.service;

import com.spring_table_management.dto.response.ApiStatus;
import com.spring_table_management.model.RoleEntity;
import com.spring_table_management.model.UserEntity;
import com.spring_table_management.repository.RoleRepository;
import com.spring_table_management.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserEntity> getUserById(String id) {
        return userRepository.findById(id);
    }

    @Transactional
    public UserEntity createUser(UserEntity user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException(ApiStatus.USER_ALREADY_EXISTS.getMessage());
        }
        RoleEntity userRole = roleRepository.findByName(RoleEntity.RoleName.ROLE_USER)
                .orElseGet(() -> {
                    RoleEntity newRole = new RoleEntity();
                    newRole.setName(RoleEntity.RoleName.ROLE_USER);
                    return roleRepository.save(newRole);
                });
        user.setRoles(Collections.singletonList(userRole));
        return userRepository.save(user);
    }

    @Transactional
    public UserEntity updateUser(String id, UserEntity user) {
        UserEntity userEntity = userRepository.findById(id).orElse(null);
        if (userEntity == null) {
            throw new RuntimeException(ApiStatus.USER_NOT_FOUND.getMessage());
        }
        if (user.getUsername() != null) {
            userEntity.setUsername(user.getUsername());
        }
        if (user.getFullName() != null) {
            userEntity.setFullName(user.getFullName());
        }
        if (user.getEmail() != null) {
            userEntity.setEmail(user.getEmail());
        }
        if (user.getPassword() != null) {
            userEntity.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            userEntity.setRoles(user.getRoles());
        }
        if (user.getStatus() != null) {
            userEntity.setStatus(user.getStatus());
        }
        userRepository.save(userEntity);

        return userEntity;
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

}
