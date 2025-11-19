import API from "@/lib/axios";
import { Products } from "../../type";

// Map Spring Boot product to frontend format
const mapProduct = (product: any): Products => {
  return {
    id: product.id,
    _id: product.id, // For backward compatibility
    name: product.name || "",
    title: product.name || "", // For backward compatibility
    price: product.price || 0,
    description: product.description || "",
    category: product.category || "",
    brand: product.brand || "",
    image: product.imageData
      ? `data:image/jpeg;base64,${product.imageData}`
      : undefined,
    imageData: product.imageData,
    quantity: 1,
    stockQuantity: product.stockQuantity || 0,
    productAvailable: product.productAvailable !== false,
  };
};

export const getProducts = async (): Promise<Products[]> => {
  try {
    const response = await API.get("/products");
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(mapProduct);
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const getTrendingProducts = async (): Promise<Products[]> => {
  // For now, return all products as trending
  // You can implement a separate endpoint later
  return getProducts();
};

export const calculatePercentage = (oldPrice: any, price: any) => {
  return !!parseFloat(price) && !!parseFloat(oldPrice)
    ? (100 - (oldPrice / price) * 100).toFixed(0)
    : 0;
};

export const getSingleProduct = async (id: number): Promise<Products | null> => {
  try {
    const response = await API.get(`/products/${id}`);
    if (response.data) {
      return mapProduct(response.data);
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
};
