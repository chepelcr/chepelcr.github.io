import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { Modal } from "@/components/admin/Modal";
import {
  BilingualSection,
  BilingualTextArea,
  TextField,
} from "@/components/admin/AdminUI";
import { useLanguage } from "@/contexts/language-context";
import certificationsData from "@/content/certifications.json";

type Certification = (typeof certificationsData)[number];

function emptyCertification(): Certification {
  return {
    id: "",
    name: "",
    provider: "",
    badge: "",
    date: "",
    description: { es: "", en: "" },
    verifyUrl: "",
  };
}

export default function CertificationsPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      addCertification: "+ Añadir certificación",
      untitled: "(sin título)",
      edit: "Editar",
      delete: "Eliminar",
      empty: "Aún no hay certificaciones.",
      confirmDelete: "¿Eliminar esta certificación?",
      addTitle: "Añadir certificación",
      editTitle: "Editar certificación",
      cancel: "Cancelar",
      apply: "Aplicar",
      details: "Detalles",
      id: "ID",
      date: "Fecha",
      name: "Nombre",
      provider: "Proveedor",
      badge: "Insignia",
      verifyUrl: "URL de verificación",
      description: "Descripción",
    },
    en: {
      addCertification: "+ Add certification",
      untitled: "(untitled)",
      edit: "Edit",
      delete: "Delete",
      empty: "No certifications yet.",
      confirmDelete: "Delete this certification?",
      addTitle: "Add certification",
      editTitle: "Edit certification",
      cancel: "Cancel",
      apply: "Apply",
      details: "Details",
      id: "ID",
      date: "Date",
      name: "Name",
      provider: "Provider",
      badge: "Badge",
      verifyUrl: "Verify URL",
      description: "Description",
    },
  }[language];

  const slice = useAdminStore((state) => state.certifications);
  const setCertifications = useAdminStore((state) => state.setCertifications);

  const [draft, setDraft] = useState<Certification[]>(structuredClone(slice));

  // Modal state: index of the row being edited (-1 = adding) and the working form.
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Certification | null>(null);

  const save = async () => {
    setCertifications(draft);
    await downloadJson("certifications.json", draft);
  };

  const openAdd = () => {
    setEditIndex(-1);
    setForm(emptyCertification());
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

  const setFormField = <K extends keyof Certification>(
    key: K,
    value: Certification[K],
  ) => setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const setDescription = (lang: "es" | "en", value: string) =>
    setForm((prev) =>
      prev
        ? { ...prev, description: { ...prev.description, [lang]: value } }
        : prev,
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certifications"
        entity="certifications.json"
        value={draft}
        onSave={save}
        actions={
          <button
            type="button"
            className="text-sm font-medium text-accent hover:underline"
            onClick={openAdd}
          >
            {T.addCertification}
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
                {item.name || item.id || T.untitled}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {[item.provider, item.date].filter(Boolean).join(" · ")}
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
            <BilingualSection title={T.details}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  label={T.id}
                  value={form.id}
                  placeholder="cert-slug"
                  onChange={(value) => setFormField("id", value)}
                />
                <TextField
                  label={T.date}
                  value={form.date}
                  placeholder="13-04-2023"
                  onChange={(value) => setFormField("date", value)}
                />
              </div>
              <TextField
                label={T.name}
                value={form.name}
                placeholder="AWS Certified Solutions Architect"
                onChange={(value) => setFormField("name", value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  label={T.provider}
                  value={form.provider}
                  placeholder="AWS"
                  onChange={(value) => setFormField("provider", value)}
                />
                <TextField
                  label={T.badge}
                  value={form.badge}
                  placeholder="AWS"
                  onChange={(value) => setFormField("badge", value)}
                />
              </div>
              <TextField
                label={T.verifyUrl}
                value={form.verifyUrl}
                placeholder="https://www.credly.com/badges/..."
                onChange={(value) => setFormField("verifyUrl", value)}
              />
            </BilingualSection>

            <BilingualSection title={T.description}>
              <BilingualTextArea
                label={T.description}
                es={form.description.es}
                en={form.description.en}
                rows={3}
                onChange={setDescription}
              />
            </BilingualSection>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
