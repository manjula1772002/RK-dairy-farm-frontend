"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between bg-white shadow p-4">
      <h1 className="text-lg font-semibold">Welcome back</h1>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-600">
              <span className="font-medium">
                {user.name?.split(" ")[0]}
              </span>
            </span>

            <div className="flex items-center space-x-3">
              <span className="text-gray-500">Welcome, {user.name}</span>

              <Link href="/profile">
                <img
                  className="w-10 h-10 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=random&color=fff&size=128`}
                  alt="Rounded avatar"
                />
              </Link>

              
            </div>
          </>
        ) : (
          <Link href="/login" className="text-gray-600 hover:text-black">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
