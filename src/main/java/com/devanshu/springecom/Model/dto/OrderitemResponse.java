package com.devanshu.springecom.Model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record OrderitemResponse(
        String productName,
        int quantity,
        @JsonProperty("totalPrice") BigDecimal TotalPrice
) {
}
