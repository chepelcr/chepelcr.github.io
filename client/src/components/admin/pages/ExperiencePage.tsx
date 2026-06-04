import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { Modal } from "@/components/admin/Modal";
import {
  BilingualSection,
  BilingualField,
  BilingualTextArea,
  TextField,
} from "@/components/admin/AdminUI";
import experienceData from "@/content/experience.json";
import { ICON_NAMES, resolveIcon } from "@/lib/icons";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useLanguage } from "@/contexts/language-context";

type Experience = (typeof experienceData)[number];
type Role = Experience["roles"][number];

const selectClass =
  "w-full bg-background border border-border rounded-md px-3 py-2 text-sm";

function emptyRole(): Role {
  return {
    title: { es: "", en: "" },
    period: { es: "", en: "" },
    description: { es: "", en: "" },
    hideFromPdf: false,
  };
}

function emptyExperience(): Experience {
  return {
    id: "",
    company: { es: "", en: "" },
    iconName: "code",
    current: false,
    roles: [emptyRole()],
    skills: [],
  };
}

export default function ExperiencePage() {
  const { language } = useLanguage();
  const T = {
    es: {
      addExperience: "+ Añadir experiencia",
      untitled: "(sin título)",
      more: "más",
      current: "Actual",
      edit: "Editar",
      delete: "Eliminar",
      empty: "Aún no hay entradas de experiencia.",
      confirmDeleteExp: "¿Eliminar esta entrada de experiencia?",
      confirmRemoveRole: "¿Quitar este rol?",
      addTitle: "Añadir experiencia",
      editTitle: "Editar experiencia",
      cancel: "Cancelar",
      apply: "Aplicar",
      company: "Empresa",
      id: "ID",
      icon: "Icono",
      companyName: "Nombre de la empresa",
      currentPosition: "Posición actual",
      roles: "Roles",
      role: "Rol",
      remove: "Quitar",
      title: "Cargo",
      period: "Período",
      description: "Descripción",
      oneAchievement: "Un logro por línea.",
      hideFromPdf: "Ocultar del PDF",
      addRole: "+ Añadir rol",
      skills: "Habilidades",
      skillsCsv: "Habilidades (separadas por comas)",
    },
    en: {
      addExperience: "+ Add experience",
      untitled: "(untitled)",
      more: "more",
      current: "Current",
      edit: "Edit",
      delete: "Delete",
      empty: "No experience entries yet.",
      confirmDeleteExp: "Delete this experience entry?",
      confirmRemoveRole: "Remove this role?",
      addTitle: "Add experience",
      editTitle: "Edit experience",
      cancel: "Cancel",
      apply: "Apply",
      company: "Company",
      id: "ID",
      icon: "Icon",
      companyName: "Company name",
      currentPosition: "Current position",
      roles: "Roles",
      role: "Role",
      remove: "Remove",
      title: "Title",
      period: "Period",
      description: "Description",
      oneAchievement: "One achievement per line.",
      hideFromPdf: "Hide from PDF",
      addRole: "+ Add role",
      skills: "Skills",
      skillsCsv: "Skills (comma-separated)",
    },
  }[language];

  const slice = useAdminStore((state) => state.experience);
  const setExperience = useAdminStore((state) => state.setExperience);

  const [draft, setDraft] = useState<Experience[]>(structuredClone(slice));

  // Modal state: index of the row being edited (-1 = adding) and the working form.
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Experience | null>(null);

  const save = async () => {
    setExperience(draft);
    await downloadJson("experience.json", draft);
  };

  const openAdd = () => {
    setEditIndex(-1);
    setForm(emptyExperience());
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
    if (!window.confirm(T.confirmDeleteExp)) return;
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

  const setFormField = <K extends keyof Experience>(key: K, value: Experience[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const setFormBilingual = (
    key: "company",
    lang: "es" | "en",
    value: string,
  ) =>
    setForm((prev) =>
      prev ? { ...prev, [key]: { ...prev[key], [lang]: value } } : prev,
    );

  const updateRole = (roleIndex: number, patch: Partial<Role>) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            roles: prev.roles.map((role, i) =>
              i === roleIndex ? { ...role, ...patch } : role,
            ),
          }
        : prev,
    );

  const setRoleBilingual = (
    roleIndex: number,
    key: "title" | "period" | "description",
    lang: "es" | "en",
    value: string,
  ) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            roles: prev.roles.map((role, i) =>
              i === roleIndex
                ? { ...role, [key]: { ...role[key], [lang]: value } }
                : role,
            ),
          }
        : prev,
    );

  const addRole = () =>
    setForm((prev) => (prev ? { ...prev, roles: [...prev.roles, emptyRole()] } : prev));

  const removeRole = (roleIndex: number) => {
    if (!window.confirm(T.confirmRemoveRole)) return;
    setForm((prev) =>
      prev ? { ...prev, roles: prev.roles.filter((_, i) => i !== roleIndex) } : prev,
    );
  };

  const setSkills = (raw: string) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            skills: raw
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : prev,
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Experience"
        entity="experience.json"
        value={draft}
        onSave={save}
        actions={
          <button
            type="button"
            className="text-sm font-medium text-accent hover:underline"
            onClick={openAdd}
          >
            {T.addExperience}
          </button>
        }
      />

      <div className="space-y-3">
        {draft.map((item, index) => {
          const Icon = resolveIcon(item.iconName);
          return (
            <div
              key={item.id || index}
              className="flex items-center justify-between gap-4 border border-border rounded-lg bg-card p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background border border-border text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.company.es || item.company.en || item.id || T.untitled}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.roles[0]?.title.es || item.roles[0]?.title.en || ""}
                    {item.roles.length > 1 ? ` +${item.roles.length - 1} ${T.more}` : ""}
                    {item.current ? ` · ${T.current}` : ""}
                  </p>
                </div>
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
          );
        })}
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
            <BilingualSection title={T.company}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  label={T.id}
                  value={form.id}
                  placeholder="company-slug"
                  onChange={(value) => setFormField("id", value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">{T.icon}</label>
                  <select
                    className={selectClass}
                    value={form.iconName}
                    onChange={(e) => setFormField("iconName", e.target.value)}
                  >
                    {ICON_NAMES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <BilingualField
                label={T.companyName}
                es={form.company.es}
                en={form.company.en}
                onChange={(lang, value) => setFormBilingual("company", lang, value)}
              />
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border"
                  checked={form.current}
                  onChange={(e) => setFormField("current", e.target.checked)}
                />
                {T.currentPosition}
              </label>
            </BilingualSection>

            <BilingualSection title={T.roles}>
              {form.roles.map((role, roleIndex) => (
                <div
                  key={roleIndex}
                  className="border border-border rounded-md p-3 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {T.role} #{roleIndex + 1}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() => removeRole(roleIndex)}
                    >
                      {T.remove}
                    </button>
                  </div>
                  <BilingualField
                    label={T.title}
                    es={role.title.es}
                    en={role.title.en}
                    onChange={(lang, value) =>
                      setRoleBilingual(roleIndex, "title", lang, value)
                    }
                  />
                  <BilingualField
                    label={T.period}
                    es={role.period.es}
                    en={role.period.en}
                    onChange={(lang, value) =>
                      setRoleBilingual(roleIndex, "period", lang, value)
                    }
                  />
                  <BilingualTextArea
                    label={T.description}
                    es={role.description.es}
                    en={role.description.en}
                    rows={8}
                    hint={`${T.oneAchievement} ${RICH_TEXT_HINT}`}
                    onChange={(lang, value) =>
                      setRoleBilingual(roleIndex, "description", lang, value)
                    }
                  />
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border"
                      checked={role.hideFromPdf}
                      onChange={(e) =>
                        updateRole(roleIndex, { hideFromPdf: e.target.checked })
                      }
                    />
                    {T.hideFromPdf}
                  </label>
                </div>
              ))}
              <button
                type="button"
                className="text-sm text-accent hover:underline"
                onClick={addRole}
              >
                {T.addRole}
              </button>
            </BilingualSection>

            <BilingualSection title={T.skills}>
              <TextField
                label={T.skillsCsv}
                value={form.skills.join(", ")}
                placeholder="React, Node.js, AWS Lambda"
                onChange={setSkills}
              />
            </BilingualSection>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
