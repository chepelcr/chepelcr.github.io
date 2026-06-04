import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  BilingualSection,
  BilingualField,
  BilingualTextArea,
  TextField,
  SelectField,
} from "@/components/admin/AdminUI";
import contactData from "@/content/contact.json";

/** Availability status tokens with proper bilingual labels (value saved, label shown). */
const STATUS_OPTIONS = {
  es: [
    { value: "available", label: "Disponible" },
    { value: "considering", label: "Considerando" },
    { value: "unavailable", label: "No disponible" },
  ],
  en: [
    { value: "available", label: "Available" },
    { value: "considering", label: "Considering" },
    { value: "unavailable", label: "Not available" },
  ],
};

type Contact = typeof contactData;
type AvailabilityItem = Contact["availability"][number];
type SubjectOption = Contact["subjectOptions"][number];

export default function ContactPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      intro: "Introducción",
      subtitle: "Subtítulo",
      description: "Descripción",
      availability: "Disponibilidad",
      availabilityItem: "Disponibilidad",
      remove: "Quitar",
      label: "Etiqueta",
      status: "Estado",
      addAvailability: "+ Añadir disponibilidad",
      subjectOptions: "Opciones de asunto",
      subject: "Asunto",
      value: "Valor",
      addSubject: "+ Añadir opción de asunto",
      downloadCv: "Descargar CV",
      downloadCvBlurb: "Texto de descarga de CV",
    },
    en: {
      intro: "Intro",
      subtitle: "Subtitle",
      description: "Description",
      availability: "Availability",
      availabilityItem: "Availability",
      remove: "Remove",
      label: "Label",
      status: "Status",
      addAvailability: "+ Add availability",
      subjectOptions: "Subject Options",
      subject: "Subject",
      value: "Value",
      addSubject: "+ Add subject option",
      downloadCv: "Download CV",
      downloadCvBlurb: "Download CV Blurb",
    },
  }[language];
  const slice = useAdminStore((state) => state.contact);
  const setContact = useAdminStore((state) => state.setContact);

  const [draft, setDraft] = useState<Contact>(structuredClone(slice));

  const setBilingual = (
    key: "subtitle" | "description" | "downloadCvBlurb",
    lang: "es" | "en",
    value: string,
  ) => {
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: value } }));
  };

  // Availability
  const setAvailability = (next: AvailabilityItem[]) =>
    setDraft((prev) => ({ ...prev, availability: next }));

  const updateAvailability = (index: number, patch: Partial<AvailabilityItem>) =>
    setAvailability(
      draft.availability.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );

  const addAvailability = () =>
    setAvailability([
      ...draft.availability,
      { label: { es: "", en: "" }, statusToken: "available" },
    ]);

  const removeAvailability = (index: number) =>
    setAvailability(draft.availability.filter((_, i) => i !== index));

  // Subject options
  const setSubjectOptions = (next: SubjectOption[]) =>
    setDraft((prev) => ({ ...prev, subjectOptions: next }));

  const updateSubjectOption = (index: number, patch: Partial<SubjectOption>) =>
    setSubjectOptions(
      draft.subjectOptions.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );

  const addSubjectOption = () =>
    setSubjectOptions([
      ...draft.subjectOptions,
      { value: "", label: { es: "", en: "" } },
    ]);

  const removeSubjectOption = (index: number) =>
    setSubjectOptions(draft.subjectOptions.filter((_, i) => i !== index));

  const save = async () => {
    setContact(draft);
    await downloadJson("contact.json", draft);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Contact" entity="contact.json" value={draft} onSave={save} />

      <BilingualSection title={T.intro}>
        <BilingualField
          label={T.subtitle}
          es={draft.subtitle.es}
          en={draft.subtitle.en}
          onChange={(lang, value) => setBilingual("subtitle", lang, value)}
        />
        <BilingualTextArea
          label={T.description}
          es={draft.description.es}
          en={draft.description.en}
          onChange={(lang, value) => setBilingual("description", lang, value)}
        />
      </BilingualSection>

      <BilingualSection title={T.availability}>
        {draft.availability.map((item, index) => (
          <div key={index} className="border border-border rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {T.availabilityItem} #{index + 1}
              </span>
              <button
                type="button"
                className="text-xs text-destructive hover:underline"
                onClick={() => removeAvailability(index)}
              >
                {T.remove}
              </button>
            </div>
            <BilingualField
              label={T.label}
              es={item.label.es}
              en={item.label.en}
              onChange={(lang, value) =>
                updateAvailability(index, { label: { ...item.label, [lang]: value } })
              }
            />
            <SelectField
              label={T.status}
              value={item.statusToken}
              options={STATUS_OPTIONS[language]}
              onChange={(value) => updateAvailability(index, { statusToken: value })}
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={addAvailability}
        >
          {T.addAvailability}
        </button>
      </BilingualSection>

      <BilingualSection title={T.subjectOptions}>
        {draft.subjectOptions.map((item, index) => (
          <div key={index} className="border border-border rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {T.subject} #{index + 1}
              </span>
              <button
                type="button"
                className="text-xs text-destructive hover:underline"
                onClick={() => removeSubjectOption(index)}
              >
                {T.remove}
              </button>
            </div>
            <TextField
              label={T.value}
              value={item.value}
              placeholder="desarrollo"
              onChange={(value) => updateSubjectOption(index, { value })}
            />
            <BilingualField
              label={T.label}
              es={item.label.es}
              en={item.label.en}
              onChange={(lang, value) =>
                updateSubjectOption(index, { label: { ...item.label, [lang]: value } })
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={addSubjectOption}
        >
          {T.addSubject}
        </button>
      </BilingualSection>

      <BilingualSection title={T.downloadCv}>
        <BilingualTextArea
          label={T.downloadCvBlurb}
          es={draft.downloadCvBlurb.es}
          en={draft.downloadCvBlurb.en}
          onChange={(lang, value) => setBilingual("downloadCvBlurb", lang, value)}
        />
      </BilingualSection>
    </div>
  );
}
