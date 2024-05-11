const PUBLIC_ORIGIN = import.meta.env.VITE_PUBLIC_ORIGIN as string;
const UPLOAD_PUBLIC_URL = import.meta.env.VITE_UPLOAD_PUBLIC_URL as string;

export function toPublicImageUrl(imageKey?: string | null): string | null {
  if (!imageKey) return null;
  if (imageKey.startsWith("http://") || imageKey.startsWith("https://")) return imageKey;
  const clean = imageKey.startsWith("/") ? imageKey.slice(1) : imageKey;
  if (clean.startsWith(`${UPLOAD_PUBLIC_URL}/`)) return `${PUBLIC_ORIGIN}/${clean}`;
  return `${PUBLIC_ORIGIN}/${UPLOAD_PUBLIC_URL}/${clean}`;
}
