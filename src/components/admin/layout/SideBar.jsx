"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Inventory", path: "/admin/inventory", icon: Package },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", path: "/admin/customers", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth(); //
  
   const handleLogout = async () => {
    await logout();
  };




  return (
    <aside className="w-64 bg-gray-900 text-white items-center gap-4 flex flex-col">
      <div className="text-3xl font-bold p-4">Admin Panel</div>
      <nav className=" felx-1 flex flex-col justify-around gap-7 px-4 py-5">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path}>
            <div
              className={`py-2 px-3 text-2xl items-center gap-2 items-center flex cursor-pointer rounded ${
                pathname === item.path
                  ? "bg-gray-700 font-bold"
                  : "hover:bg-gray-700"
              }`}
            >
              <item.icon size={18} /> {item.name}
            </div>
          </Link>
        ))}
      </nav>
      <button
                onClick={handleLogout}
                className="px-3 py-2 rounded text-3xl  hover:bg-red-700 flex items-center gap-3"
                title="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="text-white"
                >
                  <path
                    fill="currentColor"
                    d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"
                  />
                </svg>
                <span className="text-white text-2xl font-medium">Logout</span>
              </button>
    </aside>
  );
}
