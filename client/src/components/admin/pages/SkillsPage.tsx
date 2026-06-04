import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { TextField, BilingualSection } from "@/components/admin/AdminUI";
import { Modal } from "@/components/admin/Modal";
import { ICON_NAMES, resolveIcon } from "@/lib/icons";
import { useLanguage } from "@/contexts/language-context";
import skillsData from "@/content/skills.json";

type Skills = typeof skillsData;
type Category = Skills["categories"][number];
type CategoryItem = Category["items"][number];
type SoftSkill = Skills["soft"][number];
type PdfGroup = Skills["pdf"]["groups"][number];

const inputClass =
  "w-full bg-background border border-border rounded-md px-3 py-2 text-sm";

const LEVEL_TOKENS = [
  "basic",
  "intermediate",
  "advanced",
  "expert",
  "certified",
] as const;

function IconSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const Icon = resolveIcon(value);
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent shrink-0" />
        <select
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {ICON_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function LevelSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <select
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {LEVEL_TOKENS.map((token) => (
          <option key={token} value={token}>
            {token}
          </option>
        ))}
      </select>
    </div>
  );
}

const emptyCategory = (): Category => ({
  key: "",
  iconName: ICON_NAMES[0],
  items: [],
});

const emptyItem = (): CategoryItem => ({
  name: "",
  levelToken: LEVEL_TOKENS[0],
  emoji: "",
});

const emptySoft = (): SoftSkill => ({
  iconName: ICON_NAMES[0],
  titleKey: "",
  descKey: "",
});

const emptyGroup = (): PdfGroup => ({ labelKey: "", items: [] });

