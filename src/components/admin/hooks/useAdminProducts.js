// components/admin/useAdminProducts.js
"use client";
import { useEffect, useState } from "react";

export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState("");
  const [inventoryStats, setInventoryStats] = useState({});

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await fetch("http://localhost:5000/admin/products", {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(data.products || []);
      setInventoryStats({
        totalProducts: data.products?.length || 0,
        totalCategories: new Set(data.products.map(p => p.category)).size,
        totalVariants: data.products.reduce((acc, p) => acc + p.options.length, 0),
      });
    } catch (err) {
      setInventoryError("Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    await fetch(`http://localhost:5000/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return { products, productsLoading, inventoryError, inventoryStats, loadProducts, deleteProduct };
}
