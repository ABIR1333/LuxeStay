package com.luxestay.serviceImpl;

import com.luxestay.dto.auth.*;
import com.luxestay.entity.Role;
import com.luxestay.entity.User;
import com.luxestay.exception.BadRequestException;
import com.luxestay.repository.RoleRepository;
import com.luxestay.repository.UserRepository;
import com.luxestay.security.JwtUtils;
import com.luxestay.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired private AuthenticationManager authManager;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtils jwtUtils;

    @Override
    public JwtResponse login(LoginRequest request) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        String jwt = jwtUtils.generateJwtToken(auth);

        org.springframework.security.core.userdetails.User userDetails =
            (org.springframework.security.core.userdetails.User) auth.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new BadRequestException("User not found"));

        return new JwtResponse(jwt, user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), roles);
    }

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use: " + request.getEmail());
        }

        User user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .password(encoder.encode(request.getPassword()))
            .phone(request.getPhone())
            .active(true)
            .build();

        Set<String> strRoles = request.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role receptionistRole = roleRepository.findByName("ROLE_RECEPTIONIST")
                .orElseThrow(() -> new BadRequestException("Role not found"));
            roles.add(receptionistRole);
        } else {
            strRoles.forEach(role -> {
                Role r = roleRepository.findByName("ROLE_" + role.toUpperCase())
                    .orElseThrow(() -> new BadRequestException("Role not found: " + role));
                roles.add(r);
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
    }
}
