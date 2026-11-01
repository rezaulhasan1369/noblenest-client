// datetime-local values are local wall time, never implicitly UTC. Round-trip
// the parts to reject impossible dates and DST gaps normalized by Date().
export function localEventDateToUtc(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value)) throw Error("Invalid local date");
  const [year, month, day, hour, minute, second = 0] = value.split(/[-T:]/).map(Number);
  const date = new Date(year, month - 1, day, hour, minute, second);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || date.getHours() !== hour || date.getMinutes() !== minute || date.getSeconds() !== second) throw Error("Invalid local date");
  return date.toISOString();
}
export function utcEventDateToLocal(value: string): string {
  const date = new Date(value);
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
