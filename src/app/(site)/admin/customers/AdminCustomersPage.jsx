"use client";

import { useAdminUsers } from "@/components/admin/hooks/useAdminUsers";
import { useState } from "react";

export default function AdminCustomersPage() {
  const { users, loading, error } = useAdminUsers();
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Customers</p>
          <h3 className="text-3xl font-bold mt-3">{totalUsers}</h3>
        </div>
      </section>

      {/* Customers Table */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Manage registered users</p>
            <h2 className="text-2xl font-bold mt-1">Customers</h2>
          </div>

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-1/3"
          />
        </div>

        {error ? (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-500">No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 font-bold">Name</th>
                  <th className="text-left px-4 py-3 font-bold">Email</th>
                  <th className="text-left px-4 py-3 font-bold">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t border-gray-200">
                    <td className="px-4 py-4">{user.name}</td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          user.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
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
