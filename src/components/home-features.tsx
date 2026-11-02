const features = [
  { title: "Discover your community", description: "Explore upcoming activities and find an initiative that matters to you.", path: "M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" },
  { title: "Give an idea a beginning", description: "Turn a good intention into a community initiative. Create an event and invite others to take part.", path: "M12 21V11m0 4C4 16 3 9 3 4c6 0 10 2 9 9m0 4c7 0 9-5 9-10-5 0-9 2-9 7" },
  { title: "Show up, together", description: "Join activities around shared interests, from caring for green spaces to helping neighbours. Join an event that matters to you.", path: "M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6 10v-3a6 6 0 0 1 12 0v3m2-17a4 4 0 0 1 0 8m2 3a5 5 0 0 1 4 4v2" },
  { title: "Keep your journey close", description: "Keep your joined activities close, with dates and details in your personal event list.", path: "M7 3h10v4H7V3Zm0 2H4v17h16V5h-3M8 12h8m-8 5h5" },
];

export function HomeFeatures() {
  return <section id="features" className="home-features content-width" aria-labelledby="features-heading" tabIndex={-1}>
    <div className="section-heading centered-heading">
      <p className="eyebrow">The platform we’re growing</p>
      <h2 id="features-heading">Discover. Create. Belong.</h2>
      <p>Find your people. Bring an idea. Make time for something that matters.</p>
    </div>
    <div className="features-grid">
      {features.map((feature, index) => <article className="feature-item" key={feature.title}>
        <div className="feature-top"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={feature.path} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg><span>0{index + 1}</span></div>
        <h3>{feature.title}</h3><p>{feature.description}</p>
      </article>)}
    </div>
    <p className="section-note">Create an initiative, join an activity, and follow your community journey.</p>
  </section>;
}
