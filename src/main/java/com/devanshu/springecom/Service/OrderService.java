package com.devanshu.springecom.Service;

import com.devanshu.springecom.Model.Order;
import com.devanshu.springecom.Model.OrderItem;
import com.devanshu.springecom.Model.Product;
import com.devanshu.springecom.Model.dto.OrderRequest;
import com.devanshu.springecom.Model.dto.OrderResponse;
import com.devanshu.springecom.Model.dto.OrderItemRequest;
import com.devanshu.springecom.Model.dto.OrderitemResponse;
import com.devanshu.springecom.Repo.OrderRepo;
import com.devanshu.springecom.Repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private ProductRepo productRepo;

    @Transactional
    public OrderResponse placeOrder(OrderRequest orderRequest) {
        Order order = new Order();
        String orderId = "ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        order.setOrderId(orderId);
        order.setCustomerName(orderRequest.CustomerName());
        order.setEmail(orderRequest.email());
        order.setStatus("PLACED");
        order.setOrderDate(LocalDate.now());

        List<OrderItem> orderItems = new ArrayList<>();
        List<OrderitemResponse> orderItemResponses = new ArrayList<>();

        for (OrderItemRequest itemRequest : orderRequest.items()) {
            Optional<Product> productOpt = productRepo.findById(itemRequest.productID());
            
            if (productOpt.isEmpty()) {
                throw new RuntimeException("Product with ID " + itemRequest.productID() + " not found");
            }

            Product product = productOpt.get();

            if (product.getStockQuantity() < itemRequest.quantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                    ". Available: " + product.getStockQuantity() + ", Requested: " + itemRequest.quantity());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.quantity());
            
            BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity()));
            orderItem.setTotalprice(totalPrice);
            orderItem.setOrder(order);

            orderItems.add(orderItem);

            int newStockQuantity = product.getStockQuantity() - itemRequest.quantity();
            product.setStockQuantity(newStockQuantity);
            productRepo.save(product);

            OrderitemResponse itemResponse = new OrderitemResponse(
                product.getName(),
                itemRequest.quantity(),
                totalPrice
            );
            orderItemResponses.add(itemResponse);
        }

        order.setOrderItems(orderItems);

        Order savedOrder = orderRepo.save(order);

        OrderResponse orderResponse = new OrderResponse(
            savedOrder.getOrderId(),
            savedOrder.getCustomerName(),
            savedOrder.getEmail(),
            savedOrder.getStatus(),
            savedOrder.getOrderDate(),
            orderItemResponses
        );

        return orderResponse;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getallOrderResponses() {
        List<Order> orders = orderRepo.findAll();
        
        if (orders == null || orders.isEmpty()) {
            return new ArrayList<>();
        }
        
        return orders.stream().map(order -> {
            List<OrderitemResponse> itemResponses = new ArrayList<>();
            
            if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
                itemResponses = order.getOrderItems().stream()
                    .filter(item -> item != null && item.getProduct() != null)
                    .map(item -> new OrderitemResponse(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getTotalprice() != null ? item.getTotalprice() : BigDecimal.ZERO
                    ))
                    .collect(Collectors.toList());
            }

            return new OrderResponse(
                order.getOrderId() != null ? order.getOrderId() : "",
                order.getCustomerName() != null ? order.getCustomerName() : "",
                order.getEmail() != null ? order.getEmail() : "",
                order.getStatus() != null ? order.getStatus() : "",
                order.getOrderDate() != null ? order.getOrderDate() : LocalDate.now(),
                itemResponses
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUserEmail(String email) {
        List<Order> orders = orderRepo.findByEmail(email);
        
        if (orders == null || orders.isEmpty()) {
            return new ArrayList<>();
        }
        
        return orders.stream().map(order -> {
            List<OrderitemResponse> itemResponses = new ArrayList<>();
            
            if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
                itemResponses = order.getOrderItems().stream()
                    .filter(item -> item != null && item.getProduct() != null)
                    .map(item -> new OrderitemResponse(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getTotalprice() != null ? item.getTotalprice() : BigDecimal.ZERO
                    ))
                    .collect(Collectors.toList());
            }

            return new OrderResponse(
                order.getOrderId() != null ? order.getOrderId() : "",
                order.getCustomerName() != null ? order.getCustomerName() : "",
                order.getEmail() != null ? order.getEmail() : "",
                order.getStatus() != null ? order.getStatus() : "",
                order.getOrderDate() != null ? order.getOrderDate() : LocalDate.now(),
                itemResponses
            );
        }).collect(Collectors.toList());
    }
}
