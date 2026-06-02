package com.luxestay.service;

import com.luxestay.dto.auth.*;

public interface AuthService {
    JwtResponse login(LoginRequest request);
    void register(RegisterRequest request);
}
