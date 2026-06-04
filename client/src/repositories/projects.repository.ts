import data from "@/content/projects.json";

export type ProjectAccessMode = "request" | "link";

interface LocalizedText {
  es: string;
  en: string;
}

export interface Project {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  type: string;
  image: string;
  technologies: string[];
  features: LocalizedText[];
  githubUrl?: string;
  liveUrl?: string;
  accessMode: string;
  featured: boolean;
  includeInCv: boolean;
  order: number;
  iconName?: string;
}

const projects = data as Project[];

export function getProjects(): Project[] {
  return projects;
}
