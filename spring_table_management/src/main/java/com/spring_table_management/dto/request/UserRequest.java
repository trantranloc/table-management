package com.spring_table_management.dto.request;

import com.spring_table_management.model.RoleEntity;
import com.spring_table_management.model.UserEntity;
import jakarta.persistence.*;

import java.util.List;

public class UserRequest {
    private String username;
    private String password;
    private String fullName;
}
