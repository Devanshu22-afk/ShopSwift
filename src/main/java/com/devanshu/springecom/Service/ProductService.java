package com.devanshu.springecom.Service;


import com.devanshu.springecom.Model.Product;
import com.devanshu.springecom.Repo.ProductRepo;
import com.devanshu.springecom.Repo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    ProductRepo productRepo;
    
    @Autowired
    OrderRepo orderRepo;
    public List<Product> getallproducts() {
        return productRepo.findAll();
    }

    public Optional<Product> getProductById(int id) {
        return productRepo.findById(id);
    }

    public Product saveProduct(Product product) {
        return productRepo.save(product);
    }

    public Product updateProduct(int id, Product product) {
        Optional<Product> existingProduct = productRepo.findById(id);
        if (existingProduct.isPresent()) {
            Product productToUpdate = existingProduct.get();
            productToUpdate.setName(product.getName());
            productToUpdate.setDescription(product.getDescription());
            productToUpdate.setCategory(product.getCategory());
            productToUpdate.setBrand(product.getBrand());
            productToUpdate.setPrice(product.getPrice());
            productToUpdate.setStockQuantity(product.getStockQuantity());
            productToUpdate.setReleaseDate(product.getReleaseDate());
            productToUpdate.setProductAvailable(product.isProductAvailable());
            
            // Only update image if a new one is provided
            if (product.getImage() != null && product.getImage().length > 0) {
                productToUpdate.setImage(product.getImage());
            }
            
            return productRepo.save(productToUpdate);
        }
        return null;
    }

    @Transactional
    public boolean deleteProduct(int id) {
        try {
            Optional<Product> productOpt = productRepo.findById(id);
            if (productOpt.isEmpty()) {
                return false;
            }
            
            Product product = productOpt.get();
            
            // Check if product is referenced in any orders
            List<com.devanshu.springecom.Model.Order> orders = orderRepo.findAll();
            for (com.devanshu.springecom.Model.Order order : orders) {
                if (order.getOrderItems() != null) {
                    for (com.devanshu.springecom.Model.OrderItem item : order.getOrderItems()) {
                        if (item.getProduct() != null && item.getProduct().getId() == id) {
                            throw new RuntimeException("Cannot delete product: It is referenced in existing orders. Order ID: " + order.getOrderId());
                        }
                    }
                }
            }
            
            // If not referenced, proceed with deletion
            productRepo.deleteById(id);
            return true;
        } catch (DataIntegrityViolationException e) {
            // Product is referenced in orders, cannot delete
            throw new RuntimeException("Cannot delete product: It is referenced in existing orders. Please remove it from orders first.");
        } catch (RuntimeException e) {
            // Re-throw RuntimeException (our custom message)
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete product: " + e.getMessage());
        }
    }

    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getallproducts();
        }
        return productRepo.searchProducts(keyword.trim());
    }
}
