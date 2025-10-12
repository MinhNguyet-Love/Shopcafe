package com.shopcafe.backend.controller;

import com.shopcafe.backend.model.Table;
import com.shopcafe.backend.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableService service;

    public TableController(TableService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Table>> getAll() {
        return ResponseEntity.ok(service.all());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Table> getById(@PathVariable String id) {
        Optional<Table> table = service.findById(id);
        return table.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Table> create(@RequestBody Table t) {
        return ResponseEntity.ok(service.create(t));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Table> update(@PathVariable String id, @RequestBody Table updated) {
        Optional<Table> table = service.update(id, updated);
        return table.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.delete(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
