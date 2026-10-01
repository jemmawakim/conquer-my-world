import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = { title: "Sign in" };

const CALLBACK_ERRORS: Record<string, string> = {
  invalid_callback: "That sign-in link is invalid. Please try again.",
  auth_failed: "That sign-in link has expired. Please sign in again.",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[]; error?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : null;
  const errorKey = typeof params.error === "string" ? params.error : null;

  return (
    <AuthCard title="Welcome back" description="Sign in to continue to your dashboard.">
      <SignInForm
        next={next}
        initialError={errorKey ? (CALLBACK_ERRORS[errorKey] ?? null) : null}
      />
    </AuthCard>
  );
}
