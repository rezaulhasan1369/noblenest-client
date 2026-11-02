export type FieldErrors = Record<string, string>;
export type AuthFields = { name?: string; email: string; password: string; image?: string };
export type EventFields = { title: string; description: string; eventType: string; thumbnailUrl: string; location: string; eventDate: string };
export function validWebUrl(value: string) {
  try { const url = new URL(value); return value.length <= 2048 && value.startsWith("https://") && !/[\s\\\u0000-\u001f\u007f]/.test(value) && url.protocol === "https:" && !url.username && !url.password; } catch { return false; }
}
export function validateProfile(values: { name: string; image: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim() || values.name.length > 100) errors.name = "Enter your name (up to 100 characters).";
  if (!validWebUrl(values.image)) errors.image = "Enter a valid HTTPS photo URL without credentials.";
  return errors;
}
export function profileUpdateInput(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw Error("Invalid profile fields");
  const fields = body as Record<string, unknown>;
  if (Object.keys(fields).some(key => key !== "name" && key !== "image") || typeof fields.name !== "string" || typeof fields.image !== "string") throw Error("Invalid profile fields");
  const result = { name: fields.name.trim(), image: fields.image.trim() };
  if (Object.keys(validateProfile(result)).length) throw Error("Invalid profile fields");
  return result;
}
export function validateAuth(values: AuthFields, mode: "login" | "register"): FieldErrors {
  const errors: FieldErrors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254) errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Enter your password.";
  if (values.password.length > 128) errors.password = "Use no more than 128 characters.";
  if (mode === "register") {
    if (!values.name?.trim() || values.name.length > 100) errors.name = "Enter your name (up to 100 characters).";
    if (values.password.length < 6 || !/[A-Z]/.test(values.password) || !/[a-z]/.test(values.password)) errors.password = "Use at least 6 characters with an uppercase and a lowercase letter.";
    if (!values.image || !validWebUrl(values.image)) errors.image = "Enter a valid HTTPS photo URL without credentials.";
  }
  return errors;
}
export function validateEvent(values: EventFields, now = Date.now()): FieldErrors {
  const errors: FieldErrors = {};
  for (const key of ["title", "description", "eventType", "location"] as const) if (!values[key].trim()) errors[key] = "This field is required.";
  if (values.title.length > 200) errors.title = "Use no more than 200 characters.";
  if (values.description.length > 5000) errors.description = "Use no more than 5000 characters.";
  if (values.location.length > 300) errors.location = "Use no more than 300 characters.";
  if (!["Cleanup", "Plantation", "Donation", "Community service"].includes(values.eventType)) errors.eventType = "Choose an approved event type.";
  if (!validWebUrl(values.thumbnailUrl)) errors.thumbnailUrl = "Enter a valid HTTPS image URL without credentials.";
  if (values.thumbnailUrl.length > 2048 || /[\s\\\u0000-\u001f\u007f]/.test(values.thumbnailUrl) || !values.thumbnailUrl.startsWith("https://")) errors.thumbnailUrl = "Enter a valid HTTPS image URL without credentials.";
  if (!values.eventDate || !Number.isFinite(Date.parse(values.eventDate)) || Date.parse(values.eventDate) <= now) errors.eventDate = "Choose a future date and time.";
  return errors;
}
