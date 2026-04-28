"use client";

import Link from "next/link";
import { useAdminUsers } from "@/components/admin/hooks/useAdminUsers";
import { useAdminProducts } from "@/components/admin/hooks/useAdminProducts";
import { useAdminOrders } from "@/components/admin/hooks/useAdminOrders";
import { useAdminMessages } from "@/components/admin/hooks/useAdminMessages";

export default function AdminDashboardPage() {
  // Hooks
  const { users, loading: usersLoading } = useAdminUsers();
  const { products, productsLoading, inventoryStats } = useAdminProducts();
  const { orders, loading: ordersLoading } = useAdminOrders();
  const { messages, loading: messagesLoading } = useAdminMessages();

  
  const totalUsers = users.length;
  const totalProducts = inventoryStats.totalProducts;
  const totalOrders = orders.length;
  // const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const totalMessages = messages.length;

  const recentProducts = products.slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Dashboard Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card label="👤 Users" value={usersLoading ? "…" : totalUsers} />
        <Card label="📦 Products" value={productsLoading ? "…" : totalProducts} />
        <Card label="🛒 Orders" value={ordersLoading ? "…" : totalOrders} />
        <Card label="✉️ Messages" value={messagesLoading ? "…" : totalMessages} />
      </section>

      {/*  Links */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <p className="text-sm text-gray-500">Quick Access</p>
        <h2 className="text-2xl font-bold mt-1">Admin Overview</h2>

        <div className="flex flex-wrap gap-4 mt-6">
          <Link
            href="/admin/orders"
            className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 font-medium"
          >
            View Orders 
          </Link>

          <Link
            href="/admin/messages"
            className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 font-medium"
          >
            View Messages
          </Link>

        
        </div>
      </section>

      {/*  Products */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Inventory Snapshot</p>
            <h2 className="text-2xl font-bold mt-1"> Products</h2>
          </div>
          <Link
            href="/admin/inventory"
            className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 font-medium"
          >
            View Inventory
          </Link>
        </div>

        {productsLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-500">No products found yet. Add your first product.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div
                key={product._id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover bg-white"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {product.category} | {product.options.length} options
                    </p>
                  </div>
                </div>
                <p className="font-bold text-green-700 text-lg">
                  {Math.min(...product.options.map((opt) => opt.price))}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-3xl font-bold mt-3">{value}</h3>
    </div>
  );
}
