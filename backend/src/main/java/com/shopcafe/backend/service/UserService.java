package com.shopcafe.backend.service;

import com.shopcafe.backend.dto.AuthResponse;
import com.shopcafe.backend.dto.LoginRequest;
import com.shopcafe.backend.dto.RegisterRequest;
import com.shopcafe.backend.model.User;
import com.shopcafe.backend.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository repo, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // ✅ Lấy tất cả user
    public List<User> all() {
        return repo.findAll();
    }

    // ✅ Lấy user theo ID
    public Optional<User> findById(String id) {
        return repo.findById(id);
    }

    // ✅ Đăng ký
    public AuthResponse register(RegisterRequest req) {
        if (repo.findByEmailIgnoreCase(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        User u = new User();
        u.setUsername(req.getUsername());
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setRole(req.getRole() != null ? req.getRole() : "USER");

        repo.save(u);

        String token = jwtService.generateToken(u.getEmail());
        return new AuthResponse(token, u.getUsername(), u.getRole());
    }

    // ✅ Đăng nhập
    public AuthResponse login(LoginRequest req) {
        Optional<User> userOpt = repo.findByEmailIgnoreCase(req.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Sai email hoặc mật khẩu!");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai email hoặc mật khẩu!");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }
}
