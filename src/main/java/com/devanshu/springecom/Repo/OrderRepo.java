package com.devanshu.springecom.Repo;

import com.devanshu.springecom.Model.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderId(String orderId);
    
    @EntityGraph(attributePaths = {"orderItems", "orderItems.product"})
    List<Order> findByEmail(String email);
    
    @Override
    @EntityGraph(attributePaths = {"orderItems", "orderItems.product"})
    List<Order> findAll();
}
