"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/components/admin/layout/layout.js";
// import AuthProvider from "@/context/AuthProvider";

export default function AdminLayout({ children }) {
  return (
    // <AuthProvider>
      <ProtectedAdmin>{children}</ProtectedAdmin>
    /* </AuthProvider> */
  );
}


function ProtectedAdmin({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== "admin") return null;

  return <Layout>{children}</Layout>;
}
