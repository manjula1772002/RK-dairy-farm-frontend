"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.log(error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromCart = (productId, label) => {
    const updatedCart = cartItems.filter(
      (item) => !(item._id === productId && item.label === label),
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (productId, label, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, label);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item._id === productId && item.label === label
        ? { ...item, quantity }
        : item,
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const placeOrder = () => {
    if (!cartItems.length) return;

    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/purchase");
      router.push("/login");
      return;
    }

    router.push("/purchase");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold">Loading Cart...</h1>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Looks like you haven&apos;t added dairy products yet.
          </p>

          <Link
            href="/product"
            className="bg-green-700 text-white px-8 py-4 rounded-xl hover:bg-green-600 transition font-semibold text-lg inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>

          <span className="text-lg text-gray-600">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <div>
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
              >
                <div className="flex">
                  <div className="w-[180px] relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-[140px] object-cover"
                    />

                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {item.quantity}x
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          {item.name}
                        </h2>

                        <p className="text-sm text-gray-500 mb-2">{item.label}</p>

                        <p className="text-green-700 font-bold text-xl mb-3">
                          Rs.{item.price}
                        </p>

                        <p className="text-gray-600 text-lg">
                          Subtotal:
                          <span className="ml-2 font-bold text-green-700">
                            Rs.{item.price * item.quantity}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 items-center">
                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.label, item.quantity - 1)
                            }
                            className="px-5 py-2 text-xl"
                          >
                            -
                          </button>

                          <div className="px-5 py-2 font-bold">{item.quantity}</div>

                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.label, item.quantity + 1)
                            }
                            className="px-5 py-2 text-xl"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id, item.label)}
                          className="border border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-5">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="flex justify-between mb-3">
                <span>Items ({totalItems})</span>
                <span>Rs.{totalPrice}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-green-700">Rs.{totalPrice}</span>
              </div>

              <button
                onClick={placeOrder}
                className="w-full mt-6 bg-green-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition"
              >
                Place Order
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-4 border border-red-500 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
