"use client";
import { useState } from "react";
import { FormField } from "@/components/form-field";
import { validateEvent, type FieldErrors, type EventFields } from "@/lib/form-validation";

export function EventForm({ editing = false }: { editing?: boolean }) {
  const [errors, setErrors] = useState<FieldErrors>({}); const [status, setStatus] = useState("");
  return <form className="event-form" noValidate onSubmit={event => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const values = Object.fromEntries(["title", "description", "eventType", "thumbnailUrl", "location", "eventDate"].map(key => [key, String(data.get(key) || "")])) as EventFields;
    const next = validateEvent(values); setErrors(next); setStatus("");
    if (Object.keys(next).length) { (form.elements.namedItem(Object.keys(next)[0]) as HTMLElement)?.focus(); return; }
    setStatus("Your form passes the interface checks. No event was created or updated; the event service is not connected.");
  }}>
    <div className="form-grid">{[["title", "Event title", "text"], ["location", "Location", "text"], ["thumbnailUrl", "Thumbnail URL", "url"], ["eventDate", "Event date and time (your local time)", "datetime-local"]].map(([key, label, type]) => <FormField key={key} label={label} id={`event-${key}`} error={errors[key]}><input id={`event-${key}`} name={key} type={type} required maxLength={key === "title" ? 200 : undefined} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `event-${key}-error` : undefined} /></FormField>)}</div>
    <FormField label="Event type" id="event-eventType" error={errors.eventType}><select id="event-eventType" name="eventType" required aria-invalid={!!errors.eventType} aria-describedby={errors.eventType ? "event-eventType-error" : undefined}><option value="">Choose a type</option>{["Cleanup", "Plantation", "Donation", "Community service"].map(type => <option key={type}>{type}</option>)}</select></FormField>
    <FormField label="Description" id="event-description" error={errors.description}><textarea id="event-description" name="description" rows={6} maxLength={5000} required aria-invalid={!!errors.description} aria-describedby={errors.description ? "event-description-error" : undefined} /></FormField>
    <p className="form-notice">UI preview only. Live event creation and updates are not connected.</p><button className="button button-solid" type="submit">{editing ? "Review event changes" : "Review initiative"}</button><p className="form-status" role="status">{status}</p>
  </form>;
}
