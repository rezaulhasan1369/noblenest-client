export function FormField({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return <div className="form-field"><label htmlFor={id}>{label}</label>{children}{error && <p className="field-error" id={`${id}-error`}>{error}</p>}</div>;
}
