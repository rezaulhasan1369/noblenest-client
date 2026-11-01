export type ProtectedDestination = "create-event" | "manage-events" | "joined-events";

export type HeaderSession =
  | { status: "unavailable" }
  | { status: "signed-out"; loginHref: string }
  | {
      status: "signed-in";
      user: { displayName: string; imageUrl: string };
      protectedDestinations: Readonly<Partial<Record<ProtectedDestination, string>>>;
      logout: () => Promise<void>;
    };

export const UNAVAILABLE_SESSION: HeaderSession = { status: "unavailable" };

export const PROTECTED_LABELS: Readonly<Record<ProtectedDestination, string>> = {
  "create-event": "Create Event",
  "manage-events": "Manage Events",
  "joined-events": "Joined Events",
};

// No guessed routes: supply destinations only when their pages actually exist.
export function getPublicNavigation(upcomingEventsHref?: string) {
  return [
    { id: "home", label: "Home", href: "#home" },
    { id: "purpose", label: "Our purpose", href: "#our-purpose" },
    { id: "help", label: "Ways to help", href: "#ways-to-help" },
    { id: "upcoming-events", label: "Upcoming Events", href: upcomingEventsHref || null },
  ] as const;
}

export function getProtectedNavigation(session: HeaderSession) {
  if (session.status !== "signed-in") return [];
  return (Object.keys(PROTECTED_LABELS) as ProtectedDestination[]).flatMap(id => {
    const href = session.protectedDestinations[id];
    return href ? [{ id, label: PROTECTED_LABELS[id], href }] : [];
  });
}
