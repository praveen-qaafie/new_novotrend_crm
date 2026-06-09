import SupportQuery from "@/components/support/SupportQuery";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Images |  - Novotrend CRM",
  description: "This is Next.js Images page for  - Next.js Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Query() {
  return <SupportQuery />;
}
