package com.devanshu.springecom.Controller;

import com.devanshu.springecom.Model.User;
import com.devanshu.springecom.Model.dto.LoginRequest;
import com.devanshu.springecom.Model.dto.LoginResponse;
import com.devanshu.springecom.Model.dto.RegisterRequest;
import com.devanshu.springecom.Model.dto.RegisterResponse;
import com.devanshu.springecom.Service.UserService;
import com.devanshu.springecom.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (request.username() == null || request.username().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new RegisterResponse("Username cannot be empty", null));
            }
            
            if (request.password() == null || request.password().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new RegisterResponse("Password cannot be empty", null));
            }

            if (request.password().length() < 4) {
                return ResponseEntity.badRequest()
                    .body(new RegisterResponse("Password must be at least 4 characters long", null));
            }

            if (request.email() == null || request.email().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new RegisterResponse("Email cannot be empty", null));
            }

            if (userService.usernameExists(request.username())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new RegisterResponse("Username already exists", null));
            }

            userService.registerUser(request.username(), request.password(), request.email());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegisterResponse("User registered successfully", request.username()));
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RegisterResponse("Registration failed: " + e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            if (request.username() == null || request.username().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse("Username cannot be empty", false, null, null));
            }
            
            if (request.password() == null || request.password().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse("Password cannot be empty", false, null, null));
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.username(),
                    request.password()
                )
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
            User user = userService.findByUsername(request.username());
            String token = jwtUtil.generateTokenWithRole(userDetails, user != null ? user.getRole() : "USER");
            
            return ResponseEntity.ok(
                new LoginResponse("Login successful", true, request.username(), token)
            );
            
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse("Invalid username or password", false, null, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse("Login failed: " + e.getMessage(), false, null, null));
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest request) {
        try {
            if (request.username() == null || request.username().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse("Username cannot be empty", false, null, null));
            }
            
            if (request.password() == null || request.password().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse("Password cannot be empty", false, null, null));
            }

            // Hardcoded secure admin credentials
            String adminUsername = "ShopSwiftAdmin2024";
            String adminPassword = "SecureAdmin@2024!";

            if (!adminUsername.equals(request.username()) || !adminPassword.equals(request.password())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Invalid admin credentials", false, null, null));
            }

            User adminUser = userService.findByUsername(adminUsername);
            
            if (adminUser == null) {
                try {
                    adminUser = new User();
                    adminUser.setUsername(adminUsername);
                    adminUser.setPassword(passwordEncoder.encode(adminPassword));
                    adminUser.setEmail("admin@admin.com");
                    adminUser.setRole("ADMIN");
                    adminUser = userService.saveUser(adminUser);
                } catch (Exception e) {
                    adminUser = userService.findByUsername(adminUsername);
                    if (adminUser == null) {
                        throw new RuntimeException("Failed to create admin user: " + e.getMessage());
                    }
                }
            }

            if (!"ADMIN".equals(adminUser.getRole())) {
                adminUser.setRole("ADMIN");
                userService.saveUser(adminUser);
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(adminUsername);
            String token = jwtUtil.generateTokenWithRole(userDetails, "ADMIN");
            
            return ResponseEntity.ok(
                new LoginResponse("Admin login successful", true, request.username(), token)
            );
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse("Admin login failed: " + e.getMessage(), false, null, null));
        }
    }

    @GetMapping("/user/current")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Not authenticated");
            }

            String username = authentication.getName();
            User user = userService.findByUsername(username);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }

            return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
                put("username", user.getUsername());
                put("email", user.getEmail());
                put("role", user.getRole());
            }});
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching user: " + e.getMessage());
        }
    }
}

