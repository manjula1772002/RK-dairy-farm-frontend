"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfileOrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    async function loadOrders() {
      try {
        const response = await fetch("/api/orders/my-orders", {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load orders.");
          return;
        }

        setOrders(data.orders || []);
      } catch {
        setError("Failed to load orders.");
      } finally {
        setIsLoadingOrders(false);
      }
    }

    loadOrders();
  }, [loading, router, user]);

  if (loading || isLoadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-700">My Orders</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">Order History</h1>
          </div>

          <Link href="/product" className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-600">
            Browse Products
          </Link>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        {!error && orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">No orders yet</h2>
            <p className="mt-2 text-gray-500">Your placed orders will appear here.</p>
          </div>
        ) : null}

        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order._id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <h2 className="mt-1 text-xl font-bold text-gray-900">Rs.{order.totalAmount}</h2>
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-green-50 px-3 py-1 font-medium text-green-700">
                    {order.paymentMethod}
                  </span>
                  <span className="rounded-full bg-yellow-50 px-3 py-1 font-medium text-yellow-700">
                    {order.orderStatus}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                    Payment {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {order.items?.map((item) => (
                  <div key={`${order._id}-${item.product}-${item.label}`} className="flex items-center gap-3">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                    ) : null}
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.label} x {item.quantity} - Rs.{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                <p className="font-semibold text-gray-900">{order.address?.fullName} - {order.address?.phone}</p>
                <p className="mt-1">
                  {[order.address?.houseNo, order.address?.street, order.address?.city, order.address?.state, order.address?.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
