import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { useLanguage } from "@/contexts/language-context";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  TextField,
  BilingualField,
  BilingualSection,
} from "@/components/admin/AdminUI";

export default function PersonalInfoPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      identity: "Identidad",
      name: "Nombre",
      contact: "Contacto",
      email: "Correo",
      phone: "Teléfono",
      links: "Enlaces",
      website: "Sitio web",
      linkedin: "LinkedIn",
      github: "GitHub",
      locale: "Configuración regional",
      location: "Ubicación",
      nationality: "Nacionalidad",
      languages: "Idiomas",
    },
    en: {
      identity: "Identity",
      name: "Name",
      contact: "Contact",
      email: "Email",
      phone: "Phone",
      links: "Links",
      website: "Website",
      linkedin: "LinkedIn",
      github: "GitHub",
      locale: "Locale",
      location: "Location",
      nationality: "Nationality",
      languages: "Languages",
    },
  }[language];

  const slice = useAdminStore((state) => state.personalInfo);
  const setPersonalInfo = useAdminStore((state) => state.setPersonalInfo);

  const [draft, setDraft] = useState(() => structuredClone(slice));

  const setScalar = (key: keyof typeof draft, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const setBilingual = (
    key: "location" | "languages" | "nationality",
    lang: "es" | "en",
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));
  };

  const save = async () => {
    setPersonalInfo(draft);
    await downloadJson("personal-info.json", draft);
  };

  return (
    <div>
      <PageHeader
        title="Personal Info"
        entity="personal-info.json"
        value={draft}
        onSave={save}
      />

      <div className="space-y-6">
        <BilingualSection title={T.identity}>
          <TextField
            label={T.name}
            value={draft.name}
            onChange={(value) => setScalar("name", value)}
          />
        </BilingualSection>

        <BilingualSection title={T.contact}>
          <TextField
            label={T.email}
            value={draft.email}
            onChange={(value) => setScalar("email", value)}
          />
          <TextField
            label={T.phone}
            value={draft.phone}
            onChange={(value) => setScalar("phone", value)}
          />
        </BilingualSection>

        <BilingualSection title={T.links}>
          <TextField
            label={T.website}
            value={draft.website}
            onChange={(value) => setScalar("website", value)}
          />
          <TextField
            label={T.linkedin}
            value={draft.linkedin}
            onChange={(value) => setScalar("linkedin", value)}
          />
          <TextField
            label={T.github}
            value={draft.github}
            onChange={(value) => setScalar("github", value)}
          />
        </BilingualSection>

        <BilingualSection title={T.locale}>
          <BilingualField
            label={T.location}
            es={draft.location.es}
            en={draft.location.en}
            onChange={(lang, value) => setBilingual("location", lang, value)}
          />
          <BilingualField
            label={T.nationality}
            es={draft.nationality.es}
            en={draft.nationality.en}
            onChange={(lang, value) => setBilingual("nationality", lang, value)}
          />
          <BilingualField
            label={T.languages}
            es={draft.languages.es}
            en={draft.languages.en}
            onChange={(lang, value) => setBilingual("languages", lang, value)}
          />
        </BilingualSection>
      </div>
    </div>
  );
}
