package com.shopcafe.backend.service;

import com.shopcafe.backend.model.Table;
import com.shopcafe.backend.repo.TableRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TableService {

    private final TableRepository repo;

    public TableService(TableRepository repo) {
        this.repo = repo;
    }

    public List<Table> all() {
        return repo.findAll();
    }

    public Optional<Table> findById(String id) {
        return repo.findById(id);
    }

    public Table create(Table t) {
        return repo.save(t);
    }

    public Optional<Table> update(String id, Table updated) {
        return repo.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setStatus(updated.getStatus());
            existing.setCapacity(updated.getCapacity());
            return repo.save(existing);
        });
    }

    public boolean delete(String id) {
        if (!repo.existsById(id)) return false;
        repo.deleteById(id);
        return true;
    }
}
