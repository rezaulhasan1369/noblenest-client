export function EventLoading({ message = "Loading upcoming events…", detail = false, count = 6, privateCards = false }: { message?: string; detail?: boolean; count?: number; privateCards?: boolean }) {
  const content = <div className="event-card-body"><span className="skeleton-line" /><span className="skeleton-line skeleton-title" /><span className="skeleton-line" /><span className="skeleton-line" /><span className="skeleton-line skeleton-action" /></div>;
  return <div className="events-loading" aria-busy="true">
    <p className="section-note" role="status">{message}</p>
    {detail ? <div className="detail-grid" aria-hidden="true"><div className="event-skeleton"><div className="skeleton-photo" />{content}</div><div className="detail-panel event-skeleton">{content}</div></div>
      : <div className="events-grid" aria-hidden="true">{Array.from({ length: count }, (_, index) => <div className={`event-skeleton${privateCards ? " skeleton-private" : ""}`} key={index}><div className="skeleton-photo" />{content}</div>)}</div>}
  </div>;
}
