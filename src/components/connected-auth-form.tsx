"use client";
import { useRouter } from "next/navigation";
import { AuthForm } from "./auth-form";
import { useAuth } from "./auth-provider";
import { authClient } from "@/lib/auth-client";
import { authError, safeReturnTo } from "@/lib/auth-policy";
import type { AuthFields } from "@/lib/form-validation";
export function ConnectedAuthForm({ mode, returnTo, googleEnabled }: { mode: "login" | "register"; returnTo: string; googleEnabled: boolean }) {
  const router = useRouter(); const { notify } = useAuth(); const destination = safeReturnTo(returnTo);
  async function complete(values: AuthFields, register: boolean) {
    const result = register ? await authClient.signUp.email({ name: values.name!.trim(), email: values.email, password: values.password, ...(values.image ? { image: values.image } : {}) }) : await authClient.signIn.email({ email: values.email, password: values.password });
    if (result.error) throw Error(authError(result.error.code, result.error.status));
    notify(register ? "Your account is ready. Welcome to NobleNest." : "Welcome back to NobleNest."); router.replace(destination); router.refresh();
  }
  return <AuthForm mode={mode} returnTo={destination} actions={{ login: values => complete(values, false), register: values => complete(values, true), ...(googleEnabled ? { google: async () => { const result = await authClient.signIn.social({ provider: "google", callbackURL: "/auth/complete?returnTo=" + encodeURIComponent(destination) }); if (result.error) throw Error(authError(result.error.code, result.error.status)); } } : {}) }} />;
}
