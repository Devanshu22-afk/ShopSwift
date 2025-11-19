"use client";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import FormattedPrice from "./FormattedPrice";
import { resetOrder } from "@/redux/shoppingSlice";
import Link from "next/link";
import API from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface OrderItem {
  productName: string;
  quantity: number;
  totalPrice: number; // This is the total price for this item (quantity * unit price)
}

interface Order {
  orderId: string;
  customerName: string;
  email: string;
  orderDate: string;
  status?: string;
  items: OrderItem[];
}

const OrderDetails = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get("/orders");
      console.log("Orders API Response:", response.data); // Debug log
      if (response.data && Array.isArray(response.data)) {
        // Map the response to ensure proper data structure
        const mappedOrders = response.data.map((order: any) => ({
          orderId: order.orderId || order.orderID || '',
          customerName: order.customerName || order.cutomerName || '',
          email: order.email || order.Email || '',
          orderDate: order.orderDate || new Date().toISOString(),
          status: order.status || '',
          items: (order.items || []).map((item: any) => ({
            productName: item.productName || 'Unknown Product',
            quantity: item.quantity || 0,
            totalPrice: typeof item.totalPrice === 'number' 
              ? item.totalPrice 
              : parseFloat(item.totalPrice || item.TotalPrice || '0') || 0
          }))
        }));
        setOrders(mappedOrders);
      }
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      console.error("Error details:", error.response?.data);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-10 bg-white text-black text-2xl text-center">
        <p>Please login to view your orders</p>
        <Link href={"/login"}>
          <button className="bg-black text-slate-100 w-44 h-12 rounded-full text-base font-semibold mt-2 hover:bg-orange-600 duration-300">
            Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {orders.length > 0 ? (
        <div className="space-y-8">
          {orders.map((order) => {
            // Calculate total amount from all items
            const totalAmount = order.items.reduce((sum, item) => {
              const itemTotal = typeof item.totalPrice === 'number' ? item.totalPrice : parseFloat(item.totalPrice) || 0;
              return sum + itemTotal;
            }, 0);
            
            return (
              <div key={order.orderId} className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4 pb-4 border-b">
                  <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Customer: {order.customerName}</p>
                  {order.status && (
                    <p className="text-sm text-gray-600">Status: {order.status}</p>
                  )}
                </div>
                <div className="grid grid-cols-7 uppercase text-sm font-medium py-2 border-b-[1px] border-b-gray-300">
                  <p className="col-span-4">Items</p>
                  <p className="flex items-center justify-center">Quantity</p>
                  <p className="flex items-center justify-center">Unit Price</p>
                  <p className="flex items-center justify-center">Amount</p>
                </div>
                <div className="py-2 flex flex-col justify-center gap-2">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => {
                      // Calculate unit price from totalPrice / quantity
                      const itemTotal = typeof item.totalPrice === 'number' ? item.totalPrice : parseFloat(item.totalPrice) || 0;
                      const unitPrice = item.quantity > 0 ? itemTotal / item.quantity : 0;
                      
                      return (
                        <div
                          key={index}
                          className="py-2 border-b-[1px] border-gray-300 grid grid-cols-7 items-center"
                        >
                          <div className="col-span-4 flex items-start gap-2 text-sm">
                            <div>
                              <h3 className="text-base font-semibold mb-1">
                                {item.productName || 'Unknown Product'}
                              </h3>
                            </div>
                          </div>
                          <p className="flex items-center justify-center">
                            {item.quantity}
                          </p>
                          <p className="flex items-center justify-center">
                            <FormattedPrice amount={unitPrice} />
                          </p>
                          <p className="flex items-center justify-center">
                            <FormattedPrice amount={itemTotal} />
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="py-4 text-center text-gray-500">No items in this order</p>
                  )}
                </div>
                <div className="text-lg font-medium py-2 border-b-[1px] border-b-gray-300">
                  <p>Payment Details</p>
                </div>
                <p className="py-2">
                  Total Paid{" "}
                  <span className="text-xl font-semibold">
                    <FormattedPrice amount={totalAmount} />
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-10 bg-white text-black text-2xl text-center">
          <p>No orders found</p>
          <Link href={"/"}>
            <button className="bg-black text-slate-100 w-44 h-12 rounded-full text-base font-semibold mt-2 hover:bg-orange-600 duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
