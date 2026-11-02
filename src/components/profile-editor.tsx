"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { authError } from "@/lib/auth-policy";
import { profileUpdateInput, validateProfile, type FieldErrors } from "@/lib/form-validation";
import { useAuth } from "./auth-provider";
import { FormField } from "./form-field";

type ProfileUser = { id: string; name: string; email: string; image?: string | null };
export const ProfileEditor: ComponentType<{ user: ProfileUser }> = () => {
  const session = authClient.useSession();
  if (session.isPending) return <p className="section-note" role="status" aria-busy="true">Verifying your profile session...</p>;
  if (!session.data?.user?.id || session.error) return <p role="status">Your session could not be verified. <Link href="/login?returnTo=%2Fprofile">Log in again</Link></p>;
  const current = session.data.user;
  return <ProfileFields key={current.id} user={current} refresh={async () => { await session.refetch(); }} />;
};
function ProfileFields({ user, refresh }: { user: ProfileUser; refresh: () => Promise<void> }) {
  const router = useRouter(), { notify } = useAuth(), lock = useRef(false);
  const [pending, setPending] = useState(false), [status, setStatus] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  return <section className="auth-panel profile-card">
    <Image key={user.image} src={user.image || "/images/profile-placeholder.svg"} alt="Your profile photo" width={80} height={80} unoptimized />
    <p className="eyebrow">A little good starts with you</p><h2>{user.name}</h2><p className="profile-email">{user.email}</p><span className="profile-status">Signed in to NobleNest</span>
    <form className="event-form" noValidate aria-busy={pending} onSubmit={async event => {
      event.preventDefault(); if (lock.current) return;
      const form = event.currentTarget, data = new FormData(form);
      const values = { name: String(data.get("name") || "").trim(), image: String(data.get("image") || "").trim() };
      const next = validateProfile(values); setErrors(next); setStatus("");
      if (Object.keys(next).length) { (form.elements.namedItem(Object.keys(next)[0]) as HTMLElement)?.focus(); return; }
      lock.current = true; setPending(true);
      try {
        const result = await authClient.updateUser(profileUpdateInput(values));
        if (result.error) { setStatus(authError(result.error.code, result.error.status)); return; }
        setStatus("Your profile has been updated."); notify("Your profile has been updated.");
        await refresh(); router.refresh();
      } catch { setStatus("Your profile could not be updated. Please check your connection and session."); }
      finally { lock.current = false; setPending(false); }
    }}>
      <FormField label="Display name" id="profile-name" error={errors.name}><input id="profile-name" name="name" autoComplete="name" required maxLength={100} defaultValue={user.name} aria-invalid={!!errors.name} aria-describedby={errors.name ? "profile-name-error" : undefined} /></FormField>
      <FormField label="Profile photo URL" id="profile-image" error={errors.image}><input id="profile-image" name="image" type="url" autoComplete="url" required maxLength={2048} defaultValue={user.image || ""} aria-invalid={!!errors.image} aria-describedby={errors.image ? "profile-image-error" : undefined} /></FormField>
      <p className="form-hint">Your email and account permissions cannot be changed here.</p>
      <button className="button button-solid" type="submit" disabled={pending}>{pending ? "Saving profile..." : "Save profile"}</button><p className="form-status" role="status">{status}</p>
    </form><Link href="/joined-events" className="text-link">Your community journey</Link>
  </section>;
}
