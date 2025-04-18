package com.spring_table_management.util;

import com.spring_table_management.model.RoleEntity;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secret;

    // Phương thức tạo JWT token
    public String generateToken(String username, List<RoleEntity.RoleName> roles, String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        claims.put("userId", userId);  // Thêm thông tin id
        claims.put("username", username);  // Thêm thông tin username

        // Tạo token với các claim như username và roles
        return Jwts.builder()
                .setSubject(username)
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SignatureAlgorithm.HS512, secret.getBytes())
                .compact();
    }
}
