"use client";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import { IoMdCart } from "react-icons/io";
import { FiSearch, FiLogOut } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { Products, StateProps } from "../../type";
import FormattedPrice from "./FormattedPrice";
import Link from "next/link";
import { addUser, deleteUser } from "@/redux/shoppingSlice";
import { BsBookmarks } from "react-icons/bs";
import { MdAddShoppingCart } from "react-icons/md";

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, logout } = useAuth();
  const { productData, orderData } = useSelector(
    (state: StateProps) => state.shopping
  );

  useEffect(() => {
    if (user && isAuthenticated) {
      dispatch(
        addUser({
          name: user.username,
          email: user.email,
          role: user.role,
        })
      );
    } else {
      dispatch(deleteUser());
    }
  }, [user, isAuthenticated, dispatch]);

  const [totalAmt, setTotalAmt] = useState(0);

  useEffect(() => {
    let amt = 0;
    productData.map((item: Products) => {
      amt += item.price * item.quantity;
      return;
    });
    setTotalAmt(amt);
  }, [productData]);

  return (
    <div className="bg-bodyColor h-20 top-0 sticky z-50">
      <Container className="h-full flex items-center md:gap-x-5 justify-between md:justify-start">
        <Logo />
        {/* Search Field */}
        <div className="w-full bg-white hidden md:flex items-center gap-x-1 border-[1px] border-lightText/50 rounded-full px-4 py-1.5 focus-within:border-orange-600 group">
          <FiSearch className="text-gray-500 group-focus-within:text-darkText duration-200" />
          <input
            type="text"
            placeholder="Search for products"
            className="placeholder:text-sm flex-1 outline-none"
          />
        </div>
        {/* Login/Register */}
        {!isAuthenticated && (
          <Link href="/login">
            <div className="headerDiv cursor-pointer">
              <AiOutlineUser className="text-2xl" />
              <p className="text-sm font-semibold">Login/Register</p>
            </div>
          </Link>
        )}
        {/* Cart button */}
        <Link href={"/cart"}>
          <div className="bg-black hover:bg-slate-950 rounded-full text-slate-100 hover:text-white flex items-center justify-center gap-x-1 px-3 py-1.5 border-[1px] border-black hover:border-orange-600 duration-200 relative">
            <IoMdCart className="text-xl" />
            <p className="text-sm font-semibold">
              <FormattedPrice amount={totalAmt ? totalAmt : 0} />
            </p>
            <span className="bg-white text-orange-600 rounded-full text-xs font-semibold absolute -right-2 -top-1 w-5 h-5 flex items-center justify-center shadow-xl shadow-black">
              {productData ? productData?.length : 0}
            </span>
          </div>
        </Link>
        {/* User Info */}
        {isAuthenticated && user && (
          <div className="headerDiv px-2 gap-x-1">
            <AiOutlineUser className="text-2xl" />
            <p className="text-sm font-semibold">{user.username}</p>
            {user.role === "ADMIN" && (
              <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded font-semibold">ADMIN</span>
            )}
          </div>
        )}
        {/* Order button */}
        {isAuthenticated && (
          <Link
            href={"/order"}
            className="headerDiv px-2 gap-x-1 cursor-pointer"
          >
            <BsBookmarks className="text-2xl" />
            <p className="text-sm font-semibold">Orders</p>
          </Link>
        )}
        {/* Add Product button (Admin only) */}
        {isAuthenticated && user?.role === "ADMIN" && (
          <Link
            href={"/add-product"}
            className="headerDiv px-2 gap-x-1 cursor-pointer whitespace-nowrap"
          >
            <MdAddShoppingCart className="text-2xl" />
            <p className="text-sm font-semibold">Add Product</p>
          </Link>
        )}
        {/* Logout button */}
        {isAuthenticated && (
          <div
            onClick={logout}
            className="headerDiv px-2 gap-x-1 cursor-pointer"
          >
            <FiLogOut className="text-2xl" />
            <p className="text-sm font-semibold">Logout</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Header;
