package com.spring_table_management.controller;

import com.spring_table_management.dto.response.ApiStatus;
import com.spring_table_management.dto.response.ResponseUtil;
import com.spring_table_management.model.TableEntity;
import com.spring_table_management.repository.TableRepository;
import com.spring_table_management.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.util.Optional;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "http://localhost:3000")
public class TableController {

    private final TableService tableService;
    private final TableRepository tableRepository;

    public TableController(TableService tableService, TableRepository tableRepository) {
        this.tableService = tableService;
        this.tableRepository = tableRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllTables() {
        return ResponseUtil.response(ApiStatus.SUCCESS, tableService.getAllTables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTableById(@PathVariable String id) {
        Optional<TableEntity> table = tableService.getTableById(id);

        if (table.isEmpty()) {
            return ResponseUtil.response(ApiStatus.NOT_FOUND);
        }

        return ResponseUtil.response(ApiStatus.SUCCESS, table);
    }

    @PostMapping
    public ResponseEntity<?> createTable(@RequestBody TableEntity table) {
        try {
            TableEntity tableEntity = tableService.createTable(table);
            return ResponseUtil.response(ApiStatus.SUCCESS, tableEntity);
        } catch (Error e) {
            return ResponseUtil.response(ApiStatus.ERROR, e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTable(@PathVariable String id, @RequestBody TableEntity table) {
        Optional<TableEntity> existingTable = tableService.getTableById(id);
        if (existingTable.isEmpty()) {
            return ResponseUtil.response(ApiStatus.NOT_FOUND, id);
        }
        TableEntity updateTable = tableService.updateTable(id, table);
        return ResponseUtil.response(ApiStatus.UPDATE, updateTable);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTable(@PathVariable String id) {
           return tableService.deleteTable(id);
    }
     @PatchMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return tableService.updateStatus(id, body.get("status"));
    }
}
