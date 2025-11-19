"use client";

import React, { useState, useEffect } from "react";
import API from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/Container";
import toast, { Toaster } from "react-hot-toast";

const UpdateProductPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      toast.error("Only administrators can update products");
      router.push("/");
      return;
    }

    if (productId) {
      fetchProduct();
    } else {
      toast.error("Product ID is required");
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, authLoading, productId, router]);

  const fetchProduct = async () => {
    try {
      setFetching(true);
      const response = await API.get(`/products/${productId}`);
      if (response.data) {
        const productData = response.data;
        setProduct({
          name: productData.name || "",
          brand: productData.brand || "",
          description: productData.description || "",
          price: productData.price?.toString() || "",
          category: productData.category || "",
          stockQuantity: productData.stockQuantity?.toString() || "",
          releaseDate: productData.releaseDate
            ? new Date(productData.releaseDate).toISOString().split("T")[0]
            : "",
          productAvailable: productData.productAvailable !== false,
        });

        if (productData.imageData) {
          setImagePreview(
            `data:image/jpeg;base64,${productData.imageData}`
          );
        }
      }
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      router.push("/");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setProduct({ ...product, [name]: fieldValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Please select a valid image file (JPEG or PNG)" });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 10MB" });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setErrors({ ...errors, image: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!product.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!product.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!product.price || parseFloat(product.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!product.category.trim()) {
      newErrors.category = "Category is required";
    }
    if (!product.stockQuantity || parseInt(product.stockQuantity) < 0) {
      newErrors.stockQuantity = "Valid stock quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const productJson = JSON.stringify({
        name: product.name,
        brand: product.brand || "",
        description: product.description,
        price: parseFloat(product.price),
        category: product.category,
        stockQuantity: parseInt(product.stockQuantity),
        releaseDate: product.releaseDate || null,
        productAvailable: product.productAvailable,
      });

      formData.append("product", productJson);
      if (image) {
        formData.append("imageFile", image);
      }

      const response = await API.put(`/product/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        toast.success("Product updated successfully!");
        router.push(`/product?id=${productId}`);
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      if (error.response?.status === 413) {
        toast.error("Image file is too large. Maximum size is 10MB.");
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Unauthorized. Please login as administrator.");
        router.push("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to update product");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetching) {
    return (
      <Container>
        <div className="py-10 text-center">Loading...</div>
      </Container>
    );
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Update Product</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
              <input
                type="number"
                name="stockQuantity"
                value={product.stockQuantity}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.stockQuantity ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.stockQuantity && (
                <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={product.releaseDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="productAvailable"
              checked={product.productAvailable}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Product Available</label>
          </div>

          <div className="flex gap-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
        <Toaster />
      </div>
    </Container>
  );
};

export default UpdateProductPage;

