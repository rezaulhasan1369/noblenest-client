import { BotanicalMark } from "./brand-logo";

const values = [
  ["Local roots", "Good begins close to home."],
  ["Shared purpose", "Find a cause that moves you."],
  ["Open hearts", "Make room for one another."],
  ["Growing together", "Small acts add up to care."],
];

export function CommunityImpact() {
  return <section className="impact-wrap" aria-label="Our community values">
    <div className="impact-strip content-width">{values.map(([title, text]) => <div className="impact-value" key={title}>
      <BotanicalMark /><div><h2>{title}</h2><p>{text}</p></div>
    </div>)}</div>
  </section>;
}
