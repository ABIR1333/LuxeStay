package com.luxestay.dto.employee;

import com.luxestay.entity.Employee;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    private String email;
    private String phone;
    @NotNull  private Employee.Position position;
    private String department;
    @DecimalMin("0.00") private BigDecimal salary;
    @NotNull  private LocalDate hireDate;
    private Boolean active = true;
}
