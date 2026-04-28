"use client";

import Link from "next/link";
import {
  formatPrice,
  getLowestPrice,
} from "@/components/admin/utils";
import { useAdminProducts } from "@/components/admin/hooks/useAdminProducts";

export default function AdminInventoryPage() {
  const {
    products,
    productsLoading,
    inventoryError,
    inventoryStats,
    loadProducts,
    deleteProduct,
  } = useAdminProducts();

  return (
    <div className="space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card label="Total Products" value={inventoryStats.totalProducts} />
        <Card label="Categories" value={inventoryStats.totalCategories} />
        <Card label="Variants" value={inventoryStats.totalVariants} />
      </section>

      {/* Table */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Manage your inventory</p>
            <h2 className="text-2xl font-bold mt-1">Products</h2>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={loadProducts}
              className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 font-medium"
            >
              Refresh
            </button>

            <Link
              href="/admin/inventory/Add"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Add Product
            </Link>
          </div>
        </div>

        {inventoryError && (
          <p className="text-red-600 font-semibold mb-4">{inventoryError}</p>
        )}

        {productsLoading ? (
          <p className="text-gray-500">Loading inventory...</p>
        ) : products.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold">No products yet</h4>
            <p className="text-gray-500 mt-2">
              Add your first product to make the inventory live on the storefront.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 font-bold">Product</th>
                  <th className="text-left px-4 py-3 font-bold">Category</th>
                  <th className="text-left px-4 py-3 font-bold">Starting Price</th>
                  <th className="text-left px-4 py-3 font-bold">Options</th>
                  <th className="text-left px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-200">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover bg-gray-50"
                        />
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{product.category}</td>
                    <td className="px-4 py-4 font-medium">
                      {formatPrice(getLowestPrice(product.options))}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {product.options.map((option) => (
                          <span
                            key={`${product._id}-${option.label}`}
                            className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                          >
                            {option.label} | {formatPrice(option.price)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          if (window.confirm("Delete this product?")) {
                            deleteProduct(product._id);
                          }
                        }}
                        className="px-4 py-2 rounded-xl border border-gray-300 text-red-600 font-medium hover:bg-red-50"
                      >
                        Remove
                      </button>
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

// card local 
function Card({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-3xl font-bold mt-3">{value}</h3>
    </div>
  );
}
