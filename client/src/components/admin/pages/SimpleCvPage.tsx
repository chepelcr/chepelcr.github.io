import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  SelectField,
  BilingualField,
  BilingualTextArea,
  BilingualSection,
} from "@/components/admin/AdminUI";
import { useLanguage } from "@/contexts/language-context";
import { pickLang } from "@/lib/i18n-field";
import { getExperience } from "@/repositories/experience.repository";

type Bilingual = { es: string; en: string };

export default function SimpleCvPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      title: "Título del encabezado",
      titleHint:
        "Aparece bajo el nombre, en lugar del puesto técnico del CV completo.",
      summary: "Resumen profesional",
      summaryHint:
        "Redáctelo en lenguaje sencillo, sin términos técnicos. Una sola línea de párrafo.",
      tools: "Herramientas y conocimientos",
      toolsHint: "Una sola línea separada por comas.",
      softSkills: "Competencias personales",
      skill: "Competencia",
      addSkill: "+ Añadir competencia",
      positions: "Experiencia laboral",
      positionsHint:
        "Cada puesto toma la empresa de experience.json. El título y el período se heredan del rol de origen; complételos solo si desea unir varios roles en un mismo puesto.",
      position: "Puesto",
      source: "Rol de origen",
      titleOverride: "Título (opcional, sobrescribe el original)",
      periodOverride: "Período (opcional, sobrescribe el original)",
      description: "Responsabilidades",
      descriptionHint: "Una responsabilidad por línea, en lenguaje sencillo.",
      inherits: "Hereda de",
      remove: "Quitar",
      moveUp: "Subir",
      moveDown: "Bajar",
      addPosition: "+ Añadir puesto",
      sections: "Secciones incluidas",
      includeTraining: "Incluir capacitaciones adicionales",
      allIncluded: "Se incluyen todas",
    },
    en: {
      title: "Header title",
      titleHint: "Shown under the name, replacing the technical job title of the full CV.",
      summary: "Professional summary",
      summaryHint: "Write it in plain language, no technical terms. A single paragraph.",
      tools: "Tools & skills",
      toolsHint: "A single comma-separated line.",
      softSkills: "Personal skills",
      skill: "Skill",
      addSkill: "+ Add skill",
      positions: "Work experience",
      positionsHint:
        "Each position takes its company from experience.json. Title and period are inherited from the source role; fill them in only to merge several roles into one position.",
      position: "Position",
      source: "Source role",
      titleOverride: "Title (optional, overrides the original)",
      periodOverride: "Period (optional, overrides the original)",
      description: "Responsibilities",
      descriptionHint: "One responsibility per line, in plain language.",
      inherits: "Inherits from",
      remove: "Remove",
      moveUp: "Move up",
      moveDown: "Move down",
      addPosition: "+ Add position",
      sections: "Included sections",
      includeTraining: "Include additional training",
      allIncluded: "All are included",
    },
  }[language];

  const slice = useAdminStore((state) => state.simpleCv);
  const setSimpleCv = useAdminStore((state) => state.setSimpleCv);

  const [draft, setDraft] = useState(() => structuredClone(slice));

  const save = async () => {
    setSimpleCv(draft);
    await downloadJson("simple-cv.json", draft);
  };

  // Every (experience entry, role) pair, so a position can point at any source role —
  // including roles flagged hideFromPdf, which are exactly the ones this CV wants.
  const experience = getExperience();
  const sourceRoles = experience.flatMap((entry) =>
    entry.roles.map((role, roleIndex) => ({
      value: `${entry.id}::${roleIndex}`,
      experienceId: entry.id,
      roleIndex,
      label: `${pickLang(entry.company, language)} — ${pickLang(role.title, language)} (${pickLang(role.period, language)})`,
    }))
  );

  const sourceRoleFor = (experienceId: string, roleIndex: number) =>
    sourceRoles.find((r) => r.experienceId === experienceId && r.roleIndex === roleIndex);

  // --- bilingual scalars ---
  const setField = (key: "title" | "summary" | "toolsLine") => (lang: "es" | "en", value: string) =>
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: value } }));

  // --- softSkills ---
  const setSkill = (index: number, lang: "es" | "en", value: string) =>
    setDraft((prev) => ({
      ...prev,
      softSkills: prev.softSkills.map((s, i) => (i === index ? { ...s, [lang]: value } : s)),
    }));

  const addSkill = () =>
    setDraft((prev) => ({ ...prev, softSkills: [...prev.softSkills, { es: "", en: "" }] }));

  const removeSkill = (index: number) =>
    setDraft((prev) => ({
      ...prev,
      softSkills: prev.softSkills.filter((_, i) => i !== index),
    }));

  // --- positions ---
  const setPosition = (index: number, patch: Record<string, unknown>) =>
    setDraft((prev) => ({
      ...prev,
      positions: prev.positions.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    }));

  const setPositionField = (
    index: number,
    key: "title" | "period" | "description",
    lang: "es" | "en",
    value: string
  ) =>
    setDraft((prev) => ({
      ...prev,
      positions: prev.positions.map((p, i) => {
        if (i !== index) return p;
        const current = (p[key] ?? { es: "", en: "" }) as Bilingual;
        return { ...p, [key]: { ...current, [lang]: value } };
      }),
    }));

  const movePosition = (index: number, delta: number) =>
    setDraft((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.positions.length) return prev;
      const positions = [...prev.positions];
      [positions[index], positions[target]] = [positions[target], positions[index]];
      return { ...prev, positions };
    });

  const addPosition = () =>
    setDraft((prev) => ({
      ...prev,
      positions: [
        ...prev.positions,
        {
          experienceId: sourceRoles[0]?.experienceId ?? "",
          roleIndex: sourceRoles[0]?.roleIndex ?? 0,
          description: { es: "", en: "" },
        },
      ],
    }));

  const removePosition = (index: number) =>
    setDraft((prev) => ({
      ...prev,
      positions: prev.positions.filter((_, i) => i !== index),
    }));

  return (
    <div>
      <PageHeader title="Simple CV" entity="simple-cv.json" value={draft} onSave={save} />

      <div className="space-y-6">
        <BilingualSection title={T.title}>
          <p className="text-xs text-muted-foreground">{T.titleHint}</p>
          <BilingualField
            label={T.title}
            es={draft.title.es}
            en={draft.title.en}
            onChange={setField("title")}
          />
        </BilingualSection>

        <BilingualSection title={T.summary}>
          <BilingualTextArea
            label={T.summary}
            hint={T.summaryHint}
            es={draft.summary.es}
            en={draft.summary.en}
            onChange={setField("summary")}
            rows={7}
          />
        </BilingualSection>

        <BilingualSection title={T.tools}>
          <BilingualTextArea
            label={T.tools}
            hint={T.toolsHint}
            es={draft.toolsLine.es}
            en={draft.toolsLine.en}
            onChange={setField("toolsLine")}
            rows={4}
          />
        </BilingualSection>

        <BilingualSection title={T.softSkills}>
          <div className="space-y-4">
            {draft.softSkills.map((skill, index) => (
              <div key={index} className="border border-border rounded-md p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {T.skill} {index + 1}
                  </span>
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline"
                    onClick={() => removeSkill(index)}
                  >
                    {T.remove}
                  </button>
                </div>
                <BilingualField
                  label={T.skill}
                  es={skill.es}
                  en={skill.en}
                  onChange={(lang, value) => setSkill(index, lang, value)}
                />
              </div>
            ))}
            <button
              type="button"
              className="text-xs text-accent hover:underline"
              onClick={addSkill}
            >
              {T.addSkill}
            </button>
          </div>
        </BilingualSection>

        <BilingualSection title={T.positions}>
          <p className="text-xs text-muted-foreground">{T.positionsHint}</p>
          <div className="space-y-4">
            {draft.positions.map((position, index) => {
              const source = sourceRoleFor(position.experienceId, position.roleIndex);
              return (
                <div key={index} className="border border-border rounded-md p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {T.position} {index + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:underline disabled:opacity-40"
                        disabled={index === 0}
                        onClick={() => movePosition(index, -1)}
                      >
                        {T.moveUp}
                      </button>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:underline disabled:opacity-40"
                        disabled={index === draft.positions.length - 1}
                        onClick={() => movePosition(index, 1)}
                      >
                        {T.moveDown}
                      </button>
                      <button
                        type="button"
                        className="text-xs text-destructive hover:underline"
                        onClick={() => removePosition(index)}
                      >
                        {T.remove}
                      </button>
                    </div>
                  </div>

                  <SelectField
                    label={T.source}
                    value={`${position.experienceId}::${position.roleIndex}`}
                    options={sourceRoles.map((r) => ({ value: r.value, label: r.label }))}
                    onChange={(value) => {
                      const [experienceId, roleIndex] = value.split("::");
                      setPosition(index, {
                        experienceId,
                        roleIndex: Number(roleIndex),
                      });
                    }}
                  />

                  <BilingualField
                    label={`${T.titleOverride}${source ? ` — ${T.inherits}: ${pickLang(experience.find((e) => e.id === position.experienceId)?.roles[position.roleIndex]?.title, language)}` : ""}`}
                    es={position.title?.es ?? ""}
                    en={position.title?.en ?? ""}
                    onChange={(lang, value) => setPositionField(index, "title", lang, value)}
                  />

                  <BilingualField
                    label={T.periodOverride}
                    es={position.period?.es ?? ""}
                    en={position.period?.en ?? ""}
                    onChange={(lang, value) => setPositionField(index, "period", lang, value)}
                  />

                  <BilingualTextArea
                    label={T.description}
                    hint={T.descriptionHint}
                    es={position.description?.es ?? ""}
                    en={position.description?.en ?? ""}
                    onChange={(lang, value) => setPositionField(index, "description", lang, value)}
                    rows={8}
                  />
                </div>
              );
            })}
            <button
              type="button"
              className="text-xs text-accent hover:underline"
              onClick={addPosition}
            >
              {T.addPosition}
            </button>
          </div>
        </BilingualSection>

        <BilingualSection title={T.sections}>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={draft.includeTraining}
              onChange={(e) => setDraft((prev) => ({ ...prev, includeTraining: e.target.checked }))}
            />
            {T.includeTraining}
          </label>
        </BilingualSection>
      </div>
    </div>
  );
}
