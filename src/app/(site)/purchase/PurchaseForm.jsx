"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import FormError from "@/components/ui/Forms/FormError";
import Input from "@/components/ui/Forms/Input";
import Label from "@/components/ui/Forms/Label";
import TextArea from "@/components/ui/Forms/Textarea";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10 digit phone number"),
  houseNo: z.string().optional(),
  street: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter a valid 6 digit pincode"),
});

const initialAddress = {
  fullName: "",
  phone: "",
  houseNo: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

export default function PurchaseForm({ productId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [address, setAddress] = useState(initialAddress);
  const [errors, setErrors] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [product, setProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");

  const optionLabel = searchParams.get("optionLabel");
  const quantity = Number(searchParams.get("quantity") || 1);
  const isCartCheckout = !productId;

  useEffect(() => {
    if (!loading && !user) {
      localStorage.setItem(
        "redirectAfterLogin",
        productId
          ? `/purchase/${productId}?optionLabel=${encodeURIComponent(optionLabel || "")}&quantity=${quantity}`
          : "/purchase",
      );
      router.push("/login");
    }
  }, [loading, optionLabel, productId, quantity, router, user]);

  useEffect(() => {
    if (!isCartCheckout) return;

    try {
      setCartItems(JSON.parse(localStorage.getItem("cart") || "[]"));
    } catch {
      setCartItems([]);
    }
  }, [isCartCheckout]);

  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        const products = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
            ? data.products
            : [];

        setProduct(products.find((item) => item._id === productId) || null);
      } catch {
        setPageError("Failed to load product.");
      }
    }

    loadProduct();
  }, [productId]);

  const selectedOption = useMemo(() => {
    if (!product) return null;
    return product.options.find((option) => option.label === optionLabel) || product.options[0];
  }, [optionLabel, product]);

  const summaryItems = useMemo(() => {
    if (isCartCheckout) return cartItems;
    if (!product || !selectedOption) return [];

    return [
      {
        _id: product._id,
        name: product.name,
        image: product.image,
        label: selectedOption.label,
        price: selectedOption.price,
        quantity,
      },
    ];
  }, [cartItems, isCartCheckout, product, quantity, selectedOption]);

  const totalAmount = summaryItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddress((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPageError("");

    const validation = addressSchema.safeParse(address);
    if (!validation.success) {
      setErrors(z.flattenError(validation.error).fieldErrors);
      return;
    }

    if (!summaryItems.length) {
      setPageError("No products selected for checkout.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const body = isCartCheckout
        ? {
            items: summaryItems.map((item) => ({
              productId: item._id,
              optionLabel: item.label,
              quantity: item.quantity,
            })),
            address: validation.data,
          }
        : {
            productId,
            optionLabel: selectedOption.label,
            quantity,
            address: validation.data,
          };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setPageError(data.message || "Failed to place order.");
        return;
      }
 
      if (isCartCheckout) {
        localStorage.removeItem("cart");
        setCartItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
      }
    
      router.push("/profile/orders");
    } catch {
      setPageError("Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || (!user && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Delivery Address</h1>
          <p className="mt-2 text-sm text-gray-500">Payment method is Cash on Delivery only.</p>

          {pageError ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {pageError}
            </div>
          ) : null}

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="fullName" required>Full Name</Label>
              <Input id="fullName" name="fullName" value={address.fullName} onChange={handleChange} />
              <FormError message={errors.fullName?.[0]} />
            </div>

            <div>
              <Label htmlFor="phone" required>Phone Number</Label>
              <Input id="phone" name="phone" value={address.phone} onChange={handleChange} />
              <FormError message={errors.phone?.[0]} />
            </div>

            <div>
              <Label htmlFor="houseNo">House No</Label>
              <Input id="houseNo" name="houseNo" value={address.houseNo} onChange={handleChange} required={false} />
              <FormError message={errors.houseNo?.[0]} />
            </div>

            <div>
              <Label htmlFor="pincode" required>Pincode</Label>
              <Input id="pincode" name="pincode" value={address.pincode} onChange={handleChange} />
              <FormError message={errors.pincode?.[0]} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="street" required>Street Address</Label>
              <TextArea id="street" name="street" value={address.street} onChange={handleChange} required />
              <FormError message={errors.street?.[0]} />
            </div>

            <div>
              <Label htmlFor="city" required>City</Label>
              <Input id="city" name="city" value={address.city} onChange={handleChange} />
              <FormError message={errors.city?.[0]} />
            </div>

            <div>
              <Label htmlFor="state" required>State</Label>
              <Input id="state" name="state" value={address.state} onChange={handleChange} />
              <FormError message={errors.state?.[0]} />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="font-semibold text-green-800">Cash on Delivery</p>
            <p className="text-sm text-green-700">Pay after your order reaches your address.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-xl bg-green-700 py-4 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

          <div className="mt-5 space-y-4">
            {summaryItems.map((item) => (
              <div key={`${item._id}-${item.label}`} className="flex gap-3 border-b border-gray-100 pb-4">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                ) : null}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.label} x {item.quantity}</p>
                  <p className="mt-1 font-semibold text-green-700">Rs.{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-green-700">Rs.{totalAmount}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
