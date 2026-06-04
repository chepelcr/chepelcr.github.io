import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { Modal } from "@/components/admin/Modal";
import { BilingualSection, BilingualField, TextField } from "@/components/admin/AdminUI";
import { uploadAsset } from "@/lib/local-cms";
import mediaData from "@/content/media.json";

type Media = typeof mediaData;
type MediaItem = Media["items"][number];

const KINDS = ["image", "video", "document", "other"] as const;

const TX = {
  es: {
    upload: "Subir",
    addUrl: "+ Añadir por URL",
    confirmDelete: "¿Eliminar este elemento multimedia?",
    noAlt: "Sin texto alternativo",
    editAlt: "Editar alt",
    delete: "Eliminar",
    empty: "No hay medios todavía.",
    unnamed: "(sin nombre)",
    addUrlTitle: "Añadir por URL",
    cancel: "Cancelar",
    add: "Agregar",
    urlLabel: "URL",
    kindLabel: "Tipo",
    editAltTitle: "Editar texto alternativo",
    apply: "Aplicar",
    altSection: "Texto alternativo",
    altLabel: "Alt",
    uploadFailed: "Error al subir:",
  },
  en: {
    upload: "Upload",
    addUrl: "+ Add by URL",
    confirmDelete: "Delete this media item?",
    noAlt: "No alt text",
    editAlt: "Edit alt",
    delete: "Delete",
    empty: "No media yet.",
    unnamed: "(unnamed)",
    addUrlTitle: "Add by URL",
    cancel: "Cancel",
    add: "Add",
    urlLabel: "URL",
    kindLabel: "Kind",
    editAltTitle: "Edit alt text",
    apply: "Apply",
    altSection: "Alt text",
    altLabel: "Alt",
    uploadFailed: "Upload failed:",
  },
};

/** Best-effort src for previewing an item regardless of source. */
function itemSrc(item: MediaItem): string {
  const source = (item as { source?: string }).source;
  if (source === "external") return (item as { url?: string }).url ?? "";
  return (item as { path?: string }).path || (item as { url?: string }).url || "";
}

function itemKind(item: MediaItem): string {
  return (item as { kind?: string }).kind ?? "other";
}

function itemAlt(item: MediaItem): { es: string; en: string } {
  const alt = (item as { alt?: { es?: string; en?: string } }).alt ?? {};
  return { es: alt.es ?? "", en: alt.en ?? "" };
}

