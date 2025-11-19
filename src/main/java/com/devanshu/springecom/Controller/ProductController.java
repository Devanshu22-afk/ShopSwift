package com.devanshu.springecom.Controller;


import com.devanshu.springecom.Model.Product;
import com.devanshu.springecom.Service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Base64;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/products")
    public List<Map<String, Object>> getproduct(){
        List<Product> products = productService.getallproducts();
        return products.stream().map(this::convertProductToMap).collect(Collectors.toList());
    }

    @GetMapping("/products/search")
    public List<Map<String, Object>> searchProducts(@RequestParam(required = false) String keyword) {
        List<Product> products;
        if (keyword == null || keyword.trim().isEmpty()) {
            products = productService.getallproducts();
        } else {
            products = productService.searchProducts(keyword);
        }
        return products.stream().map(this::convertProductToMap).collect(Collectors.toList());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable int id){
        Optional<Product> product = productService.getProductById(id);
        if(product.isPresent()){
            return ResponseEntity.ok(convertProductToMap(product.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping(value = "/product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> addProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        try {
            Product product = objectMapper.readValue(productJson, Product.class);
            
            if (imageFile != null && !imageFile.isEmpty()) {
                product.setImage(imageFile.getBytes());
            }
            // Don't set image to null explicitly - let it remain unset if no image provided
            
            Product savedProduct = productService.saveProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertProductToMap(savedProduct));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/products/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable int id) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent() && product.get().getImage() != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(product.get().getImage());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(value = "/product/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable int id,
            @RequestPart("product") String productJson,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        try {
            Product product = objectMapper.readValue(productJson, Product.class);
            
            if (imageFile != null && !imageFile.isEmpty()) {
                product.setImage(imageFile.getBytes());
            }
            
            Product updatedProduct = productService.updateProduct(id, product);
            if (updatedProduct != null) {
                return ResponseEntity.ok(convertProductToMap(updatedProduct));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id) {
        try {
            boolean deleted = productService.deleteProduct(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product not found with id: " + id);
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to delete product: " + e.getMessage());
        }
    }

    // Helper method to convert Product to Map with imageData
    private Map<String, Object> convertProductToMap(Product product) {
        Map<String, Object> productMap = new HashMap<>();
        productMap.put("id", product.getId());
        productMap.put("name", product.getName());
        productMap.put("description", product.getDescription());
        productMap.put("category", product.getCategory());
        productMap.put("brand", product.getBrand());
        productMap.put("price", product.getPrice());
        productMap.put("stockQuantity", product.getStockQuantity());
        productMap.put("releaseDate", product.getReleaseDate());
        productMap.put("productAvailable", product.isProductAvailable());
        
        // Convert image bytes to base64 string
        if (product.getImage() != null && product.getImage().length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(product.getImage());
            productMap.put("imageData", base64Image);
            productMap.put("productImage", base64Image); // For SearchResults component
            productMap.put("imageName", "product_" + product.getId() + ".jpg"); // For Product.jsx and UpdateProduct.jsx
        } else {
            productMap.put("imageData", null);
            productMap.put("productImage", null);
            productMap.put("imageName", null);
        }
        
        return productMap;
    }

    // Alternative endpoint matching frontend expectations
    @GetMapping("/product/{id}")
    public ResponseEntity<Map<String, Object>> getProductByIdAlt(@PathVariable int id) {
        return getProductById(id);
    }

    @GetMapping("/product/{id}/image")
    public ResponseEntity<byte[]> getProductImageAlt(@PathVariable int id) {
        return getProductImage(id);
    }

}
