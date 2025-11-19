-- Fix orders table to have auto-incrementing id column
-- Run this SQL script in your PostgreSQL database

-- First, check if the table exists and drop it if needed (optional - only if you want to recreate)
-- DROP TABLE IF EXISTS order_item CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;

-- Create orders table with proper id column
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    orderid VARCHAR(255) UNIQUE,
    customer_name VARCHAR(255),
    email VARCHAR(255),
    status VARCHAR(255),
    order_date DATE
);

-- Create order_item table
CREATE TABLE IF NOT EXISTS order_item (
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    totalprice NUMERIC(38,2),
    order_id BIGINT,
    product_id INTEGER,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES product(id)
);

-- If the table already exists, alter it to fix the id column
-- ALTER TABLE orders ALTER COLUMN id TYPE BIGSERIAL;
-- This might not work if data exists, so you may need to:
-- 1. Create a new table with the correct structure
-- 2. Copy data
-- 3. Drop old table
-- 4. Rename new table

