"use client";

import { getProducts } from "@/helpers";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import ProductsData from "./ProductsData";
import { Products } from "../../type";

const ProductsComponent = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container className="flex justify-center items-center py-20">
        <p className="text-lg">Loading products...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="flex justify-center items-center py-20">
        <p className="text-lg text-red-600">{error}</p>
      </Container>
    );
  }

  return (
    <Container className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 -mt-10">
      {products?.map((item: Products) => (
        <ProductsData item={item} key={item.id || item._id} />
      ))}
    </Container>
  );
};

export default ProductsComponent;
