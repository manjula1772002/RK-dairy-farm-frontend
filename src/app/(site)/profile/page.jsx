"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [orderCount, setOrderCount] = useState(0);

  const username = user?.name || "User";

  useEffect(() => {
    if (!user) return;

    async function loadOrders() {
      try {
        const response = await fetch("/api/orders/my-orders", {
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setOrderCount(data.orders?.length || 0);
        }
      } catch {
        setOrderCount(0);
      }
    }

    loadOrders();
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center p-6">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h1 className="text-4xl font-bold text-black">
            RK Dairy Farm
          </h1>

          <p className="text-gray-500 mt-3 text-sm">
            Fresh dairy products dashboard for your profile
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-5 bg-gray-50 border border-gray-200 rounded-3xl p-6">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-700">
              {username.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold text-gray-900">
                {username}
              </h2>
            </div>
          </div>

          <div >
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">
                Active Orders
              </p>

              <h3 className="text-4xl font-bold mt-3">
                {orderCount}
              </h3>
            </div>

            {/* <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">
                Wishlist Items
              </p>

              <h3 className="text-4xl font-bold mt-3">
                5
              </h3>
            </div> */}
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              Account Summary
            </h3>

            <ul className="mt-4 space-y-3 text-gray-600">
              <li>Your orders are saved after checkout.</li>
              <li>Latest order count: {orderCount}</li>
              <li>Manage your preferences from dashboard.</li>
            </ul>
          </div>

          <Link
            href="/profile/orders"
            className="block w-full rounded-2xl bg-green-700 py-4 text-center font-semibold text-white transition hover:bg-green-600"
          >
            View My Orders
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
