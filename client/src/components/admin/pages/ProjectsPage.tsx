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
import type { Project } from "@/repositories/projects.repository";
import { ICON_NAMES, resolveIcon } from "@/lib/icons";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useLanguage } from "@/contexts/language-context";

type Feature = Project["features"][number];

const selectClass =
  "w-full bg-background border border-border rounded-md px-3 py-2 text-sm";

const ACCESS_MODES = ["request", "link"] as const;

function emptyFeature(): Feature {
  return { es: "", en: "" };
}

function emptyProject(): Project {
  return {
    id: "",
    title: { es: "", en: "" },
    description: { es: "", en: "" },
    type: "",
    image: "",
    technologies: [],
    features: [],
    githubUrl: "",
    liveUrl: "",
    accessMode: "request",
    featured: false,
    includeInCv: false,
    order: 0,
    iconName: "code",
  } as Project;
}

export default function ProjectsPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      addProject: "+ Añadir proyecto",
      untitled: "(sin título)",
      featured: "Destacado",
      inCv: "En CV",
      edit: "Editar",
      delete: "Eliminar",
      empty: "Aún no hay proyectos.",
      confirmDelete: "¿Eliminar este proyecto?",
      confirmRemoveFeature: "¿Quitar esta característica?",
      addTitle: "Añadir proyecto",
      editTitle: "Editar proyecto",
      cancel: "Cancelar",
      apply: "Aplicar",
      project: "Proyecto",
      id: "ID",
      icon: "Icono",
      title: "Título",
      description: "Descripción",
      type: "Tipo",
      image: "Imagen",
      linksAccess: "Enlaces y acceso",
      githubUrl: "URL de GitHub",
      liveUrl: "URL en vivo",
      accessMode: "Modo de acceso",
      order: "Orden",
      includeInCv: "Incluir en CV",
      technologies: "Tecnologías",
      technologiesCsv: "Tecnologías (separadas por comas)",
      features: "Características",
      feature: "Característica",
      remove: "Quitar",
      addFeature: "+ Añadir característica",
    },
    en: {
      addProject: "+ Add project",
      untitled: "(untitled)",
      featured: "Featured",
      inCv: "In CV",
      edit: "Edit",
      delete: "Delete",
      empty: "No projects yet.",
      confirmDelete: "Delete this project?",
      confirmRemoveFeature: "Remove this feature?",
      addTitle: "Add project",
      editTitle: "Edit project",
      cancel: "Cancel",
      apply: "Apply",
      project: "Project",
      id: "ID",
      icon: "Icon",
      title: "Title",
      description: "Description",
      type: "Type",
      image: "Image",
      linksAccess: "Links & access",
      githubUrl: "GitHub URL",
      liveUrl: "Live URL",
      accessMode: "Access mode",
      order: "Order",
      includeInCv: "Include in CV",
      technologies: "Technologies",
      technologiesCsv: "Technologies (comma-separated)",
      features: "Features",
      feature: "Feature",
      remove: "Remove",
      addFeature: "+ Add feature",
    },
  }[language];

  const slice = useAdminStore((state) => state.projects);
  const setProjects = useAdminStore((state) => state.setProjects);

  const [draft, setDraft] = useState<Project[]>(structuredClone(slice));

  // Modal state: index of the row being edited (-1 = adding) and the working form.
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Project | null>(null);

  const save = async () => {
    setProjects(draft);
    await downloadJson("projects.json", draft);
  };

  const openAdd = () => {
    setEditIndex(-1);
    setForm(emptyProject());
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

  const setFormField = <K extends keyof Project>(key: K, value: Project[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const setFormBilingual = (
    key: "title" | "description",
    lang: "es" | "en",
    value: string,
  ) =>
    setForm((prev) =>
      prev ? { ...prev, [key]: { ...prev[key], [lang]: value } } : prev,
    );

  const setTechnologies = (raw: string) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            technologies: raw
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : prev,
    );

  const setFeatureBilingual = (
    featureIndex: number,
    lang: "es" | "en",
    value: string,
  ) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            features: prev.features.map((feature, i) =>
              i === featureIndex ? { ...feature, [lang]: value } : feature,
            ),
          }
        : prev,
    );

  const addFeature = () =>
    setForm((prev) =>
      prev ? { ...prev, features: [...prev.features, emptyFeature()] } : prev,
    );

  const removeFeature = (featureIndex: number) => {
    if (!window.confirm(T.confirmRemoveFeature)) return;
    setForm((prev) =>
      prev
        ? { ...prev, features: prev.features.filter((_, i) => i !== featureIndex) }
        : prev,
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        entity="projects.json"
        value={draft}
        onSave={save}
        actions={
          <button
            type="button"
            className="text-sm font-medium text-accent hover:underline"
            onClick={openAdd}
          >
            {T.addProject}
          </button>
        }
      />

      <div className="space-y-3">
        {draft.map((item, index) => {
          const Icon = resolveIcon(item.iconName ?? "code");
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
                    {item.title.es || item.title.en || item.id || T.untitled}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.type || ""}
                    {item.featured ? ` · ${T.featured}` : ""}
                    {item.includeInCv ? ` · ${T.inCv}` : ""}
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
            <BilingualSection title={T.project}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  label={T.id}
                  value={form.id}
                  placeholder="project-slug"
                  onChange={(value) => setFormField("id", value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">{T.icon}</label>
                  <select
                    className={selectClass}
                    value={form.iconName ?? "code"}
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
                label={T.title}
                es={form.title.es}
                en={form.title.en}
                onChange={(lang, value) => setFormBilingual("title", lang, value)}
              />
              <BilingualTextArea
                label={T.description}
                es={form.description.es}
                en={form.description.en}
                rows={4}
                hint={RICH_TEXT_HINT}
                onChange={(lang, value) => setFormBilingual("description", lang, value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  label={T.type}
                  value={form.type}
                  placeholder="SaaS Platform"
                  onChange={(value) => setFormField("type", value)}
                />
                <MediaPicker
                  label={T.image}
                  value={form.image}
                  onChange={(value) => setFormField("image", value)}
                />
              </div>
            </BilingualSection>

            <BilingualSection title={T.linksAccess}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  label={T.githubUrl}
                  value={form.githubUrl ?? ""}
                  placeholder="https://github.com/..."
                  onChange={(value) => setFormField("githubUrl", value)}
                />
                <TextField
                  label={T.liveUrl}
                  value={form.liveUrl ?? ""}
                  placeholder="https://..."
                  onChange={(value) => setFormField("liveUrl", value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    {T.accessMode}
                  </label>
                  <select
                    className={selectClass}
                    value={form.accessMode}
                    onChange={(e) => setFormField("accessMode", e.target.value)}
                  >
                    {ACCESS_MODES.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>
                <TextField
                  label={T.order}
                  value={String(form.order)}
                  placeholder="1"
                  onChange={(value) =>
                    setFormField("order", Number(value) || 0)
                  }
                />
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={form.featured}
                    onChange={(e) => setFormField("featured", e.target.checked)}
                  />
                  {T.featured}
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={form.includeInCv}
                    onChange={(e) => setFormField("includeInCv", e.target.checked)}
                  />
                  {T.includeInCv}
                </label>
              </div>
            </BilingualSection>

            <BilingualSection title={T.technologies}>
              <TextField
                label={T.technologiesCsv}
                value={form.technologies.join(", ")}
                placeholder="React, TypeScript, AWS Lambda"
                onChange={setTechnologies}
              />
            </BilingualSection>

            <BilingualSection title={T.features}>
              <p className="text-xs text-muted-foreground">{RICH_TEXT_HINT}</p>
              {form.features.map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  className="border border-border rounded-md p-3 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {T.feature} #{featureIndex + 1}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() => removeFeature(featureIndex)}
                    >
                      {T.remove}
                    </button>
                  </div>
                  <BilingualField
                    label={T.feature}
                    es={feature.es}
                    en={feature.en}
                    onChange={(lang, value) =>
                      setFeatureBilingual(featureIndex, lang, value)
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                className="text-sm text-accent hover:underline"
                onClick={addFeature}
              >
                {T.addFeature}
              </button>
            </BilingualSection>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
