"use client";

import { usePathname } from "next/navigation";
import Header from "./Header.jsx";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return !isAdminRoute && <Header />;
}
