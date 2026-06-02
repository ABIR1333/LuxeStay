package com.luxestay.service;

import com.luxestay.dto.employee.EmployeeRequest;
import com.luxestay.entity.Employee;
import java.util.List;

public interface EmployeeService {
    List<Employee> getAll();
    Employee getById(Long id);
    Employee create(EmployeeRequest request);
    Employee update(Long id, EmployeeRequest request);
    void delete(Long id);
    List<Employee> getActive();
}
