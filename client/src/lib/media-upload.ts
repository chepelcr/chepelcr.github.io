import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { uploadAsset } from "@/lib/local-cms";
import type { MediaItem } from "@/repositories/media.repository";

function newId(): string {
  return `media-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function kindFromMime(mime: string): string {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "other";
}

function readDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function prependToLibrary(item: MediaItem): Promise<void> {
  const media = useAdminStore.getState().media;
  const next = { ...media, items: [item, ...media.items] };
  useAdminStore.getState().setMedia(next);
  return downloadJson("media.json", next);
}

/** Upload a file from disk → /__local/asset, register it in media.json, return the new item. */
export async function uploadToLibrary(file: File): Promise<MediaItem | null> {
  const dataUrl = await readDataUrl(file);
  const res = await uploadAsset(file.name, dataUrl, "media");
  if (!res.ok || !res.url) return null;
  const item = {
    id: newId(),
    kind: kindFromMime(file.type),
    source: "local",
    path: res.url,
    url: "",
    filename: file.name,
    mime: file.type,
    size: file.size,
    alt: { es: "", en: "" },
    createdAt: new Date().toISOString(),
  } as unknown as MediaItem;
  await prependToLibrary(item);
  return item;
}

/** Register an external URL in media.json, return the new item. */
export async function addExternalToLibrary(url: string, kind = "image"): Promise<MediaItem> {
  const filename = url.split("/").pop()?.split("?")[0] || url;
  const item = {
    id: newId(),
    kind,
    source: "external",
    path: "",
    url,
    filename,
    mime: "",
    size: 0,
    alt: { es: "", en: "" },
    createdAt: new Date().toISOString(),
  } as unknown as MediaItem;
  await prependToLibrary(item);
  return item;
}
