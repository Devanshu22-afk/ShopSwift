package com.devanshu.springecom.Model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record OrderRequest(
        @JsonProperty("customerName") String CustomerName,
        String email,
        @JsonProperty("items") List<OrderItemRequest> items
) {
}
