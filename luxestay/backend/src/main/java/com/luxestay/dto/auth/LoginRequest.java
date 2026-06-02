// ============================================================
// FILE: LoginRequest.java
// PATH: src/main/java/com/luxestay/dto/auth/LoginRequest.java
// ============================================================
package com.luxestay.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @Email @NotBlank
    private String email;
    @NotBlank
    private String password;
}
