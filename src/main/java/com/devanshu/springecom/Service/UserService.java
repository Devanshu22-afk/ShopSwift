package com.devanshu.springecom.Service;

import com.devanshu.springecom.Model.User;
import com.devanshu.springecom.dao.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String username, String password, String email) {
        if (userRepo.findByUsername(username) != null) {
            throw new RuntimeException("Username already exists: " + username);
        }
        
        if (userRepo.findByEmail(email) != null) {
            throw new RuntimeException("Email already exists: " + email);
        }
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole("USER");
        
        return userRepo.save(user);
    }

    public boolean usernameExists(String username) {
        return userRepo.findByUsername(username) != null;
    }

    public User findByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    public User saveUser(User user) {
        return userRepo.save(user);
    }
}

