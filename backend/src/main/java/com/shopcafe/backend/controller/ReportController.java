package com.shopcafe.backend.controller;

import com.shopcafe.backend.model.Order;
import com.shopcafe.backend.repo.OrderRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    private final OrderRepository orderRepo;

    public ReportController(OrderRepository orderRepo) { this.orderRepo = orderRepo; }

    @GetMapping("/daily")
    public ResponseEntity<List<Order>> daily(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(orderRepo.findByBusinessDate(date));
    }
}
