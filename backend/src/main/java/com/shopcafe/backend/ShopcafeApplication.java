package com.shopcafe.backend;

import com.shopcafe.backend.model.Role;
import com.shopcafe.backend.model.User;
import com.shopcafe.backend.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ShopcafeApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShopcafeApplication.class, args);
	}

	// ✅ Khởi tạo tài khoản admin mặc định khi app chạy
	@Bean
	CommandLineRunner initAdmin(UserRepository repo, PasswordEncoder encoder) {
		return args -> {
			if (repo.count() == 0) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setEmail("admin@gmail.com");
				admin.setPassword(encoder.encode("123456"));
				admin.setRole("ADMIN"); // ✅ enum chứ không phải String
				repo.save(admin);
				System.out.println("✅ Created default ADMIN account: admin@gmail.com / 123456");
			}
		};
	}
}
