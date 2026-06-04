import { useState } from "react";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { Modal } from "@/components/admin/Modal";
import {
  BilingualField,
  BilingualSection,
  TextField,
} from "@/components/admin/AdminUI";
import { useLanguage } from "@/contexts/language-context";
import trainingData from "@/content/training.json";

type Training = (typeof trainingData)[number];
type Course = Training["courses"][number];

function emptyCourse(): Course {
  return { es: "", en: "" };
}

function emptyTraining(): Training {
  return {
    id: "",
    institution: { es: "", en: "" },
    courses: [],
  };
}

export default function TrainingPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      addGroup: "+ Añadir grupo de formación",
      untitled: "(sin título)",
      course: "curso",
      courses: "cursos",
      edit: "Editar",
      delete: "Eliminar",
      empty: "Aún no hay grupos de formación.",
      confirmDelete: "¿Eliminar este grupo de formación?",
      addTitle: "Añadir grupo de formación",
      editTitle: "Editar grupo de formación",
      cancel: "Cancelar",
      apply: "Aplicar",
      details: "Detalles",
      id: "ID",
      institution: "Institución",
      coursesTitle: "Cursos",
      courseLabel: "Curso",
      remove: "Quitar",
      courseName: "Nombre del curso",
      noCourses: "Aún no hay cursos.",
      addCourse: "+ Añadir curso",
    },
    en: {
      addGroup: "+ Add training group",
      untitled: "(untitled)",
      course: "course",
      courses: "courses",
      edit: "Edit",
      delete: "Delete",
      empty: "No training groups yet.",
      confirmDelete: "Delete this training group?",
      addTitle: "Add training group",
      editTitle: "Edit training group",
      cancel: "Cancel",
      apply: "Apply",
      details: "Details",
      id: "ID",
      institution: "Institution",
      coursesTitle: "Courses",
      courseLabel: "Course",
      remove: "Remove",
      courseName: "Course name",
      noCourses: "No courses yet.",
      addCourse: "+ Add course",
    },
  }[language];

  const slice = useAdminStore((state) => state.training);
  const setTraining = useAdminStore((state) => state.setTraining);

  const [draft, setDraft] = useState<Training[]>(structuredClone(slice));

  // Modal state: index of the row being edited (-1 = adding) and the working form.
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Training | null>(null);

  const save = async () => {
    setTraining(draft);
    await downloadJson("training.json", draft);
  };

  const openAdd = () => {
    setEditIndex(-1);
    setForm(emptyTraining());
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

  const setFormField = <K extends keyof Training>(
    key: K,
    value: Training[K],
  ) => setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const setInstitution = (lang: "es" | "en", value: string) =>
    setForm((prev) =>
      prev
        ? { ...prev, institution: { ...prev.institution, [lang]: value } }
        : prev,
    );

  const addCourse = () =>
    setForm((prev) =>
      prev ? { ...prev, courses: [...prev.courses, emptyCourse()] } : prev,
    );

  const removeCourse = (courseIndex: number) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            courses: prev.courses.filter((_, i) => i !== courseIndex),
          }
        : prev,
    );

  const setCourse = (courseIndex: number, lang: "es" | "en", value: string) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            courses: prev.courses.map((course, i) =>
              i === courseIndex ? { ...course, [lang]: value } : course,
            ),
          }
        : prev,
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training"
        entity="training.json"
        value={draft}
        onSave={save}
        actions={
          <button
            type="button"
            className="text-sm font-medium text-accent hover:underline"
            onClick={openAdd}
          >
            {T.addGroup}
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
                {item.institution.es || item.institution.en || item.id || T.untitled}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.courses.length} {item.courses.length === 1 ? T.course : T.courses}
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
              <TextField
                label={T.id}
                value={form.id}
                placeholder="ucr-academy"
                onChange={(value) => setFormField("id", value)}
              />
              <BilingualField
                label={T.institution}
                es={form.institution.es}
                en={form.institution.en}
                onChange={setInstitution}
              />
            </BilingualSection>

            <BilingualSection title={T.coursesTitle}>
              <div className="space-y-3">
                {form.courses.map((course, courseIndex) => (
                  <div
                    key={courseIndex}
                    className="border border-border rounded-md p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        {T.courseLabel} {courseIndex + 1}
                      </span>
                      <button
                        type="button"
                        className="text-xs text-destructive hover:underline"
                        onClick={() => removeCourse(courseIndex)}
                      >
                        {T.remove}
                      </button>
                    </div>
                    <BilingualField
                      label={T.courseName}
                      es={course.es}
                      en={course.en}
                      onChange={(lang, value) => setCourse(courseIndex, lang, value)}
                    />
                  </div>
                ))}
                {form.courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{T.noCourses}</p>
                ) : null}
                <button
                  type="button"
                  className="text-sm font-medium text-accent hover:underline"
                  onClick={addCourse}
                >
                  {T.addCourse}
                </button>
              </div>
            </BilingualSection>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
