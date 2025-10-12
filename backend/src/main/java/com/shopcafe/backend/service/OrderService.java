package com.shopcafe.backend.service;

import com.shopcafe.backend.model.Order;
import com.shopcafe.backend.model.OrderItem;
import com.shopcafe.backend.repo.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    // ✅ Lấy tất cả đơn hàng
    public List<Order> all() {
        return repo.findAll();
    }

    // ✅ Tìm đơn hàng theo ID
    public Optional<Order> findById(String id) {
        return repo.findById(id);
    }

    // ✅ Tạo đơn hàng mới
    public Order create(Order o, String userId) {
        if (o.getTableId() == null) {
            throw new RuntimeException("Thiếu thông tin bàn!");
        }

        // Nếu chưa có ngày, thêm ngày hiện tại
        if (o.getStatus() == null) {
            o.setStatus("PENDING");
        }

        // Tính tổng tiền
        double total = 0.0;
        if (o.getItems() != null) {
            for (OrderItem it : o.getItems()) {
                total += it.getUnitPrice() * it.getQuantity();

            }
        }
        o.setTotalPrice(total);

        return repo.save(o);
    }

    // ✅ Cập nhật đơn hàng
    public Optional<Order> update(String id, Order updated) {
        return repo.findById(id).map(existing -> {
            existing.setItems(updated.getItems());
            existing.setStatus(updated.getStatus());
            existing.setTotalPrice(updated.getTotalPrice());
            return repo.save(existing);
        });
    }

    // ✅ Xóa đơn hàng
    public boolean delete(String id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
