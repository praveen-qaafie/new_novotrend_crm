import SupportChat from "@/components/support/SupportChat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Images |  - Novotrend CRM",
  description: "This is Next.js Images page for  - Next.js Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Query() {
  return (
    <>
      <SupportChat />
    </>
  );
}
