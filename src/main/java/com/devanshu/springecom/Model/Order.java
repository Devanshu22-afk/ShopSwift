package com.devanshu.springecom.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity(name = "orders")
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
    @SequenceGenerator(name = "order_seq", sequenceName = "order_sequence", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(unique = true)
    private String orderId;
    private  String customerName;
    private  String email;
    private  String status;
    private LocalDate orderDate;

    @OneToMany(mappedBy ="order",cascade = CascadeType.ALL )
    private List<OrderItem> orderItems;
}
