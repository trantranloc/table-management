package com.spring_table_management.repository;

import com.spring_table_management.model.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, String> {
    public Optional<RoleEntity> findByName(RoleEntity.RoleName roleName);
}
