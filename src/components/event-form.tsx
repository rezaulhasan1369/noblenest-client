"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/form-field";
import { validateEvent, type FieldErrors, type EventFields } from "@/lib/form-validation";
import { EVENT_CATEGORIES, EventApiError, eventErrorMessage, type ApiEvent, type EventInput } from "@/lib/event-api";
import { eventsApi } from "@/lib/event-client";
import { localEventDateToUtc, utcEventDateToLocal } from "@/lib/event-date";

export function EventForm({ initialEvent }: { initialEvent?: ApiEvent }) {
  const router = useRouter(), lock = useRef(false);
  const [errors, setErrors] = useState<FieldErrors>({}), [status, setStatus] = useState("");
  const [pending, setPending] = useState(false), [expired, setExpired] = useState(false);
  const editing = !!initialEvent, returnTo = initialEvent ? `/events/${initialEvent.id}/edit` : "/create-event";
  return <form className="event-form" noValidate aria-busy={pending} onSubmit={async event => {
    event.preventDefault(); if (lock.current) return;
    const form = event.currentTarget, data = new FormData(form);
    const values = Object.fromEntries(["title", "description", "eventType", "thumbnailUrl", "location", "eventDate"].map(key => [key, String(data.get(key) || "")])) as EventFields;
    const next = validateEvent(values); setStatus("");
    let eventDate = "";
    try { eventDate = initialEvent && values.eventDate === utcEventDateToLocal(initialEvent.eventDate) ? initialEvent.eventDate : localEventDateToUtc(values.eventDate); }
    catch { next.eventDate = "Choose a valid local date and time."; }
    setErrors(next);
    if (Object.keys(next).length) { (form.elements.namedItem(Object.keys(next)[0]) as HTMLElement)?.focus(); return; }
    lock.current = true; setPending(true);
    const input: EventInput = { ...values, eventDate, eventType: values.eventType as EventInput["eventType"] };
    try {
      const saved = initialEvent ? await eventsApi.update(initialEvent.id, input) : await eventsApi.create(input);
      setStatus(editing ? "Event updated." : "Event created."); router.push(`/events/${saved.id}`); router.refresh();
    } catch (failure) {
      setStatus(eventErrorMessage(failure)); setExpired(failure instanceof EventApiError && failure.status === 401);
      lock.current = false; setPending(false);
    }
  }}>
    <div className="form-grid">{[["title", "Event title", "text"], ["location", "Location", "text"], ["thumbnailUrl", "Thumbnail URL", "url"], ["eventDate", "Event date and time (your local time)", "datetime-local"]].map(([key, label, type]) => <FormField key={key} label={label} id={`event-${key}`} error={errors[key]}><input id={`event-${key}`} name={key} type={type} required maxLength={key === "title" ? 200 : key === "location" ? 300 : key === "thumbnailUrl" ? 2048 : undefined} defaultValue={key === "eventDate" ? initialEvent ? utcEventDateToLocal(initialEvent.eventDate) : "" : initialEvent?.[key as keyof EventFields]} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `event-${key}-error` : undefined} /></FormField>)}</div>
    <FormField label="Event type" id="event-eventType" error={errors.eventType}><select id="event-eventType" name="eventType" required defaultValue={initialEvent?.eventType || ""} aria-invalid={!!errors.eventType} aria-describedby={errors.eventType ? "event-eventType-error" : undefined}><option value="">Choose a type</option>{EVENT_CATEGORIES.map(type => <option key={type}>{type}</option>)}</select></FormField>
    <FormField label="Description" id="event-description" error={errors.description}><textarea id="event-description" name="description" rows={6} maxLength={5000} required defaultValue={initialEvent?.description} aria-invalid={!!errors.description} aria-describedby={errors.description ? "event-description-error" : undefined} /></FormField>
    <p className="form-notice">Your event will be saved to NobleNest. The selected date and time use your device&apos;s local timezone.</p>
    <button className="button button-solid" type="submit" disabled={pending || expired}>{pending ? "Saving..." : editing ? "Save event changes" : "Create Event"}</button>
    <p className="form-status" role="status">{status}</p>
    {expired && <Link className="text-link" href={`/login?returnTo=${encodeURIComponent(returnTo)}`}>Log in again</Link>}
  </form>;
}
