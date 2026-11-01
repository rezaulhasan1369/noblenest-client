"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { HeaderSession } from "@/lib/header-navigation";
import { sessionUserForDisplay, temporarySessionError } from "@/lib/session-display";
export type PublicUser = { name: string; email: string; image?: string | null };
const AuthContext = createContext<{ session: HeaderSession; notify: (text: string) => void }>({ session: { status: "unavailable" }, notify: () => {} });
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ initialUser, children }: { initialUser: PublicUser | null; children: React.ReactNode }) {
  const state = authClient.useSession(); const router = useRouter(); const [toast, setToast] = useState("");
  const user = sessionUserForDisplay<PublicUser>(initialUser, state);
  const sessionWarning = temporarySessionError(state.error) ? "Session check is temporarily unavailable. Please try again shortly." : "";
  const notify = useCallback((text: string) => { setToast(text); }, []);
  const session: HeaderSession = user ? { status: "signed-in", user: { displayName: user.name, imageUrl: user.image || "/images/profile-placeholder.svg" }, protectedDestinations: { "create-event": "/create-event", "manage-events": "/manage-events", "joined-events": "/joined-events" }, logout: async () => { const result = await authClient.signOut(); if (result.error) throw Error("Logout unavailable"); notify("You have logged out."); router.replace("/"); router.refresh(); } } : { status: "signed-out", loginHref: "/login" };
  return <AuthContext.Provider value={{ session, notify }}>{children}<div role="status" aria-atomic="true" className="auth-toast">{toast ? <><span>{toast}</span><button type="button" aria-label="Dismiss notification" onClick={() => setToast("")}>Close</button></> : sessionWarning ? <span>{sessionWarning}</span> : null}</div></AuthContext.Provider>;
}
