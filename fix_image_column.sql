-- SQL script to fix the image column in the product table
-- Run this script in your PostgreSQL database

-- OPTION 1: Drop and recreate the table (WARNING: This will delete all data!)
-- DROP TABLE IF EXISTS product CASCADE;

-- OPTION 2: Drop only the image column and recreate it
ALTER TABLE product DROP COLUMN IF EXISTS image;
ALTER TABLE product ADD COLUMN image BYTEA;

-- Make it nullable
ALTER TABLE product ALTER COLUMN image SET DEFAULT NULL;

-- OPTION 3: If column exists with wrong type, try to fix it
-- First check the current type:
-- SELECT column_name, data_type, udt_name 
-- FROM information_schema.columns 
-- WHERE table_name = 'product' AND column_name = 'image';

-- If it's the wrong type, drop and recreate:
-- ALTER TABLE product DROP COLUMN image;
-- ALTER TABLE product ADD COLUMN image BYTEA;

