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

    // ✅ GET all orders
    @GetMapping
    public ResponseEntity<List<Order>> all() {
        return ResponseEntity.ok(service.all());
    }

    // ✅ GET order by id
    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable String id) {
        Optional<Order> order = service.findById(id);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ POST create order
    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Order o) {
        return ResponseEntity.ok(service.create(o, "admin"));
    }

    // ✅ PUT update order
    @PutMapping("/{id}")
    public ResponseEntity<Order> update(@PathVariable String id, @RequestBody Order updated) {
        Optional<Order> order = service.update(id, updated);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ DELETE order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.delete(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
