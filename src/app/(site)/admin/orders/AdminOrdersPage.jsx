"use client";

import { useAdminOrders } from "@/components/admin/hooks/useAdminOrders";
import { formatPrice } from "@/components/admin/utils";

const ORDER_STATUS = [
  "Pending",
  "Confirmed",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const { orders, loading, error, updateStatus } = useAdminOrders();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;

  return (
    <div className="space-y-8">
     
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card label="Total Orders" value={totalOrders} />
        <Card label="Pending Orders" value={pendingOrders} />
      </section>

      {/* Table */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Review recent orders</p>
          <h2 className="text-2xl font-bold mt-1">Orders</h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Order</th>
                  <th className="px-4 py-3 text-left font-bold">Customer</th>
                  <th className="px-4 py-3 text-left font-bold">Items</th>
                  <th className="px-4 py-3 text-left font-bold">Total</th>
                  <th className="px-4 py-3 text-left font-bold">Status</th>
                  <th className="px-4 py-3 text-left font-bold">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-200">
                    <td className="px-4 py-4">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-4">
                      <div>{order.user?.name || "Customer"}</div>
                      <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      {order.items?.map((item) => (
                        <div key={`${order._id}-${item.product}-${item.label}`}>
                          {item.name} ({item.label}) x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 outline-none"
                      >
                        {ORDER_STATUS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
