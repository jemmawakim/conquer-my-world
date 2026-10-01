import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <AuthCard title="Create your account" description="Start conquering your world.">
      <SignUpForm />
    </AuthCard>
  );
}
