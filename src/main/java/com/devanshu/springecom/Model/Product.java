package com.devanshu.springecom.Model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String description;
    private String category;
    private String brand;
    private BigDecimal price;
    private int stockQuantity;
    private Date releaseDate;
    private boolean productAvailable;
    
    @JsonIgnore
    @Column(name = "image", nullable = true)
    @Basic(fetch = jakarta.persistence.FetchType.LAZY)
    private byte[] image;



}
