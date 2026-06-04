import data from "@/content/contact.json";

export type Contact = typeof data;

export function getContact() {
  return data;
}
