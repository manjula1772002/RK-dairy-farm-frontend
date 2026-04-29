"use client";

import FormError from "@/components/ui/Forms/FormError";
import Input from "@/components/ui/Forms/Input";
import Label from "@/components/ui/Forms/Label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const router = useRouter();
  const { login, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const proxyUrl = process.env.PROXY_URL || "http://localhost:5000";

       const response = await fetch(`${proxyUrl}/login`,
      //  const response = await fetch("http://localhost:5000/login",
      // const response = await fetch("/api/login",
         {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const loginData = await response.json();

      if (!response.ok) {
        alert(loginData.error || "Login failed");
        return;
      }

      if (loginData.user) {
        setUser(loginData.user);

        if (loginData.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          const redirectUrl = localStorage.getItem("redirectAfterLogin");

          if (redirectUrl) {
            localStorage.removeItem("redirectAfterLogin");
            router.push(redirectUrl);
          } else {
            router.push("/profile");
          }
        }

        return;
      }

      await login();
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to login user");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />
        <FormError message={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
        />
        <FormError message={errors.password?.message} />
      </div>
      <div>
        <button
          type="submit"
          className={
            `w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors duration-300` +
            (isValid ? "" : " opacity-50 cursor-not-allowed")
          }
          disabled={!isValid}
        >
          Login
        </button>
      </div>
      <a
        href="/register"
        className="text-green-600 hover:text-green-600 text-center text-sm block"
      >
        Don&apos;t have an account?<span className="font-medium hover:text-gray-700">Register here</span> 
      </a>
    </form>
  );
}
