"use client";

import { useRef, useState } from "react";
import { ArrowIcon } from "@/components/arrow-icon";

export function NewsletterSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);
  return <section id="newsletter" className="newsletter-section" aria-labelledby="newsletter-heading" tabIndex={-1}>
    <div className="content-width newsletter-inner">
      <div><p className="eyebrow">Stay connected</p><h2 id="newsletter-heading">Get community updates<br />in your inbox.</h2><p>A future home for community stories, meaningful activities, and little ways to get involved.</p></div>
      <form className="newsletter-form" noValidate onSubmit={event => {
        event.preventDefault();
        const input = inputRef.current;
        if (!input || !input.validity.valid) {
          setInvalid(true); setMessage("Enter a valid email address to preview the form."); input?.focus(); return;
        }
        setInvalid(false);
        input.value = "";
        setMessage("This is a design preview. No subscription was created, and your email was not sent or saved.");
      }}>
        <label htmlFor="newsletter-email">Your email address</label>
        <div className="newsletter-input-row"><input ref={inputRef} id="newsletter-email" type="email" autoComplete="email" required maxLength={254} placeholder="Your email address" aria-invalid={invalid || undefined} aria-describedby="newsletter-note newsletter-status" onInput={() => { setInvalid(false); setMessage(""); }} /><button className="button button-light" type="submit">Subscribe <ArrowIcon /></button></div>
        <p id="newsletter-note">Design preview only. We don’t send or save your address.</p>
        <p id="newsletter-status" role="status" aria-live="polite">{message}</p>
      </form>
    </div>
  </section>;
}