function randomId(): string {
  return `media-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function MediaPage() {
  const { language } = useLanguage();
  const t = TX[language];
  const slice = useAdminStore((state) => state.media);
  const setMedia = useAdminStore((state) => state.setMedia);

  const [draft, setDraft] = useState<Media>(structuredClone(slice));

  const [urlOpen, setUrlOpen] = useState(false);
  const [urlForm, setUrlForm] = useState({ url: "", kind: "image" as string });

  const [altIndex, setAltIndex] = useState<number | null>(null);
  const [altForm, setAltForm] = useState<{ es: string; en: string }>({ es: "", en: "" });

  const items = draft.items;

  const save = async () => {
    setMedia(draft);
    await downloadJson("media.json", draft);
  };

  const prepend = (item: MediaItem) =>
    setDraft((prev) => ({ ...prev, items: [item, ...prev.items] }));

  const removeRow = (index: number) => {
    if (!window.confirm(t.confirmDelete)) return;
    setDraft((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  // --- Add by URL ---
  const openUrl = () => {
    setUrlForm({ url: "", kind: "image" });
    setUrlOpen(true);
  };

  const applyUrl = () => {
    const url = urlForm.url.trim();
    if (!url) return;
    const filename = url.split("/").pop()?.split("?")[0] || url;
    prepend({
      id: randomId(),
      kind: urlForm.kind,
      source: "external",
      url,
      filename,
      alt: { es: "", en: "" },
      createdAt: new Date().toISOString(),
    } as unknown as MediaItem);
    setUrlOpen(false);
  };

  // --- Upload from disk ---
  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    const result = await uploadAsset(file.name, dataUrl, "media");
    if (!result.ok || !result.url) {
      window.alert(`${t.uploadFailed} ${result.error ?? "unknown error"}`);
      return;
    }
    const kind = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : "other";
    prepend({
      id: randomId(),
      kind,
      source: "local",
      path: result.url,
      filename: file.name,
      mime: file.type,
      size: file.size,
      alt: { es: "", en: "" },
      createdAt: new Date().toISOString(),
    } as unknown as MediaItem);
  };

  // --- Alt editing ---
  const openAlt = (index: number) => {
    setAltIndex(index);
    setAltForm(itemAlt(items[index]));
  };

  const closeAlt = () => {
    setAltIndex(null);
    setAltForm({ es: "", en: "" });
  };

  const applyAlt = () => {
    if (altIndex === null) return;
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === altIndex ? ({ ...item, alt: { ...altForm } } as MediaItem) : item,
      ),
    }));
    closeAlt();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media"
        entity="media.json"
        value={draft}
        onSave={save}
        actions={
          <>
            <label className="cursor-pointer text-sm font-medium text-accent hover:underline">
              {t.upload}
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  void onUpload(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              className="text-sm font-medium text-accent hover:underline"
              onClick={openUrl}
            >
              {t.addUrl}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => {
          const kind = itemKind(item);
          const src = itemSrc(item);
          const alt = itemAlt(item);
          const filename = (item as { filename?: string }).filename ?? "";
          return (
            <div
              key={(item as { id?: string }).id || index}
              className="flex flex-col gap-2 border border-border rounded-lg bg-card p-3"
            >
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md bg-background border border-border">
                {kind === "image" && src ? (
                  <img
                    src={src}
                    alt={alt.es || alt.en || filename}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">{kind}</span>
                )}
              </div>
              <p className="text-xs font-medium text-foreground truncate" title={filename}>
                {filename || t.unnamed}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {alt[language] || alt.es || alt.en || t.noAlt}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  className="text-xs text-accent hover:underline"
                  onClick={() => openAlt(index)}
                >
                  {t.editAlt}
                </button>
                <button
                  type="button"
                  className="text-xs text-destructive hover:underline"
                  onClick={() => removeRow(index)}
                >
                  {t.delete}
                </button>
              </div>
            </div>
          );
        })}
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.empty}</p>
        ) : null}
      </div>

      <Modal
        open={urlOpen}
        onClose={() => setUrlOpen(false)}
        title={t.addUrlTitle}
        footer={
          <>
            <button
              type="button"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
              onClick={() => setUrlOpen(false)}
            >
              {t.cancel}
            </button>
            <button
              type="button"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-[#0f172a] hover:opacity-90"
              onClick={applyUrl}
            >
              {t.add}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <TextField
            label={t.urlLabel}
            value={urlForm.url}
            placeholder="https://example.com/image.png"
            onChange={(value) => setUrlForm((prev) => ({ ...prev, url: value }))}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">{t.kindLabel}</label>
            <select
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              value={urlForm.kind}
              onChange={(e) => setUrlForm((prev) => ({ ...prev, kind: e.target.value }))}
            >
              {KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {kind}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={altIndex !== null}
        onClose={closeAlt}
        title={t.editAltTitle}
        footer={
          <>
            <button
              type="button"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
              onClick={closeAlt}
            >
              {t.cancel}
            </button>
            <button
              type="button"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-[#0f172a] hover:opacity-90"
              onClick={applyAlt}
            >
              {t.apply}
            </button>
          </>
        }
      >
        <BilingualSection title={t.altSection}>
          <BilingualField
            label={t.altLabel}
            es={altForm.es}
            en={altForm.en}
            onChange={(lang, value) => setAltForm((prev) => ({ ...prev, [lang]: value }))}
          />
        </BilingualSection>
      </Modal>
    </div>
  );
}
