"use client";

import { Suspense } from "react";
import PurchaseForm from "@/app/(site)/purchase/PurchaseForm";

export default function CartPurchasePage() {
  return (
    <Suspense fallback={<div>Loading cart checkout...</div>}>
      <PurchaseForm />
    </Suspense>
  );
}
