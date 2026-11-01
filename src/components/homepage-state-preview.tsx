"use client";

import { useState } from "react";
import { UpcomingEventsContent } from "@/components/upcoming-events";
import type { UpcomingEvent, UpcomingEventsState } from "@/lib/upcoming-events";

export function HomepageStatePreview({ events }: { events: UpcomingEvent[] }) {
  const [selected, setSelected] = useState("cards");
  const state: UpcomingEventsState = selected === "cards" ? { status: "ready", events }
    : selected === "empty" ? { status: "ready", events: [] }
    : { status: selected as "unavailable" | "loading" | "error" };
  return <>
    <div className="state-preview-controls" aria-label="Event state previews">
      {[["cards", "Cards"], ["loading", "Loading"], ["empty", "Empty"], ["error", "Error"], ["unavailable", "Not connected"]].map(([value, label]) => <button key={value} type="button" aria-pressed={selected === value} onClick={() => setSelected(value)}>{label}</button>)}
    </div>
    <UpcomingEventsContent state={state} preview />
  </>;
}
