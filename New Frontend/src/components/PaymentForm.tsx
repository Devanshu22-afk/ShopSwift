"use client";

import { useDispatch, useSelector } from "react-redux";
import { Products, StateProps } from "../../type";
import FormattedPrice from "./FormattedPrice";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { resetCart, saveOrder } from "@/redux/shoppingSlice";
import API from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const PaymentForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { productData, userInfo } = useSelector(
    (state: StateProps) => state?.shopping
  );
  const { isAuthenticated, user } = useAuth();
  const [totalAmt, setTotalAmt] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let amt = 0;
    productData.map((item: Products) => {
      amt += item.price * item.quantity;
      return;
    });
    setTotalAmt(amt);
  }, [productData]);

  const handleCheckout = async () => {
    // Check authentication first - redirect to login if not authenticated
    if (!isAuthenticated || !user) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }

    if (productData.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      // Map cart items to Spring Boot order format
      const orderItems = productData.map((item: Products) => ({
        productId: item.id || item._id,
        quantity: item.quantity,
      }));

      const response = await API.post("/place", {
        items: orderItems,
      });

      if (response.data) {
        toast.success("Order placed successfully!");
        dispatch(saveOrder({ order: productData, orderId: response.data.orderId }));
        dispatch(resetCart());
        router.push("/order");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(
        error.response?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full bg-white p-4">
      <h2>Cart Totals</h2>
      <div className="border-b-[1px] border-b-slate-300 py-2">
        <div className="max-w-lg flex items-center justify-between">
          <p className="uppercase font-medium">Subtotal</p>
          <p>
            <FormattedPrice amount={totalAmt} />
          </p>
        </div>
      </div>
      <div className="border-b-[1px] border-b-slate-300 py-2">
        <div className="max-w-lg flex items-center justify-between">
          <p className="uppercase font-medium">Shipping</p>
          <p>
            <FormattedPrice amount={20} />
          </p>
        </div>
      </div>
      <div className="border-b-[1px] border-b-slate-300 py-2">
        <div className="max-w-lg flex items-center justify-between">
          <p className="uppercase font-medium">Total Price</p>
          <p>
            <FormattedPrice amount={totalAmt + 20} />
          </p>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-black text-slate-100 mt-4 py-3 px-6 hover:bg-orange-950 cursor-pointer duration-200 disabled:opacity-50 w-full"
      >
        {loading ? "Processing..." : "Proceed to checkout"}
      </button>
      {!isAuthenticated && (
        <p className="text-sm mt-2 text-gray-600 text-center">
          You'll be asked to login or register when you proceed to checkout
        </p>
      )}
    </div>
  );
};

export default PaymentForm;
