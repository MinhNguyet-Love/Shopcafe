
package com.shopcafe.backend.controller;

import com.shopcafe.backend.model.Product;
import com.shopcafe.backend.repo.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {


    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    // ✅ Lấy tất cả sản phẩm
    @GetMapping
    public List<Product> all() {
        return repo.findAll();
    }

    // ✅ Lấy sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> get(@PathVariable String id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Thêm sản phẩm (chỉ cần link ảnh, hoặc không có cũng được)
    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        if (product.getImageUrl() == null || product.getImageUrl().isBlank()) {
            product.setImageUrl("https://via.placeholder.com/150"); // ảnh mặc định
        }
        return ResponseEntity.ok(repo.save(product));
    }

    // ✅ Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable String id, @RequestBody Product updated) {
        Optional<Product> opt = repo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Product existing = opt.get();
        existing.setName(updated.getName());
        existing.setPrice(updated.getPrice());
        existing.setCategory(updated.getCategory());
        existing.setDescription(updated.getDescription());

        if (updated.getImageUrl() != null && !updated.getImageUrl().isBlank()) {
            existing.setImageUrl(updated.getImageUrl());
        }

        return ResponseEntity.ok(repo.save(existing));
    }

    // ✅ Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
