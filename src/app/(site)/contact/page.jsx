"use client";

import { useState } from "react";
import { z } from "zod";
import Input from "@/components/ui/Forms/Input";
import Label from "@/components/ui/Forms/Label";
import TextArea from "@/components/ui/Forms/Textarea";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter valid email").min(1, "Email is required"),
  message: z.string().min(1, "Message is required"),
});

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = contactSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);
      setSubmitted(false);
      return;
    }

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        const data = await res.json();
        setErrors({ general: data.error || "Something went wrong" });
      }
    } catch (err) {
      console.error("Error submitting message:", err);
      setErrors({ general: "Error. Try again later." });
    }
  };

  return (
    <div className="bg-green-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1B3022]">
            Contact Us 📞
          </h1>
        </div>

        <div className="bg-white rounded-2xl mx-auto w-[600px] shadow-md p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1B3022]">Send a Message</h2>
          </div>

          {submitted && (
            <div className="mb-6 bg-green-100 text-green-700 p-4 rounded-xl text-center">
              Message Sent Successfully ✅
            </div>
          )}

          {errors.general && (
            <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-xl text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" required>Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}

              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" required>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                />
                 {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="message" required>Message</Label>
              <TextArea
                id="message"
                rows={5}
                placeholder="Enter your message"
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
              />
               {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Send Message ✉️
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
