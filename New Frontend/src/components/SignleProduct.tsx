"use client";

import Image from "next/image";
import FormattedPrice from "./FormattedPrice";
import { IoMdCart } from "react-icons/io";
import { MdFavoriteBorder, MdEdit, MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/shoppingSlice";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

const SignleProduct = ({ product }: any) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const productId = product.id || product._id;
    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

    if (!isAuthenticated || user?.role !== "ADMIN") {
      toast.error("Only administrators can delete products");
      return;
    }

    setDeleting(true);
    try {
      const response = await API.delete(`/product/${productId}`);
      console.log("Delete response:", response);
      toast.success("Product deleted successfully");
      // Redirect to home after a short delay
      setTimeout(() => {
        router.push("/");
        router.refresh(); // Refresh to update the product list
      }, 1000);
    } catch (error: any) {
      console.error("Delete error:", error);
      console.error("Error response:", error.response);
      console.error("Product ID used:", productId);
      
      let errorMessage = "Failed to delete product. Please try again.";
      
      if (error.response?.status === 403) {
        errorMessage = "You don't have permission to delete products. Please login as admin.";
        router.push("/login");
      } else if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
        router.push("/login");
      } else if (error.response?.status === 404) {
        errorMessage = "Product not found";
      } else if (error.response?.status === 500 || error.response?.status === 400) {
        // Handle Spring Boot error response format
        const errorData = error.response?.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = String(errorData.message);
        } else if (errorData?.error) {
          errorMessage = `Server error: ${String(errorData.error)}`;
        } else {
          errorMessage = "Server error: Cannot delete product. It may be referenced in existing orders.";
        }
      } else if (error.response?.data) {
        // Extract message from error response
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = String(error.response.data.message);
        } else if (error.response.data.error) {
          errorMessage = String(error.response.data.error);
        }
      } else if (error.message) {
        errorMessage = String(error.message);
      }
      
      // Ensure errorMessage is always a string
      toast.error(String(errorMessage));
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = () => {
    router.push(`/update-product?id=${product.id || product._id}`);
  };
  return (
    <div className="grid lg:grid-cols-2 gap-5 bg-white p-4 rounded-lg">
      <div>
        <Image
          src={product?.image || (product?.imageData ? `data:image/jpeg;base64,${product.imageData}` : "/next.svg")}
          alt="product image"
          width={500}
          height={500}
          className="w-full max-h-[700px] object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-center gap-y-10">
        <div>
          <p className="text-3xl font-semibold">{product?.name || product?.title}</p>
          <p className="text-xl font-semibold">
            <FormattedPrice amount={product?.price} />
          </p>
        </div>
        <p className="text-lightText">{product?.description}</p>
        <div className="text-sm text-lightText flex flex-col">
          <span>
            SKU: <span className="text-darkText">{product?.id || product?._id}</span>
          </span>
          <span>
            Category: <span className="text-darkText">{product?.category}</span>
          </span>
          {product?.brand && (
            <span>
              Brand: <span className="text-darkText">{product.brand}</span>
            </span>
          )}
        </div>
        <div
          onClick={() =>
            dispatch(addToCart(product)) &&
            toast.success(
              `${(product?.name || product?.title || "").substring(0, 15)} added successfully!`
            )
          }
          className="flex items-center cursor-pointer group"
        >
          <button className="bg-darkText text-slate-100 px-6 py-3 text-sm uppercase flex items-center border-r-[1px] border-r-slate-500">
            add to cart
          </button>
          <span className="bg-darkText text-xl text-slate-100 w-12 flex items-center justify-center group-hover:bg-orange-500 duration-200 py-3">
            <IoMdCart />
          </span>
        </div>
        <p className="flex items-center gap-x-2 text-sm">
          <MdFavoriteBorder className="text-xl" />
          Add to wishlist
        </p>
        {/* Admin Actions */}
        {isAuthenticated && user?.role === "ADMIN" && (
          <div className="flex gap-x-4 mt-4 pt-4 border-t border-gray-300">
            <button
              onClick={handleUpdate}
              className="flex items-center gap-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md duration-200"
            >
              <MdEdit className="text-xl" />
              Update Product
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdDelete className="text-xl" />
              {deleting ? "Deleting..." : "Delete Product"}
            </button>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default SignleProduct;
