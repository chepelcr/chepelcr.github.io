import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  TextField,
  BilingualField,
  BilingualTextArea,
  BilingualSection,
} from "@/components/admin/AdminUI";
import { ICON_NAMES } from "@/lib/icons";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useLanguage } from "@/contexts/language-context";

type Bilingual = { es: string; en: string };
type Stat = { iconName: string; value: string; label: Bilingual };

const inputClass =
  "w-full bg-background border border-border rounded-md px-3 py-2 text-sm";

export default function AboutPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      description: "Descripción",
      profileParagraphs: "Párrafos del perfil",
      paragraph: "Párrafo",
      remove: "Quitar",
      text: "Texto",
      addParagraph: "+ Añadir párrafo",
      stats: "Estadísticas",
      stat: "Estadística",
      icon: "Icono",
      value: "Valor",
      label: "Etiqueta",
      addStat: "+ Añadir estadística",
      personalInfoLabels: "Etiquetas de información personal",
      nationalityLabel: "Etiqueta de nacionalidad",
      languagesLabel: "Etiqueta de idiomas",
      phoneLabel: "Etiqueta de teléfono",
    },
    en: {
      description: "Description",
      profileParagraphs: "Profile Paragraphs",
      paragraph: "Paragraph",
      remove: "Remove",
      text: "Text",
      addParagraph: "+ Add paragraph",
      stats: "Stats",
      stat: "Stat",
      icon: "Icon",
      value: "Value",
      label: "Label",
      addStat: "+ Add stat",
      personalInfoLabels: "Personal Info Labels",
      nationalityLabel: "Nationality Label",
      languagesLabel: "Languages Label",
      phoneLabel: "Phone Label",
    },
  }[language];

  const slice = useAdminStore((state) => state.about);
  const setAbout = useAdminStore((state) => state.setAbout);

  const [draft, setDraft] = useState(() => structuredClone(slice));

  const save = async () => {
    setAbout(draft);
    await downloadJson("about.json", draft);
  };

  // --- description (bilingual scalar) ---
  const setDescription = (lang: "es" | "en", value: string) => {
    setDraft((prev) => ({
      ...prev,
      description: { ...prev.description, [lang]: value },
    }));
  };

  // --- profileParagraphs (bilingual array) ---
  const setParagraph = (index: number, lang: "es" | "en", value: string) => {
    setDraft((prev) => ({
      ...prev,
      profileParagraphs: prev.profileParagraphs.map((p, i) =>
        i === index ? { ...p, [lang]: value } : p,
      ),
    }));
  };

  const addParagraph = () => {
    setDraft((prev) => ({
      ...prev,
      profileParagraphs: [...prev.profileParagraphs, { es: "", en: "" }],
    }));
  };

  const removeParagraph = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      profileParagraphs: prev.profileParagraphs.filter((_, i) => i !== index),
    }));
  };

  // --- stats (array of {iconName, value, label}) ---
  const setStat = (
    index: number,
    patch: Partial<Stat>,
  ) => {
    setDraft((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  };

  const setStatLabel = (index: number, lang: "es" | "en", value: string) => {
    setDraft((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) =>
        i === index ? { ...s, label: { ...s.label, [lang]: value } } : s,
      ),
    }));
  };

  const addStat = () => {
    setDraft((prev) => ({
      ...prev,
      stats: [
        ...prev.stats,
        { iconName: ICON_NAMES[0], value: "", label: { es: "", en: "" } },
      ],
    }));
  };

  const removeStat = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  // --- personalInfo (object of bilingual labels) ---
  const setPersonalInfoLabel = (
    key: keyof typeof draft.personalInfo,
    lang: "es" | "en",
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [key]: { ...prev.personalInfo[key], [lang]: value },
      },
    }));
  };

  return (
    <div>
      <PageHeader
        title="About"
        entity="about.json"
        value={draft}
        onSave={save}
      />

      <div className="space-y-6">
        <BilingualSection title={T.description}>
          <BilingualTextArea
            label={T.description}
            es={draft.description.es}
            en={draft.description.en}
            hint={RICH_TEXT_HINT}
            onChange={setDescription}
            rows={6}
          />
        </BilingualSection>

        <BilingualSection title={T.profileParagraphs}>
          <div className="space-y-4">
            {draft.profileParagraphs.map((paragraph, index) => (
              <div
                key={index}
                className="border border-border rounded-md p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {T.paragraph} {index + 1}
                  </span>
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline"
                    onClick={() => removeParagraph(index)}
                  >
                    {T.remove}
                  </button>
                </div>
                <BilingualTextArea
                  label={T.text}
                  es={paragraph.es}
                  en={paragraph.en}
                  hint={RICH_TEXT_HINT}
                  onChange={(lang, value) => setParagraph(index, lang, value)}
                  rows={4}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="text-sm text-accent hover:underline"
            onClick={addParagraph}
          >
            {T.addParagraph}
          </button>
        </BilingualSection>

        <BilingualSection title={T.stats}>
          <div className="space-y-4">
            {draft.stats.map((stat, index) => (
              <div
                key={index}
                className="border border-border rounded-md p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {T.stat} {index + 1}
                  </span>
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline"
                    onClick={() => removeStat(index)}
                  >
                    {T.remove}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">
                      {T.icon}
                    </label>
                    <select
                      className={inputClass}
                      value={stat.iconName}
                      onChange={(e) =>
                        setStat(index, { iconName: e.target.value })
                      }
                    >
                      {ICON_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <TextField
                    label={T.value}
                    value={stat.value}
                    onChange={(value) => setStat(index, { value })}
                  />
                </div>
                <BilingualField
                  label={T.label}
                  es={stat.label.es}
                  en={stat.label.en}
                  onChange={(lang, value) => setStatLabel(index, lang, value)}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="text-sm text-accent hover:underline"
            onClick={addStat}
          >
            {T.addStat}
          </button>
        </BilingualSection>

        <BilingualSection title={T.personalInfoLabels}>
          <BilingualField
            label={T.nationalityLabel}
            es={draft.personalInfo.nationalityLabel.es}
            en={draft.personalInfo.nationalityLabel.en}
            onChange={(lang, value) =>
              setPersonalInfoLabel("nationalityLabel", lang, value)
            }
          />
          <BilingualField
            label={T.languagesLabel}
            es={draft.personalInfo.languagesLabel.es}
            en={draft.personalInfo.languagesLabel.en}
            onChange={(lang, value) =>
              setPersonalInfoLabel("languagesLabel", lang, value)
            }
          />
          <BilingualField
            label={T.phoneLabel}
            es={draft.personalInfo.phoneLabel.es}
            en={draft.personalInfo.phoneLabel.en}
            onChange={(lang, value) =>
              setPersonalInfoLabel("phoneLabel", lang, value)
            }
          />
        </BilingualSection>
      </div>
    </div>
  );
}
