package com.devanshu.springecom.Model.dto;

public record LoginResponse(
        String message,
        boolean success,
        String username,
        String token
) {
}

