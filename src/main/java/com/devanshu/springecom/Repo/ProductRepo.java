package com.devanshu.springecom.Repo;

import com.devanshu.springecom.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product,Integer> {

    // Search by name (case-insensitive, partial match)
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Search by brand (case-insensitive, partial match)
    List<Product> findByBrandContainingIgnoreCase(String brand);
    
    // Search by category (case-insensitive, exact match)
    List<Product> findByCategoryIgnoreCase(String category);
    
    // Search by description (case-insensitive, partial match)
    List<Product> findByDescriptionContainingIgnoreCase(String description);
    
    // Combined search across multiple fields
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(@Param("keyword") String keyword);
}
