"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { FormField } from "@/components/form-field";
import { validateAuth, type FieldErrors, type AuthFields } from "@/lib/form-validation";
import "./auth-form.css";

export type AuthFormActions = { login: (values: AuthFields) => Promise<void>; register: (values: AuthFields) => Promise<void>; google?: () => Promise<void> };

export function AuthForm({ mode, actions, returnTo = "/profile" }: { mode: "login" | "register"; actions?: AuthFormActions; returnTo?: string }) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const submitting = useRef(false);
  const registering = mode === "register";
  return <div className="auth-panel">
    {!actions && <p className="form-notice">Interface preview. Authentication is not connected yet. Nothing will be submitted or saved.</p>}
    <form noValidate onSubmit={async event => {
      event.preventDefault(); if (submitting.current) return; const form = event.currentTarget;
      const data = new FormData(form); const values: AuthFields = { name: String(data.get("name") || "").trim(), email: String(data.get("email") || "").trim(), password: String(data.get("password") || ""), image: String(data.get("image") || "").trim() };
      const next = validateAuth(values, mode); setErrors(next); setStatus("");
      if (Object.keys(next).length) { (form.elements.namedItem(Object.keys(next)[0]) as HTMLElement)?.focus(); return; }
      if (!actions) { setStatus("The form is ready for integration. No account or session was created."); return; }
      submitting.current = true; setPending(true);
      try { await actions[mode](values); } catch (error) { setStatus(error instanceof Error ? error.message : "Authentication could not be completed."); } finally { submitting.current = false; setPending(false); }
    }}>
      {registering && <FormField label="Your name" id="auth-name" error={errors.name}><input id="auth-name" name="name" autoComplete="name" maxLength={100} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "auth-name-error" : undefined} /></FormField>}
      <FormField label="Email address" id="auth-email" error={errors.email}><input id="auth-email" name="email" type="email" autoComplete="email" maxLength={254} required aria-invalid={!!errors.email} aria-describedby={errors.email ? "auth-email-error" : undefined} /></FormField>
      {registering && <FormField label="Photo URL (optional)" id="auth-image" error={errors.image}><input id="auth-image" name="image" type="url" autoComplete="url" placeholder="https://…" aria-invalid={!!errors.image} aria-describedby={errors.image ? "auth-image-error" : undefined} /></FormField>}
      <FormField label="Password" id="auth-password" error={errors.password}><div className="auth-password-control"><input id="auth-password" name="password" type={passwordVisible ? "text" : "password"} autoComplete={registering ? "new-password" : "current-password"} maxLength={128} required aria-invalid={!!errors.password} aria-describedby={errors.password ? "auth-password-error" : registering ? "password-hint" : undefined} /><button className="auth-password-visibility" type="button" aria-label={passwordVisible ? "Hide password" : "Show password"} aria-pressed={passwordVisible} aria-controls="auth-password" onClick={() => setPasswordVisible(value => !value)}>{passwordVisible ? "Hide" : "Show"}</button></div></FormField>
      {registering && <p id="password-hint" className="form-hint">At least 6 characters, including an uppercase and a lowercase letter.</p>}
      <button type="submit" className="button button-solid" disabled={pending}>{pending ? "Please wait…" : registering ? "Create account" : "Login"}</button>
      <p role="status" className="form-status">{status}</p>
    </form>
    {!registering && <><div className="form-divider"><span>or</span></div><button type="button" className="button button-outline google-button" disabled={!actions?.google || pending} onClick={async () => { try { await actions?.google?.(); } catch { setStatus("Google sign-in could not be started."); } }}>Continue with Google</button>{!actions?.google && <p className="form-hint">Google sign-in is not configured.</p>}</>}
    <p className="auth-switch">{registering ? "Already have an account?" : "New to NobleNest?"} <Link href={(registering ? "/login" : "/register") + "?returnTo=" + encodeURIComponent(returnTo)}>{registering ? "Login" : "Create an account"}</Link></p>
  </div>;
}
