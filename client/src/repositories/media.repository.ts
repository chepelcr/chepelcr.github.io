import data from "@/content/media.json";

export type Media = typeof data;
export type MediaItem = Media["items"][number];

export function getMedia(): Media {
  return data;
}
