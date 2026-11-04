import { eventImageManifest } from "./event-image-manifest";

const approvedOrigin = "https://noblenest-web.onrender.com";

// Only approved artwork gets local variants. Never substitute an unrelated
// host's image merely because its pathname happens to match our manifest.
export function eventImageVariants(src: string) {
  if (!src || /[\s\\\u0000-\u001f\u007f]/.test(src) || src.startsWith("//")) return undefined;
  const relative = src.startsWith("/");
  let url: URL;
  try { url = new URL(src, approvedOrigin); } catch { return undefined; }
  if ((!relative && !src.startsWith("https://")) || url.origin !== approvedOrigin || url.username || url.password || url.hash) return undefined;
  const image = eventImageManifest.find(asset => asset.src === url.pathname);
  if (!image || (url.search && !("cacheRevision" in image && url.search === `?v=${image.cacheRevision}`))) return undefined;
  const revision = "cacheRevision" in image ? `?v=${image.cacheRevision}` : "";
  return image.variants.map(variant => ({
    src: `${relative ? "" : approvedOrigin}${variant.src}${revision}`,
    width: variant.width,
  }));
}
