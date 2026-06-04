import { create } from "zustand";
import { saveContentFile } from "@/lib/local-cms";

import personalInfo from "@/content/personal-info.json";
import hero from "@/content/hero.json";
import about from "@/content/about.json";
import contact from "@/content/contact.json";
import footer from "@/content/footer.json";
import navigation from "@/content/navigation.json";
import seo from "@/content/seo.json";
import branding from "@/content/branding.json";
import themes from "@/content/themes.json";
import skills from "@/content/skills.json";
import experience from "@/content/experience.json";
import education from "@/content/education.json";
import certifications from "@/content/certifications.json";
import training from "@/content/training.json";
import projectsData from "@/content/projects.json";
import media from "@/content/media.json";
import type { Project } from "@/repositories/projects.repository";

const projects = projectsData as Project[];

/** Maps a content filename to its slice key in the store. */
export const ENTITY_BY_FILE: Record<string, string> = {
  "personal-info.json": "personalInfo",
  "hero.json": "hero",
  "about.json": "about",
  "contact.json": "contact",
  "footer.json": "footer",
  "navigation.json": "navigation",
  "seo.json": "seo",
  "branding.json": "branding",
  "themes.json": "themes",
  "skills.json": "skills",
  "experience.json": "experience",
  "education.json": "education",
  "certifications.json": "certifications",
  "training.json": "training",
  "projects.json": "projects",
  "media.json": "media",
};

interface AdminStoreState {
  personalInfo: typeof personalInfo;
  setPersonalInfo: (value: typeof personalInfo) => void;
  hero: typeof hero;
  setHero: (value: typeof hero) => void;
  about: typeof about;
  setAbout: (value: typeof about) => void;
  contact: typeof contact;
  setContact: (value: typeof contact) => void;
  footer: typeof footer;
  setFooter: (value: typeof footer) => void;
  navigation: typeof navigation;
  setNavigation: (value: typeof navigation) => void;
  seo: typeof seo;
  setSeo: (value: typeof seo) => void;
  branding: typeof branding;
  setBranding: (value: typeof branding) => void;
  themes: typeof themes;
  setThemes: (value: typeof themes) => void;
  skills: typeof skills;
  setSkills: (value: typeof skills) => void;
  experience: typeof experience;
  setExperience: (value: typeof experience) => void;
  education: typeof education;
  setEducation: (value: typeof education) => void;
  certifications: typeof certifications;
  setCertifications: (value: typeof certifications) => void;
  training: typeof training;
  setTraining: (value: typeof training) => void;
  projects: Project[];
  setProjects: (value: Project[]) => void;
  media: typeof media;
  setMedia: (value: typeof media) => void;

  savedSnapshots: Record<string, string>;
  markSaved: (file: string, value: unknown) => void;
  discardEntity: (file: string) => void;
}

export const useAdminStore = /*#__PURE__*/ create<AdminStoreState>((set) => ({
  personalInfo,
  setPersonalInfo: (value) => set({ personalInfo: value }),
  hero,
  setHero: (value) => set({ hero: value }),
  about,
  setAbout: (value) => set({ about: value }),
  contact,
  setContact: (value) => set({ contact: value }),
  footer,
  setFooter: (value) => set({ footer: value }),
  navigation,
  setNavigation: (value) => set({ navigation: value }),
  seo,
  setSeo: (value) => set({ seo: value }),
  branding,
  setBranding: (value) => set({ branding: value }),
  themes,
  setThemes: (value) => set({ themes: value }),
  skills,
  setSkills: (value) => set({ skills: value }),
  experience,
  setExperience: (value) => set({ experience: value }),
  education,
  setEducation: (value) => set({ education: value }),
  certifications,
  setCertifications: (value) => set({ certifications: value }),
  training,
  setTraining: (value) => set({ training: value }),
  projects,
  setProjects: (value) => set({ projects: value }),
  media,
  setMedia: (value) => set({ media: value }),

  savedSnapshots: {
    "personal-info.json": JSON.stringify(personalInfo),
    "hero.json": JSON.stringify(hero),
    "about.json": JSON.stringify(about),
    "contact.json": JSON.stringify(contact),
    "footer.json": JSON.stringify(footer),
    "navigation.json": JSON.stringify(navigation),
    "seo.json": JSON.stringify(seo),
    "branding.json": JSON.stringify(branding),
    "themes.json": JSON.stringify(themes),
    "skills.json": JSON.stringify(skills),
    "experience.json": JSON.stringify(experience),
    "education.json": JSON.stringify(education),
    "certifications.json": JSON.stringify(certifications),
    "training.json": JSON.stringify(training),
    "projects.json": JSON.stringify(projects),
    "media.json": JSON.stringify(media),
  },

  markSaved: (file, value) =>
    set((state) => ({
      savedSnapshots: { ...state.savedSnapshots, [file]: JSON.stringify(value) },
    })),

  discardEntity: (file) =>
    set((state) => {
      const sliceKey = ENTITY_BY_FILE[file];
      const snapshot = state.savedSnapshots[file];
      if (!sliceKey || snapshot === undefined) return {};
      return { [sliceKey]: JSON.parse(snapshot) } as Partial<AdminStoreState>;
    }),
}));

/** Reactively reports whether a given entity value differs from its saved snapshot. */
export function useEntityDirty(filename: string, value: unknown): boolean {
  const snapshot = useAdminStore((state) => state.savedSnapshots[filename]);
  return snapshot !== undefined && JSON.stringify(value) !== snapshot;
}

/**
 * Persist a content file. In dev, writes through the local CMS middleware; otherwise
 * falls back to a browser download. Always updates the saved snapshot and notifies listeners.
 */
export async function downloadJson(filename: string, data: unknown): Promise<void> {
  const wrote = await saveContentFile(filename, data);
  if (!wrote) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  useAdminStore.getState().markSaved(filename, data);
  window.dispatchEvent(new CustomEvent("dxp:content-saved"));
}
