package com.shopcafe.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ✅ Tính toán đường dẫn tuyệt đối đến thư mục backend/uploads
        Path uploadDir = Paths.get("backend/uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        // ✅ Cho phép truy cập qua URL: http://localhost:8080/uploads/abc.jpg
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
