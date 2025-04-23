package com.spring_table_management.service;

import com.spring_table_management.dto.response.ApiStatus;
import com.spring_table_management.dto.response.ResponseUtil;
import com.spring_table_management.model.TableEntity;
import com.spring_table_management.repository.TableRepository;
import org.springframework.http.ResponseEntity;
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

    public ResponseEntity<?> deleteTable( String id) {
    try {
        Optional<TableEntity> table = tableRepository.findById(id);
        if (table.isPresent() && TableEntity.Status.AVAILABLE == table.get().getStatus()) {
            // Xóa bảng
            tableRepository.deleteById(id);
            return ResponseUtil.response(ApiStatus.SUCCESS, "Table successfully deleted");
        } else {
            return ResponseUtil.response(ApiStatus.NOT_FOUND, "Table not found or not available for deletion");
        }
    } catch (Exception e) {
        return ResponseUtil.response(ApiStatus.ERROR, e.getMessage());
    }
}
public ResponseEntity<?> updateStatus(String tableId, String newStatus) {
        TableEntity table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setStatus(TableEntity.Status.valueOf(newStatus));
        return ResponseUtil.response(ApiStatus.SUCCESS, tableRepository.save(table));
    }

}
