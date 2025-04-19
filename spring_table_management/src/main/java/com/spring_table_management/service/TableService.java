package com.spring_table_management.service;

import com.spring_table_management.dto.response.ApiStatus;
import com.spring_table_management.model.TableEntity;
import com.spring_table_management.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TableService {

    private final TableRepository tableRepository;

    public TableService(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    public List<TableEntity> getAllTables() {
        return tableRepository.findAll();
    }
    public Optional<TableEntity> getTableById(String id) {
        return  tableRepository.findById(id);
    }
    public TableEntity createTable(TableEntity tableEntity) {
        return tableRepository.save(tableEntity);
    }
    public TableEntity updateTable(String id, TableEntity updatedTable) {
        TableEntity tableEntity = tableRepository.findById(id).orElse(null);

        if (tableEntity == null) {
            throw new RuntimeException(ApiStatus.NOT_FOUND.getMessage());
        }
        // Update các field nếu không null
        if (updatedTable.getTableNumber() != null) {
            tableEntity.setTableNumber(updatedTable.getTableNumber());
        }
        if (updatedTable.getCapacity() != null) {
            tableEntity.setCapacity(updatedTable.getCapacity());
        }
        if (updatedTable.getFloor() != null) {
            tableEntity.setFloor(updatedTable.getFloor());
        }
        if (updatedTable.getStatus() != null) {
            tableEntity.setStatus(updatedTable.getStatus());
        }
        return tableRepository.save(tableEntity);
    }

    public void deleteTable(String id) {
        tableRepository.deleteById(id);
    }
}
