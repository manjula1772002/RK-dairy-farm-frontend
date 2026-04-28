"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductPage from "./productpage";

export default function Home() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [cartCount, setCartCount] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({});

  const router = useRouter();


  const products = [
    {
      id: 1,
      name: "Milk",
      image: "/images/milk.png",
      options: [
        { label: "250ml", price: 25 },
        { label: "500ml", price: 40 },
        { label: "1L", price: 75 },
      ],
    },
    {
      id: 2,
      name: "Curd",
      image: "/images/curd.png",
      options: [
        { label: "100g", price: 20 },
        { label: "250g", price: 28 },
        { label: "500g", price: 35 },
      ],
    },
    {
      id: 3,
      name: "Ghee",
      image: "/images/ghee.png",
      options: [
        { label: "100g", price: 60 },
        { label: "250g", price: 95 },
        { label: "500g", price: 120 },
      ],
    },
    {
      id: 4,
      name: "Paneer",
      image: "/images/paneer.png",
      options: [
        { label: "200g", price: 90 },
        { label: "300g", price: 120 },
        { label: "500g", price: 180 },
      ],
    },
    {
      id: 5,
      name: "Cheese",
      image: "/images/cheese.png",
      options: [
        { label: "100g", price: 80 },
        { label: "200g", price: 150 },
        { label: "500g", price: 320 },
      ],
    },
    {
      id: 6,
      name: "Butter",
      image: "/images/butter.png",
      options: [
        { label: "100g", price: 60 },
        { label: "250g", price: 120 },
        { label: "500g", price: 250 },
      ],
    },
  ];

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const counts = {};
    let total = 0;

    cart.forEach((item) => {
      counts[item.id] = item.quantity;
      total += item.quantity;
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartCount(counts);
    setTotalItems(total);
  }, []);

  
  const handleAddToCart = (item) => {
    const option = selectedVariant[item.id] || item.options[0];

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id && cartItem.label === option.label,
    );

    let updatedQuantity = 1;

    if (existingItem) {
      existingItem.quantity += 1;
      updatedQuantity = existingItem.quantity;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        image: item.image,
        label: option.label,
        price: option.price,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setCartCount((prev) => ({
      ...prev,
      [item.id]: updatedQuantity,
    }));

    setTotalItems((prev) => prev + 1);
    
    // Notify header to update cart badge
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseCount = (item) => handleAddToCart(item);

  const decreaseCount = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const updatedCart = cart
      .map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem,
      )
      .filter((cartItem) => cartItem.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const updatedItem = updatedCart.find((cartItem) => cartItem.id === item.id);

    setCartCount((prev) => ({
      ...prev,
      [item.id]: updatedItem ? updatedItem.quantity : 0,
    }));

    setTotalItems((prev) => Math.max(prev - 1, 0));
    
    // Notify header to update cart badge
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // SEARCH + SORT
  let filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (sort === "low") {
    filteredProducts.sort((a, b) => a.options[0].price - b.options[0].price);
  } else if (sort === "high") {
    filteredProducts.sort((a, b) => b.options[0].price - a.options[0].price);
  } else if (sort === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    // <div className="max-w-7xl mx-auto p-8">
    //   {/* HEADER */}
    //   <div className="flex justify-between items-center mb-8">
    //     <h1 className="text-3xl font-bold">Fresh Dairy Products 🥛</h1>

    //     <div className="bg-green-600 text-white px-5 py-2 rounded-lg">
    //       🛒 Cart ({totalItems})
    //     </div>
    //   </div>

    //   {/* SEARCH + SORT */}
    //   <div className="flex justify-center gap-5 mb-10">
    //     <input
    //       type="text"
    //       placeholder="Search product..."
    //       value={search}
    //       onChange={(e) => setSearch(e.target.value)}
    //       className="px-4 py-2 w-64 border rounded-lg focus:ring-2 focus:ring-green-500"
    //     />

    //     <select
    //       value={sort}
    //       onChange={(e) => setSort(e.target.value)}
    //       className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
    //     >
    //       <option value="">Sort</option>
    //       <option value="name">Name</option>
    //       <option value="low">Low Price</option>
    //       <option value="high">High Price</option>
    //     </select>
    //   </div>

    //   {/* PRODUCTS */}
    //   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
    //     {filteredProducts.map((item) => (
    //       <div
    //         key={item.id}
    //         className="group bg-white border border-gray-100 rounded-2xl p-4 
    //         shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
    //       >
    //         {/* IMAGE */}
    //         <div className="bg-gray-50 rounded-xl p-3 mb-3">
    //           <img
    //             src={item.image}
    //             className="h-32 w-full object-contain group-hover:scale-105 transition"
    //           />
    //         </div>

    //         {/* NAME */}
    //         <h2 className="font-semibold text-gray-800">{item.name}</h2>

    //         {/* OPTIONS */}
    //         <div className="flex gap-2 mt-3 flex-wrap">
    //           {item.options.map((opt) => (
    //             <button
    //               key={opt.label}
    //               onClick={() =>
    //                 setSelectedVariant((prev) => ({
    //                   ...prev,
    //                   [item.id]: opt,
    //                 }))
    //               }
    //               className={`px-3 py-1 text-xs rounded-full border transition
    //               ${selectedVariant[item.id]?.label === opt.label
    //                   ? "bg-green-600 text-white border-green-600"
    //                   : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
    //                 }`}
    //             >
    //               {opt.label}
    //             </button>
    //           ))}
    //         </div>

    //         {/* PRICE */}
    //         <p className="text-green-600 font-bold mt-3 text-lg">
    //           ₹{selectedVariant[item.id]?.price || item.options[0].price}
    //         </p>

    //         {/* CART */}
    //         {cartCount[item.id] > 0 ? (
    //           <div className="flex items-center justify-between mt-3 border border-gray-200 rounded-lg overflow-hidden w-full">

    //             {/* MINUS */}
    //             <button
    //               onClick={() => decreaseCount(item)}
    //               className="w-1/3 py-2 text-lg font-semibold text-gray-600 
    // hover:bg-gray-100 transition"
    //             >
    //               −
    //             </button>

    //             {/* COUNT */}
    //             <div className="w-1/3 text-center font-semibold text-gray-800">
    //               {cartCount[item.id]}
    //             </div>

    //             {/* PLUS */}
    //             <button
    //               onClick={() => increaseCount(item)}
    //               className="w-1/3 py-2 text-lg font-semibold text-green-600 
    // hover:bg-green-50 transition"
    //             >
    //               +
    //             </button>

    //           </div>
    //         ) : (
    //           <button
    //             onClick={() => handleAddToCart(item)}
    //             className="w-full mt-3 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
    //           >
    //             Add
    //           </button>
    //         )}
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <ProductPage />
  );
}