export default function SkillsPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      icon: "Icono",
      level: "Nivel",
      technicalCategories: "Categorías técnicas",
      untitled: "(sin título)",
      skills: "habilidades",
      edit: "Editar",
      delete: "Eliminar",
      unnamed: "(sin nombre)",
      addSkill: "+ Añadir habilidad",
      addCategory: "+ Añadir categoría",
      softSkills: "Habilidades blandas",
      noTitleKey: "(sin clave de título)",
      addSoftSkill: "+ Añadir habilidad blanda",
      pdfGroups: "Grupos de habilidades del CV / PDF",
      noLabelKey: "(sin clave de etiqueta)",
      addPdfGroup: "+ Añadir grupo de PDF",
      confirmDeleteCategory: "¿Eliminar esta categoría y todas sus habilidades?",
      confirmDeleteSkill: "¿Eliminar esta habilidad?",
      confirmDeleteSoft: "¿Eliminar esta habilidad blanda?",
      confirmDeleteGroup: "¿Eliminar este grupo de PDF?",
      cancel: "Cancelar",
      apply: "Aplicar",
      addCategoryTitle: "Añadir categoría",
      editCategoryTitle: "Editar categoría",
      addSkillTitle: "Añadir habilidad",
      editSkillTitle: "Editar habilidad",
      addSoftTitle: "Añadir habilidad blanda",
      editSoftTitle: "Editar habilidad blanda",
      addGroupTitle: "Añadir grupo de PDF",
      editGroupTitle: "Editar grupo de PDF",
      key: "Clave",
      categoryHint: "Las habilidades dentro de esta categoría se gestionan desde la vista de lista.",
      name: "Nombre",
      emoji: "Emoji",
      titleKey: "Clave de título",
      descriptionKey: "Clave de descripción",
      labelKey: "Clave de etiqueta",
      items: "Elementos",
      itemsHint: "Uno por línea, o separados por comas.",
    },
    en: {
      icon: "Icon",
      level: "Level",
      technicalCategories: "Technical Categories",
      untitled: "(untitled)",
      skills: "skills",
      edit: "Edit",
      delete: "Delete",
      unnamed: "(unnamed)",
      addSkill: "+ Add skill",
      addCategory: "+ Add category",
      softSkills: "Soft Skills",
      noTitleKey: "(no title key)",
      addSoftSkill: "+ Add soft skill",
      pdfGroups: "CV / PDF Skill Groups",
      noLabelKey: "(no label key)",
      addPdfGroup: "+ Add PDF group",
      confirmDeleteCategory: "Delete this category and all its skills?",
      confirmDeleteSkill: "Delete this skill?",
      confirmDeleteSoft: "Delete this soft skill?",
      confirmDeleteGroup: "Delete this PDF group?",
      cancel: "Cancel",
      apply: "Apply",
      addCategoryTitle: "Add Category",
      editCategoryTitle: "Edit Category",
      addSkillTitle: "Add Skill",
      editSkillTitle: "Edit Skill",
      addSoftTitle: "Add Soft Skill",
      editSoftTitle: "Edit Soft Skill",
      addGroupTitle: "Add PDF Group",
      editGroupTitle: "Edit PDF Group",
      key: "Key",
      categoryHint: "Skills inside this category are managed from the list view.",
      name: "Name",
      emoji: "Emoji",
      titleKey: "Title Key",
      descriptionKey: "Description Key",
      labelKey: "Label Key",
      items: "Items",
      itemsHint: "One per line, or comma-separated.",
    },
  }[language];

  const slice = useAdminStore((state) => state.skills);
  const setSkills = useAdminStore((state) => state.setSkills);

  const [draft, setDraft] = useState<Skills>(() => structuredClone(slice));

  const save = async () => {
    setSkills(draft);
    await downloadJson("skills.json", draft);
  };

  // --- modal state: discriminated by editor kind ---
  type Editor =
    | { kind: "category"; index: number; form: Category }
    | { kind: "item"; catIndex: number; index: number; form: CategoryItem }
    | { kind: "soft"; index: number; form: SoftSkill }
    | { kind: "group"; index: number; form: PdfGroup };

  const [editor, setEditor] = useState<Editor | null>(null);

  const closeEditor = () => setEditor(null);

  const applyEditor = () => {
    if (!editor) return;
    if (editor.kind === "category") {
      setDraft((prev) => ({
        ...prev,
        categories:
          editor.index < 0
            ? [...prev.categories, editor.form]
            : prev.categories.map((c, i) =>
                i === editor.index ? editor.form : c,
              ),
      }));
    } else if (editor.kind === "item") {
      setDraft((prev) => ({
        ...prev,
        categories: prev.categories.map((c, ci) =>
          ci === editor.catIndex
            ? {
                ...c,
                items:
                  editor.index < 0
                    ? [...c.items, editor.form]
                    : c.items.map((it, i) =>
                        i === editor.index ? editor.form : it,
                      ),
              }
            : c,
        ),
      }));
    } else if (editor.kind === "soft") {
      setDraft((prev) => ({
        ...prev,
        soft:
          editor.index < 0
            ? [...prev.soft, editor.form]
            : prev.soft.map((s, i) => (i === editor.index ? editor.form : s)),
      }));
    } else if (editor.kind === "group") {
      setDraft((prev) => ({
        ...prev,
        pdf: {
          ...prev.pdf,
          groups:
            editor.index < 0
              ? [...prev.pdf.groups, editor.form]
              : prev.pdf.groups.map((g, i) =>
                  i === editor.index ? editor.form : g,
                ),
        },
      }));
    }
    setEditor(null);
  };

  // --- delete helpers ---
  const removeCategory = (index: number) => {
    if (!confirm(T.confirmDeleteCategory)) return;
    setDraft((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const removeItem = (catIndex: number, index: number) => {
    if (!confirm(T.confirmDeleteSkill)) return;
    setDraft((prev) => ({
      ...prev,
      categories: prev.categories.map((c, ci) =>
        ci === catIndex
          ? { ...c, items: c.items.filter((_, i) => i !== index) }
          : c,
      ),
    }));
  };

  const removeSoft = (index: number) => {
    if (!confirm(T.confirmDeleteSoft)) return;
    setDraft((prev) => ({
      ...prev,
      soft: prev.soft.filter((_, i) => i !== index),
    }));
  };

  const removeGroup = (index: number) => {
    if (!confirm(T.confirmDeleteGroup)) return;
    setDraft((prev) => ({
      ...prev,
      pdf: { ...prev.pdf, groups: prev.pdf.groups.filter((_, i) => i !== index) },
    }));
  };

  const modalFooter = (
    <>
      <button
        type="button"
        className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-background"
        onClick={closeEditor}
      >
        {T.cancel}
      </button>
      <button
        type="button"
        className="px-3 py-1.5 text-sm rounded-md bg-accent text-accent-foreground hover:opacity-90"
        onClick={applyEditor}
      >
        {T.apply}
      </button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Skills" entity="skills.json" value={draft} onSave={save} />

      {/* ---------- Categories ---------- */}
      <BilingualSection title={T.technicalCategories}>
        <div className="space-y-4">
          {draft.categories.map((category, ci) => {
            const Icon = resolveIcon(category.iconName);
            return (
              <div
                key={ci}
                className="border border-border rounded-md p-3 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-sm font-medium text-foreground truncate">
                      {category.key || T.untitled}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {category.items.length} {T.skills}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      className="text-xs text-accent hover:underline"
                      onClick={() =>
                        setEditor({ kind: "category", index: ci, form: { ...category } })
                      }
                    >
                      {T.edit}
                    </button>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() => removeCategory(ci)}
                    >
                      {T.delete}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pl-1">
                  {category.items.map((item, ii) => (
                    <div
                      key={ii}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="truncate">
                        <span className="mr-1.5">{item.emoji}</span>
                        {item.name || T.unnamed}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {item.levelToken}
                        </span>
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          className="text-xs text-accent hover:underline"
                          onClick={() =>
                            setEditor({
                              kind: "item",
                              catIndex: ci,
                              index: ii,
                              form: { ...item },
                            })
                          }
                        >
                          {T.edit}
                        </button>
                        <button
                          type="button"
                          className="text-xs text-destructive hover:underline"
                          onClick={() => removeItem(ci, ii)}
                        >
                          {T.delete}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-xs text-accent hover:underline"
                    onClick={() =>
                      setEditor({
                        kind: "item",
                        catIndex: ci,
                        index: -1,
                        form: emptyItem(),
                      })
                    }
                  >
                    {T.addSkill}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={() =>
            setEditor({ kind: "category", index: -1, form: emptyCategory() })
          }
        >
          {T.addCategory}
        </button>
      </BilingualSection>

      {/* ---------- Soft skills ---------- */}
      <BilingualSection title={T.softSkills}>
        <div className="space-y-2">
          {draft.soft.map((soft, si) => {
            const Icon = resolveIcon(soft.iconName);
            return (
              <div
                key={si}
                className="flex items-center justify-between gap-2 border border-border rounded-md p-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="h-4 w-4 text-accent shrink-0" />
                  <span className="text-sm truncate">
                    {soft.titleKey || T.noTitleKey}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    className="text-xs text-accent hover:underline"
                    onClick={() =>
                      setEditor({ kind: "soft", index: si, form: { ...soft } })
                    }
                  >
                    {T.edit}
                  </button>
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline"
                    onClick={() => removeSoft(si)}
                  >
                    {T.delete}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={() => setEditor({ kind: "soft", index: -1, form: emptySoft() })}
        >
          {T.addSoftSkill}
        </button>
      </BilingualSection>

      {/* ---------- PDF groups ---------- */}
      <BilingualSection title={T.pdfGroups}>
        <div className="space-y-2">
          {draft.pdf.groups.map((group, gi) => (
            <div
              key={gi}
              className="flex items-center justify-between gap-2 border border-border rounded-md p-3"
            >
              <div className="min-w-0">
                <span className="text-sm font-medium text-foreground truncate block">
                  {group.labelKey || T.noLabelKey}
                </span>
                <span className="text-xs text-muted-foreground truncate block">
                  {group.items.join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  className="text-xs text-accent hover:underline"
                  onClick={() =>
                    setEditor({
                      kind: "group",
                      index: gi,
                      form: { ...group, items: [...group.items] },
                    })
                  }
                >
                  {T.edit}
                </button>
                <button
                  type="button"
                  className="text-xs text-destructive hover:underline"
                  onClick={() => removeGroup(gi)}
                >
                  {T.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={() => setEditor({ kind: "group", index: -1, form: emptyGroup() })}
        >
          {T.addPdfGroup}
        </button>
      </BilingualSection>

      {/* ---------- Editor modal ---------- */}
      <Modal
        open={editor !== null}
        onClose={closeEditor}
        title={
          editor?.kind === "category"
            ? editor.index < 0
              ? T.addCategoryTitle
              : T.editCategoryTitle
            : editor?.kind === "item"
              ? editor.index < 0
                ? T.addSkillTitle
                : T.editSkillTitle
              : editor?.kind === "soft"
                ? editor.index < 0
                  ? T.addSoftTitle
                  : T.editSoftTitle
                : editor?.kind === "group"
                  ? editor.index < 0
                    ? T.addGroupTitle
                    : T.editGroupTitle
                  : ""
        }
        footer={modalFooter}
      >
        {editor?.kind === "category" && (
          <div className="space-y-4">
            <TextField
              label={T.key}
              value={editor.form.key}
              placeholder="backend | cloud | databases | ..."
              onChange={(value) =>
                setEditor({ ...editor, form: { ...editor.form, key: value } })
              }
            />
            <IconSelect
              label={T.icon}
              value={editor.form.iconName}
              onChange={(value) =>
                setEditor({ ...editor, form: { ...editor.form, iconName: value } })
              }
            />
            <p className="text-xs text-muted-foreground">
              {T.categoryHint}
            </p>
          </div>
        )}

        {editor?.kind === "item" && (
          <div className="space-y-4">
            <TextField
              label={T.name}
              value={editor.form.name}
              placeholder="Java (Spring Boot)"
              onChange={(value) =>
                setEditor({ ...editor, form: { ...editor.form, name: value } })
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <LevelSelect
                label={T.level}
                value={editor.form.levelToken}
                onChange={(value) =>
                  setEditor({
                    ...editor,
                    form: { ...editor.form, levelToken: value },
                  })
                }
              />
              <TextField
                label={T.emoji}
                value={editor.form.emoji}
                placeholder="☕"
                onChange={(value) =>
                  setEditor({ ...editor, form: { ...editor.form, emoji: value } })
                }
              />
            </div>
          </div>
        )}

        {editor?.kind === "soft" && (
          <div className="space-y-4">
            <IconSelect
              label={T.icon}
              value={editor.form.iconName}
              onChange={(value) =>
                setEditor({ ...editor, form: { ...editor.form, iconName: value } })
              }
            />
            <TextField
              label={T.titleKey}
              value={editor.form.titleKey}
              placeholder="skills.analyticalThinking"
              onChange={(value) =>
                setEditor({ ...editor, form: { ...editor.form, titleKey: value } })
              }
            />
            <TextField
              label={T.descriptionKey}
              value={editor.form.descKey}
              placeholder="skills.analyticalDesc"
              onChange={(value) =>
                setEditor({ ...editor, form: { ...editor.form, descKey: value } })
              }
            />
          </div>
        )}

        {editor?.kind === "group" && (
          <div className="space-y-4">
            <TextField
              label={T.labelKey}
              value={editor.form.labelKey}
              placeholder="cv.skills.programming"
              onChange={(value) =>
                setEditor({ ...editor, form: { ...editor.form, labelKey: value } })
              }
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                {T.items}
              </label>
              <p className="text-xs text-muted-foreground">
                {T.itemsHint}
              </p>
              <textarea
                className={inputClass}
                rows={6}
                value={editor.form.items.join("\n")}
                placeholder={"Python\nJava\nTypeScript"}
                onChange={(e) =>
                  setEditor({
                    ...editor,
                    form: {
                      ...editor.form,
                      items: e.target.value
                        .split(/[\n,]/)
                        .map((s) => s.trim())
                        .filter(Boolean),
                    },
                  })
                }
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
