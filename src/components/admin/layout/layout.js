// components/admin/Layout.js
"use client";

import Sidebar from "./SideBar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
   
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
   
  );
}
