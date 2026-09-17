import data from "@/content/simple-cv.json";
import type { BiField } from "@/lib/i18n-field";

/**
 * A position in the simplified CV. `experienceId` + `roleIndex` point at the source
 * role in experience.json (company, title and period are read from there); `title`
 * and `period` are optional overrides used when several source roles at the same
 * company are merged into a single position.
 */
export interface SimpleCvPosition {
  experienceId: string;
  roleIndex: number;
  title?: BiField;
  period?: BiField;
  description: BiField;
}

export interface SimpleCv {
  title: BiField;
  summary: BiField;
  toolsLine: BiField;
  softSkills: BiField[];
  positions: SimpleCvPosition[];
  /** Empty array means "include all". */
  educationIds: string[];
  /** Empty array means "include all". */
  certificationIds: string[];
  includeTraining: boolean;
}

export function getSimpleCv(): SimpleCv {
  return data as SimpleCv;
}
