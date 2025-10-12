package com.shopcafe.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // ✅ Khoá bí mật (ít nhất 32 ký tự để dùng thuật toán HS256)
    private static final String SECRET_KEY = "supersecretkey123456789supersecretkey123456789";

    // ✅ Tạo key ký JWT
    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ✅ Tạo token từ email
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24h
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Giải mã email từ token
    public String extractEmail(String token) {
        try {
            return extractAllClaims(token).getSubject();
        } catch (JwtException e) {
            return null;
        }
    }

    // ✅ Kiểm tra token hợp lệ (đúng email và chưa hết hạn)
    public boolean isValid(String token, String email) {
        String extractedEmail = extractEmail(token);
        return extractedEmail != null && extractedEmail.equals(email) && !isExpired(token);
    }

    // ✅ Kiểm tra token hết hạn chưa
    private boolean isExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // ✅ Giải mã toàn bộ claims trong token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
