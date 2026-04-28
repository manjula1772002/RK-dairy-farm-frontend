"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const Header = () => {
  const pathName = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Update cart count when component mounts or storage changes
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    updateCartCount();
    
    // Listen for storage changes
    window.addEventListener("storage", updateCartCount);
    // Also listen for custom events from the same window
    window.addEventListener("cartUpdated", updateCartCount);
    
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);


  return (
    <header className="bg-[#FDFBF7]">
      <nav className="flex justify-between items-center px-12 py-1">
        <div className="flex">
          <img src="/logo.svg" width="90px" alt="logo" />
          <h1 className="text-[#1B3022] font-bold text-2xl px-2 py-1 rounded">
            RK Dairy Farm
          </h1>
        </div>
        <div>
          <ul className="list-none flex head_li space-x-8 text-[#1B3022] items-center font-medium">
            <li>
              <Link
                href="/"
                className={` font-bold hover:text-white hover:bg-[#E5B80B]  px-2 py-1 rounded ${pathName === "/" ? "active" : ""} `}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`font-bold hover:bg-[#E5B80B] hover:text-white px-2 py-1 rounded  ${pathName === "/about" ? "active" : ""} `}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/product"
                className={` ${pathName === "/product" ? "active" : ""} font-bold hover:bg-[#E5B80B] hover:text-white px-2 py-1 rounded `}
              >
                Product
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={` ${pathName === "/contact" ? "active" : ""} font-bold hover:bg-[#E5B80B] hover:text-white px-2 py-1 rounded `}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className={` ${pathName === "/cart" ? "active" : ""} font-bold img_head hover:bg-[#E5B80B] hover:text-white px-2 py-1 rounded transition-all duration-200 flex items-center gap-2 relative`}
              >
                <img src="/shopping_cart.svg" alt="Cart" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-gray-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <div>
                {!isAuthenticated ? (<Link
                  href="/login"
                  className={` ${pathName === "/login" ? "active" : "/login ? /profile"} font-bold img_head hover:bg-[#E5B80B]  px-2 py-1 rounded transition-all duration-200 flex items-center gap-2 relative`}
                >
                  <img src="/profile_login.svg" alt="Login" />


                </Link>
                ) : (<div className="flex items-center space-x-3">
                  <span className="text-gray-500">Welcome, {user.name}</span>
                 
                 <Link href="/profile"> <img
                    className="w-10 h-10 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=128`}
                    alt="Rounded avatar"
                  /></Link>
                  <button
                    onClick={() => logout()}
                    className="px-2 py-1 rounded bg-gray-500 hover:bg-red-700 "
                    title="Logout"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        fill="currentColor"
                        d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"
                      />
                    </svg>
                  </button>
                </div>)}


              </div>

            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
