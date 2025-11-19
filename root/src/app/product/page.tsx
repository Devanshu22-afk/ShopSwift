"use client";

import Container from "@/components/Container";
import { getSingleProduct, getTrendingProducts } from "@/helpers";
import { Products } from "../../../type";
import ProductsData from "@/components/ProductsData";
import SignleProduct from "@/components/SignleProduct";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const ProductPage = () => {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id") || searchParams.get("_id");
  const productId = idParam ? Number(idParam) : null;
  
  const [product, setProduct] = useState<Products | null>(null);
  const [trendingProducts, setTrendingProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (productId) {
        try {
          setLoading(true);
          const productData = await getSingleProduct(productId);
          setProduct(productData);
          const trending = await getTrendingProducts();
          setTrendingProducts(trending);
        } catch (error) {
          console.error("Failed to fetch product:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <Container>
        <div className="py-10 text-center">
          <p>Loading product...</p>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <div className="py-10 text-center">
          <p>Product not found</p>
        </div>
      </Container>
    );
  }

  return (
    <div>
      <Container>
        <SignleProduct product={product} />
        <div>
          <p className="text-xl py-1 font-semibold">Trending Products</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {trendingProducts?.map((item: Products) => (
              <ProductsData key={item.id || item._id} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
