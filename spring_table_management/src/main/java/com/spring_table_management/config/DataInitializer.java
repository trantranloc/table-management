package com.spring_table_management.config;

import com.spring_table_management.model.RoleEntity;
import com.spring_table_management.model.UserEntity;
import com.spring_table_management.repository.RoleRepository;
import com.spring_table_management.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Tạo role ADMIN nếu chưa tồn tại
        RoleEntity adminRole = roleRepository.findByName(RoleEntity.RoleName.ROLE_ADMIN)
                .orElseGet(() -> {
                    RoleEntity role = new RoleEntity();
                    role.setName(RoleEntity.RoleName.ROLE_ADMIN);
                    return roleRepository.save(role);
                });

        // Tạo user admin nếu chưa có
        userRepository.findByUsername("admin").orElseGet(() -> {
            UserEntity admin = new UserEntity();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Administrator");
            admin.setEmail("admin@gmail.com");
            admin.setRoles(Collections.singletonList(adminRole));
            admin.setStatus(UserEntity.Status.ACTIVE);
            return userRepository.save(admin);
        });
    }
}
