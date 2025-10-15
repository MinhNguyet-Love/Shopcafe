package com.shopcafe.backend.controller;

import com.shopcafe.backend.model.Order;
import com.shopcafe.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    // 🟢 Lấy tất cả đơn hàng
    @GetMapping
    public ResponseEntity<List<Order>> all() {
        return ResponseEntity.ok(service.all());
    }

    // 🟢 Lấy đơn hàng theo user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(service.findByUser(userId));
    }

    // 🟢 Lấy đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable String id) {
        Optional<Order> order = service.findById(id);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 🟢 Tạo đơn hàng mới
    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Order o) {
        return ResponseEntity.ok(service.create(o));
    }

    // 🟢 Cập nhật trạng thái đơn
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id, @RequestParam String status) {
        Optional<Order> order = service.updateStatus(id, status);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 🟢 ✅ Cập nhật toàn bộ đơn hàng (items, totalPrice, status)
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable String id, @RequestBody Order updatedOrder) {
        Optional<Order> existing = service.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order o = existing.get();
        o.setItems(updatedOrder.getItems());
        o.setTotalPrice(updatedOrder.getTotalPrice());
        o.setStatus(updatedOrder.getStatus());
        return ResponseEntity.ok(service.save(o));
    }

    // 🗑️ Xóa đơn hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.delete(id)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
