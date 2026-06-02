package com.luxestay.serviceImpl;

import com.luxestay.dto.employee.EmployeeRequest;
import com.luxestay.entity.Employee;
import com.luxestay.exception.ResourceNotFoundException;
import com.luxestay.repository.EmployeeRepository;
import com.luxestay.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getById(Long id) {
        return employeeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
    }

    @Override
    public Employee create(EmployeeRequest request) {
        Employee emp = toEntity(new Employee(), request);
        return employeeRepository.save(emp);
    }

    @Override
    public Employee update(Long id, EmployeeRequest request) {
        Employee emp = getById(id);
        toEntity(emp, request);
        return employeeRepository.save(emp);
    }

    @Override
    public void delete(Long id) {
        Employee emp = getById(id);
        emp.setActive(false);
        employeeRepository.save(emp);
    }

    @Override
    public List<Employee> getActive() {
        return employeeRepository.findByActiveTrue();
    }

    private Employee toEntity(Employee emp, EmployeeRequest req) {
        emp.setFirstName(req.getFirstName());
        emp.setLastName(req.getLastName());
        emp.setEmail(req.getEmail());
        emp.setPhone(req.getPhone());
        emp.setPosition(req.getPosition());
        emp.setDepartment(req.getDepartment());
        emp.setSalary(req.getSalary());
        emp.setHireDate(req.getHireDate());
        emp.setActive(req.getActive() != null ? req.getActive() : true);
        return emp;
    }
}
