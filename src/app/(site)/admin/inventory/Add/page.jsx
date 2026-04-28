"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";

import Input from "@/components/ui/Forms/Input";
import Label from "@/components/ui/Forms/Label";
import FormError from "@/components/ui/Forms/FormError";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category: z.string().min(2, "Category is required"),
  image: z
    .any()
    .refine((file) => file, "Product image is required"),
});

const initialOption = {
  label: "",
  price: "",
};

export default function NewInventoryPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    category: "",
    image: null,
    options: [{ ...initialOption }],
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [loading, user, router]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      updateField("image", file);
    }
  };

  const updateOption = (index, field, value) => {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index
          ? { ...option, [field]: value }
          : option
      ),
    }));
  };

  const addOption = () => {
    setForm((current) => ({
      ...current,
      options: [...current.options, { ...initialOption }],
    }));
  };

  const removeOption = (index) => {
    setForm((current) => ({
      ...current,
      options:
        current.options.length === 1
          ? current.options
          : current.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPageError("");

    const validation = productSchema.safeParse({
      name: form.name,
      category: form.category,
      image: form.image,
    });

    if (!validation.success) {
      setErrors(z.flattenError(validation.error).fieldErrors);
      return;
    }

    const invalidOption = form.options.some(
      (option) =>
        !option.label.trim() ||
        !option.price ||
        Number(option.price) <= 0
    );

    if (invalidOption) {
      setPageError("Please fill all option fields correctly.");
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("image", form.image);

      formData.append(
        "options",
        JSON.stringify(
          form.options.map((option) => ({
            label: option.label,
            price: Number(option.price),
          }))
        )
      );

      const response = await fetch(
        "http://localhost:5000/admin/products",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setPageError(data.message || "Failed to upload product");
        return;
      }

      router.push("/admin/inventory");
    } catch {
      setPageError("Failed to upload product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Add New Product
        </h1>

        {pageError ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {pageError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name" required>
                Product Name
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  updateField("name", e.target.value)
                }
                placeholder="Milk"
              />
              <FormError message={errors.name?.[0]} />
            </div>

            <div>
              <Label htmlFor="category" required>
                Category
              </Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) =>
                  updateField("category", e.target.value)
                }
                placeholder="Dairy"
              />
              <FormError message={errors.category?.[0]} />
            </div>
          </div>

          <div>
            <Label htmlFor="image" required>
              Product Image
            </Label>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mb-4 border"
              />
            )}

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <FormError message={errors.image?.[0]} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Product Options</h2>

              <button
                type="button"
                onClick={addOption}
                className="px-4 py-2 rounded-lg border border-gray-300"
              >
                Add Option
              </button>
            </div>

            {form.options.map((option, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-5"
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label required>Label</Label>
                    <Input
                      value={option.label}
                      onChange={(e) =>
                        updateOption(
                          index,
                          "label",
                          e.target.value
                        )
                      }
                      placeholder="500 ml"
                    />
                  </div>

                  <div>
                    <Label required>Price</Label>
                    <Input
                      type="number"
                      value={option.price}
                      onChange={(e) =>
                        updateOption(
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      placeholder="40"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="mt-4 px-4 py-2 border border-red-500 text-red-600 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-700 text-white py-4 rounded-xl font-semibold hover:bg-green-600"
          >
            {submitting ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </div>
    </div>
  );
}