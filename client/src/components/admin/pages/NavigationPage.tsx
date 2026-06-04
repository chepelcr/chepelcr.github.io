import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { BilingualSection, BilingualField, TextField, SelectField } from "@/components/admin/AdminUI";
import { useLanguage } from "@/contexts/language-context";
import navigationData from "@/content/navigation.json";

type Navigation = typeof navigationData;
type NavItem = Navigation["items"][number];

/** Valid landing section slugs (must match the section ids rendered in home.tsx). */
const SECTIONS = ["home", "about", "education", "experience", "skills", "projects", "contact"] as const;

export default function NavigationPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      menuItems: "Elementos del menú",
      item: "Elemento",
      remove: "Quitar",
      section: "Sección",
      order: "Orden",
      label: "Etiqueta",
      addItem: "+ Añadir elemento de menú",
    },
    en: {
      menuItems: "Menu Items",
      item: "Item",
      remove: "Remove",
      section: "Section",
      order: "Order",
      label: "Label",
      addItem: "+ Add menu item",
    },
  }[language];

  const slice = useAdminStore((state) => state.navigation);
  const setNavigation = useAdminStore((state) => state.setNavigation);

  const [draft, setDraft] = useState<Navigation>(structuredClone(slice));

  const setItems = (next: NavItem[]) => setDraft((prev) => ({ ...prev, items: next }));

  const updateItem = (index: number, patch: Partial<NavItem>) =>
    setItems(draft.items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const addItem = () =>
    setItems([
      ...draft.items,
      { section: "", label: { es: "", en: "" }, order: draft.items.length + 1 },
    ]);

  const removeItem = (index: number) =>
    setItems(draft.items.filter((_, i) => i !== index));

  const save = async () => {
    setNavigation(draft);
    await downloadJson("navigation.json", draft);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Navigation" entity="navigation.json" value={draft} onSave={save} />

      <BilingualSection title={T.menuItems}>
        {draft.items.map((item, index) => (
          <div key={index} className="border border-border rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {T.item} #{index + 1}
              </span>
              <button
                type="button"
                className="text-xs text-destructive hover:underline"
                onClick={() => removeItem(index)}
              >
                {T.remove}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SelectField
                label={T.section}
                value={item.section}
                options={SECTIONS}
                onChange={(value) => updateItem(index, { section: value })}
              />
              <TextField
                label={T.order}
                value={String(item.order)}
                placeholder="1"
                onChange={(value) =>
                  updateItem(index, { order: Number(value) || 0 })
                }
              />
            </div>
            <BilingualField
              label={T.label}
              es={item.label.es}
              en={item.label.en}
              onChange={(lang, value) =>
                updateItem(index, { label: { ...item.label, [lang]: value } })
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={addItem}
        >
          {T.addItem}
        </button>
      </BilingualSection>
    </div>
  );
}
