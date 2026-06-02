package com.luxestay.dto.auth;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.Set;

@Data
public class RegisterRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @Email @NotBlank private String email;
    @NotBlank @Size(min = 6) private String password;
    private String phone;
    private Set<String> roles;
}
