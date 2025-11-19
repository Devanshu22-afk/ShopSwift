package com.devanshu.springecom.Model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record OrderItemRequest(
        @JsonProperty("productId") int productID,
        int quantity
) {

}
