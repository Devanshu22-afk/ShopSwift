package com.devanshu.springecom.Model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.util.List;

public record OrderResponse(
        @JsonProperty("orderId") String orderID,
        @JsonProperty("customerName") String cutomerName,
        @JsonProperty("email") String Email,
        String status,
        @JsonProperty("orderDate") LocalDate orderDate,
        List<OrderitemResponse> items
) {

}
