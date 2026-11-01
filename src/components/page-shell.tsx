

export function PageShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <main id="main-content" tabIndex={-1} className="inner-page content-width">
    <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-lead">{description}</p>{children}
  </main>;
}

export function ProtectedPreviewNotice() {
  return <div className="interface-notice"><p>Your account is verified. Event data and saving will be connected in a later phase.</p></div>;
}

export function DataUnavailable({ title, description }: { title: string; description: string }) {
  return <div className="data-unavailable" role="status"><span className="small-seed" aria-hidden="true" /><h2>{title}</h2><p>{description}</p></div>;
}
