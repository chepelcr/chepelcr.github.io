import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  BilingualSection,
  BilingualTextArea,
  TextField,
} from "@/components/admin/AdminUI";
import { ICON_NAMES } from "@/lib/icons";
import { useLanguage } from "@/contexts/language-context";
import footerData from "@/content/footer.json";

type Footer = typeof footerData;
type SocialLink = Footer["social"][number];

export default function FooterPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      description: "Descripción",
      copyright: "Derechos de autor",
      copyrightName: "Nombre de copyright",
      copyrightYear: "Año de copyright",
      socialLinks: "Enlaces sociales",
      social: "Social",
      remove: "Quitar",
      icon: "Icono",
      href: "Enlace",
      label: "Etiqueta",
      addSocial: "+ Añadir enlace social",
    },
    en: {
      description: "Description",
      copyright: "Copyright",
      copyrightName: "Copyright Name",
      copyrightYear: "Copyright Year",
      socialLinks: "Social Links",
      social: "Social",
      remove: "Remove",
      icon: "Icon",
      href: "Href",
      label: "Label",
      addSocial: "+ Add social link",
    },
  }[language];

  const slice = useAdminStore((state) => state.footer);
  const setFooter = useAdminStore((state) => state.setFooter);

  const [draft, setDraft] = useState<Footer>(structuredClone(slice));

  const setDescription = (lang: "es" | "en", value: string) =>
    setDraft((prev) => ({
      ...prev,
      description: { ...prev.description, [lang]: value },
    }));

  const setScalar = (key: "copyrightName" | "copyrightYear", value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  // Social links
  const setSocial = (next: SocialLink[]) =>
    setDraft((prev) => ({ ...prev, social: next }));

  const updateSocial = (index: number, patch: Partial<SocialLink>) =>
    setSocial(draft.social.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const addSocial = () =>
    setSocial([...draft.social, { iconName: "globe", href: "", label: "" }]);

  const removeSocial = (index: number) =>
    setSocial(draft.social.filter((_, i) => i !== index));

  const save = async () => {
    setFooter(draft);
    await downloadJson("footer.json", draft);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Footer" entity="footer.json" value={draft} onSave={save} />

      <BilingualSection title={T.description}>
        <BilingualTextArea
          label={T.description}
          es={draft.description.es}
          en={draft.description.en}
          onChange={setDescription}
        />
      </BilingualSection>

      <BilingualSection title={T.copyright}>
        <TextField
          label={T.copyrightName}
          value={draft.copyrightName}
          onChange={(value) => setScalar("copyrightName", value)}
        />
        <TextField
          label={T.copyrightYear}
          value={draft.copyrightYear}
          placeholder='auto | 2026'
          onChange={(value) => setScalar("copyrightYear", value)}
        />
      </BilingualSection>

      <BilingualSection title={T.socialLinks}>
        {draft.social.map((item, index) => (
          <div key={index} className="border border-border rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {T.social} #{index + 1}
              </span>
              <button
                type="button"
                className="text-xs text-destructive hover:underline"
                onClick={() => removeSocial(index)}
              >
                {T.remove}
              </button>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">{T.icon}</label>
              <select
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
                value={item.iconName}
                onChange={(e) => updateSocial(index, { iconName: e.target.value })}
              >
                {ICON_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <TextField
              label={T.href}
              value={item.href}
              placeholder="https://..."
              onChange={(value) => updateSocial(index, { href: value })}
            />
            <TextField
              label={T.label}
              value={item.label}
              placeholder="LinkedIn"
              onChange={(value) => updateSocial(index, { label: value })}
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={addSocial}
        >
          {T.addSocial}
        </button>
      </BilingualSection>
    </div>
  );
}
