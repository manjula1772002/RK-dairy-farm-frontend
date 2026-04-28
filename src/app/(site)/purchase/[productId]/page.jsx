"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import PurchaseForm from "@/app/(site)/purchase/PurchaseForm";

export default function ProductPurchasePage() {
  const params = useParams();

  return (
    <Suspense fallback={<div>Loading purchase...</div>}>
      <PurchaseForm productId={params.productId} />
    </Suspense>
  );
}
