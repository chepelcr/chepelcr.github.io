import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  BilingualSection,
  BilingualField,
  BilingualTextArea,
  TextField,
} from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useLanguage } from "@/contexts/language-context";

export default function HeroPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      headline: "Titular",
      greeting: "Saludo",
      title: "Título",
      subtitle: "Subtítulo",
      description: "Descripción",
      mediaIcons: "Medios e iconos",
      photo: "Foto",
      contactCtaIcon: "Icono CTA de contacto",
      downloadCtaIcon: "Icono CTA de descarga",
    },
    en: {
      headline: "Headline",
      greeting: "Greeting",
      title: "Title",
      subtitle: "Subtitle",
      description: "Description",
      mediaIcons: "Media & Icons",
      photo: "Photo",
      contactCtaIcon: "Contact CTA Icon",
      downloadCtaIcon: "Download CTA Icon",
    },
  }[language];

  const slice = useAdminStore((state) => state.hero);
  const setHero = useAdminStore((state) => state.setHero);

  const [draft, setDraft] = useState(structuredClone(slice));

  const setField = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const setBilingual = (key: "greeting" | "title" | "subtitle" | "description", lang: "es" | "en", value: string) => {
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: value } }));
  };

  const save = async () => {
    setHero(draft);
    await downloadJson("hero.json", draft);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Hero" entity="hero.json" value={draft} onSave={save} />

      <BilingualSection title={T.headline}>
        <BilingualField
          label={T.greeting}
          es={draft.greeting.es}
          en={draft.greeting.en}
          onChange={(lang, value) => setBilingual("greeting", lang, value)}
        />
        <BilingualField
          label={T.title}
          es={draft.title.es}
          en={draft.title.en}
          onChange={(lang, value) => setBilingual("title", lang, value)}
        />
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
          hint={RICH_TEXT_HINT}
          onChange={(lang, value) => setBilingual("description", lang, value)}
        />
      </BilingualSection>

      <BilingualSection title={T.mediaIcons}>
        <MediaPicker
          label={T.photo}
          value={draft.photo}
          onChange={(value) => setField("photo", value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label={T.contactCtaIcon}
            value={draft.ctaContactIcon}
            placeholder="mail"
            onChange={(value) => setField("ctaContactIcon", value)}
          />
          <TextField
            label={T.downloadCtaIcon}
            value={draft.ctaDownloadIcon}
            placeholder="download"
            onChange={(value) => setField("ctaDownloadIcon", value)}
          />
        </div>
      </BilingualSection>
    </div>
  );
}
