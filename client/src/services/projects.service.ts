import { getProjects, type Project } from "@/repositories/projects.repository";

function byOrder(a: Project, b: Project) {
  return a.order - b.order;
}

export function getFeatured(): Project[] {
  return getProjects()
    .filter((p) => p.featured)
    .sort(byOrder);
}

export function getOther(): Project[] {
  return getProjects()
    .filter((p) => !p.featured)
    .sort(byOrder);
}

export function getForCv(): Project[] {
  return getProjects()
    .filter((p) => p.includeInCv)
    .sort(byOrder);
}
