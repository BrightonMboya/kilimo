"use client";

import { JSX, SVGProps } from "react";
import BillingInfo from "./_components/BillingInfo";
import PaymentHistory from "./_components/PaymentHistory";
import BillingSetting from "./_components/BillingSettings";

export default function Component() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-6 md:pl-[70px]">
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <BillingInfo />
            <BillingSetting />
            <PaymentHistory />
          </div>
        </div>
      </main>
    </div>
  );
}

function Package2Icon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}
