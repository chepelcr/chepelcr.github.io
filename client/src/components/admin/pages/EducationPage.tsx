import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { Modal } from "@/components/admin/Modal";
import {
  BilingualSection,
  BilingualField,
  TextField,
} from "@/components/admin/AdminUI";
import { useLanguage } from "@/contexts/language-context";
import educationData from "@/content/education.json";

type Education = (typeof educationData)[number];

function emptyEducation(): Education {
  return {
    id: "",
    degree: { es: "", en: "" },
    institution: { es: "", en: "" },
    period: "",
  };
}

export default function EducationPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      addEducation: "+ Añadir formación",
      untitled: "(sin título)",
      edit: "Editar",
      delete: "Eliminar",
      empty: "Aún no hay formaciones.",
      confirmDelete: "¿Eliminar esta entrada de formación?",
      addTitle: "Añadir formación",
      editTitle: "Editar formación",
      cancel: "Cancelar",
      apply: "Aplicar",
      entry: "Entrada",
      id: "ID",
      period: "Período",
      degree: "Título",
      institution: "Institución",
    },
    en: {
      addEducation: "+ Add education",
      untitled: "(untitled)",
      edit: "Edit",
      delete: "Delete",
      empty: "No education entries yet.",
      confirmDelete: "Delete this education entry?",
      addTitle: "Add education",
      editTitle: "Edit education",
      cancel: "Cancel",
      apply: "Apply",
      entry: "Entry",
      id: "ID",
      period: "Period",
      degree: "Degree",
      institution: "Institution",
    },
  }[language];

  const slice = useAdminStore((state) => state.education);
  const setEducation = useAdminStore((state) => state.setEducation);

  const [draft, setDraft] = useState<Education[]>(structuredClone(slice));

  // Modal state: index of the row being edited (-1 = adding) and the working form.
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Education | null>(null);

  const save = async () => {
    setEducation(draft);
    await downloadJson("education.json", draft);
  };

  const openAdd = () => {
    setEditIndex(-1);
    setForm(emptyEducation());
  };

  const openEdit = (index: number) => {
    setEditIndex(index);
    setForm(structuredClone(draft[index]));
  };

  const closeModal = () => {
    setEditIndex(null);
    setForm(null);
  };

  const removeRow = (index: number) => {
    if (!window.confirm(T.confirmDelete)) return;
    setDraft((prev) => prev.filter((_, i) => i !== index));
  };

  const applyForm = () => {
    if (form === null || editIndex === null) return;
    setDraft((prev) =>
      editIndex === -1
        ? [...prev, form]
        : prev.map((item, i) => (i === editIndex ? form : item)),
    );
    closeModal();
  };

  // --- form mutators (operate immutably on the modal-local form) ---

  const setFormField = <K extends keyof Education>(key: K, value: Education[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const setFormBilingual = (
    key: "degree" | "institution",
    lang: "es" | "en",
    value: string,
  ) =>
    setForm((prev) =>
      prev ? { ...prev, [key]: { ...prev[key], [lang]: value } } : prev,
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Education"
        entity="education.json"
        value={draft}
        onSave={save}
        actions={
          <button
            type="button"
            className="text-sm font-medium text-accent hover:underline"
            onClick={openAdd}
          >
            {T.addEducation}
          </button>
        }
      />

      <div className="space-y-3">
        {draft.map((item, index) => (
          <div
            key={item.id || index}
            className="flex items-center justify-between gap-4 border border-border rounded-lg bg-card p-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {item.degree.es || item.degree.en || item.id || T.untitled}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.institution.es || item.institution.en || ""}
                {item.period ? ` · ${item.period}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                className="text-sm text-accent hover:underline"
                onClick={() => openEdit(index)}
              >
                {T.edit}
              </button>
              <button
                type="button"
                className="text-sm text-destructive hover:underline"
                onClick={() => removeRow(index)}
              >
                {T.delete}
              </button>
            </div>
          </div>
        ))}
        {draft.length === 0 ? (
          <p className="text-sm text-muted-foreground">{T.empty}</p>
        ) : null}
      </div>

      <Modal
        open={form !== null}
        onClose={closeModal}
        title={editIndex === -1 ? T.addTitle : T.editTitle}
        footer={
          <>
            <button
              type="button"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
              onClick={closeModal}
            >
              {T.cancel}
            </button>
            <button
              type="button"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
              onClick={applyForm}
            >
              {T.apply}
            </button>
          </>
        }
      >
        {form ? (
          <div className="space-y-4">
            <BilingualSection title={T.entry}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  label={T.id}
                  value={form.id}
                  placeholder="education-slug"
                  onChange={(value) => setFormField("id", value)}
                />
                <TextField
                  label={T.period}
                  value={form.period}
                  placeholder="2017 - 2022"
                  onChange={(value) => setFormField("period", value)}
                />
              </div>
              <BilingualField
                label={T.degree}
                es={form.degree.es}
                en={form.degree.en}
                onChange={(lang, value) => setFormBilingual("degree", lang, value)}
              />
              <BilingualField
                label={T.institution}
                es={form.institution.es}
                en={form.institution.en}
                onChange={(lang, value) =>
                  setFormBilingual("institution", lang, value)
                }
              />
            </BilingualSection>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
