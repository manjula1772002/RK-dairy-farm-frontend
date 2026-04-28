"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Helper: pick lowest price option
function getDefaultOption(product) {
  if (!product.options || product.options.length === 0) return null;
  return product.options.reduce(
    (min, opt) => (opt.price < min.price ? opt : min),
    product.options[0]
  );
}

export default function ProductPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [cartCount, setCartCount] = useState({});
  const [totalItems, setTotalItems] = useState(0);

  // Load products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : [];

        setProducts(productList);
      } catch (error) {
        console.log(error);
      }
    }

    loadProducts();
  }, []);

  // Load cart
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const counts = {};
    let total = 0;

    cart.forEach((item) => {
      counts[item._id] = (counts[item._id] || 0) + item.quantity;
      total += item.quantity;
    });

    setCartCount(counts);
    setTotalItems(total);
  }, []);

  const handleAddToCart = (item, option) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find(
      (cartItem) =>
        cartItem._id === item._id && cartItem.label === option.label
    );

    let updatedQuantity = 1;

    if (existing) {
      existing.quantity += 1;
      updatedQuantity = existing.quantity;
    } else {
      cart.push({
        _id: item._id,
        name: item.name,
        image: item.image,
        category: item.category,
        label: option.label,
        price: option.price,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setCartCount((prev) => ({
      ...prev,
      [item._id]: updatedQuantity,
    }));

    setTotalItems((prev) => prev + 1);
  };

  const increaseCount = (item, option) => {
    handleAddToCart(item, option);
  };

  const decreaseCount = (item, option) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const updatedCart = cart
      .map((cartItem) =>
        cartItem._id === item._id && cartItem.label === option.label
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
      .filter((cartItem) => cartItem.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const updatedItem = updatedCart.find(
      (cartItem) => cartItem._id === item._id && cartItem.label === option.label
    );

    setCartCount((prev) => ({
      ...prev,
      [item._id]: updatedItem ? updatedItem.quantity : 0,
    }));

    setTotalItems((prev) => Math.max(prev - 1, 0));
  };

  const handleBuyNow = (item, option) => {
    if (loading) return;

    const purchaseUrl = `/purchase/${item._id}?optionLabel=${encodeURIComponent(
      option.label
    )}&quantity=1`;

    if (!user) {
      localStorage.setItem("redirectAfterLogin", purchaseUrl);
      router.push("/login");
      return;
    }

    router.push(purchaseUrl);
  };

  // Filtering + Sorting
  let filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === "low") {
    filteredProducts.sort(
      (a, b) => getDefaultOption(a).price - getDefaultOption(b).price
    );
  }

  if (sort === "high") {
    filteredProducts.sort(
      (a, b) => getDefaultOption(b).price - getDefaultOption(a).price
    );
  }

  if (sort === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fresh Dairy Products 🥛</h1>

        <div className="bg-green-600 text-white px-5 py-2 rounded-lg">
          🛒 Cart ({totalItems})
        </div>
      </div>

      <div className="flex justify-center gap-5 mb-10">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 w-64 border rounded-lg"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Sort</option>
          <option value="name">Name</option>
          <option value="low">Low Price</option>
          <option value="high">High Price</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((item, index) => {
          const option = getDefaultOption(item);
          if (!option) return null;

          return (
            <div
              key={index}
              className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg transition"
            >
              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-full object-contain"
                />
              </div>

              <h2 className="font-semibold text-gray-800">{item.name}</h2>

              <div className="mt-3">
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  {option.label}
                </span>
              </div>

              <p className="text-green-600 font-bold mt-3 text-lg">
                ₹{option.price}
              </p>

              {cartCount[item._id] > 0 ? (
                <div className="flex items-center justify-between mt-3 border rounded-lg overflow-hidden">
                  <button
                    onClick={() => decreaseCount(item, option)}
                    className="w-1/3 py-2 text-lg"
                  >
                    -
                  </button>

                  <div className="w-1/3 text-center font-semibold">
                    {cartCount[item._id]}
                  </div>

                  <button
                    onClick={() => increaseCount(item, option)}
                    className="w-1/3 py-2 text-lg"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(item, option)}
                  className="w-full mt-3 py-2 bg-green-700 text-white rounded-full"
                >
                  Add
                </button>
              )}

              <button
                onClick={() => handleBuyNow(item, option)}
                className="w-full mt-2 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition font-semibold"
              >
                Buy Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
