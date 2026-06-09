import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page |  - Novotrend CRM",
  description: "Future of global trading Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}
