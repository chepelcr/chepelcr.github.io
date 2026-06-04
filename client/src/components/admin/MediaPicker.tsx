import { useRef, useState } from "react";
import { Image as ImageIcon, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useAdminStore } from "@/lib/admin-store";
import { Modal } from "@/components/admin/Modal";
import { resolveAssetUrl, mediaRef } from "@/lib/media";
import { uploadToLibrary, addExternalToLibrary } from "@/lib/media-upload";

interface Props {
  /** Stored reference (root-relative path or absolute URL). */
  value: string;
  /** Called with the new stored reference when the user picks/uploads/adds one. */
  onChange: (ref: string) => void;
  label?: string;
  /** Media kinds to show in the gallery (default ["image"]). */
  kinds?: string[];
}

const TX = {
  es: {
    select: "Seleccionar imagen",
    change: "Cambiar imagen",
    clear: "Quitar",
    title: "Biblioteca de medios",
    addTitle: "Añadir medio",
    dropHint: "Arrastra una imagen aquí o haz clic para subir",
    uploading: "Subiendo…",
    add: "Agregar",
    urlPlaceholder: "…o pega una URL (https://…)",
    gallery: "Galería",
    empty: "No hay medios todavía.",
    uploadFailed: "Error al subir la imagen.",
  },
  en: {
    select: "Select image",
    change: "Change image",
    clear: "Clear",
    title: "Media library",
    addTitle: "Add media",
    dropHint: "Drag an image here or click to upload",
    uploading: "Uploading…",
    add: "Add",
    urlPlaceholder: "…or paste a URL (https://…)",
    gallery: "Gallery",
    empty: "No media yet.",
    uploadFailed: "Image upload failed.",
  },
};

const inputCls = "w-full bg-background border border-border rounded-md px-3 py-2 text-sm";

export function MediaPicker({ value, onChange, label, kinds = ["image"] }: Props) {
  const { language } = useLanguage();
  const media = useAdminStore((s) => s.media);
  const [open, setOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const t = TX[language];

  const items = (media.items as Array<Record<string, unknown>>).filter((i) =>
    kinds.includes((i.kind as string) ?? "image"),
  );

  const pick = (ref: string) => {
    onChange(ref);
    setOpen(false);
  };

  // Mode 1: upload / drop a file.
  const onFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    const item = await uploadToLibrary(file);
    setBusy(false);
    if (item) pick(mediaRef(item as never));
    else window.alert(t.uploadFailed);
  };

  // Mode 2: add by URL.
  const addUrl = async () => {
    const url = urlInput.trim();
    if (!url) return;
    setBusy(true);
    const item = await addExternalToLibrary(url);
    setBusy(false);
    setUrlInput("");
    pick(mediaRef(item as never));
  };

  return (
    <div className="space-y-1.5">
      {label ? <label className="block text-sm font-medium text-foreground">{label}</label> : null}

      {/* Field: preview + button (opens the picker modal) + editable raw ref */}
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
          {value ? (
            <img src={resolveAssetUrl(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-[#0f172a] transition-opacity hover:opacity-90"
          >
            {value ? t.change : t.select}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-background"
            >
              {t.clear}
            </button>
          ) : null}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t.title}>
        <div className="space-y-5">
          {/* Add card — two modes: drop/upload OR paste a URL */}
          <div className="rounded-lg border border-border p-4">
            <p className="mb-2 text-sm font-semibold text-foreground">{t.addTitle}</p>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                void onFiles(e.dataTransfer.files);
              }}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-background p-6 text-center transition-colors hover:border-accent"
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{busy ? t.uploading : t.dropHint}</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                void onFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <div className="mt-3 flex items-center gap-2">
              <input
                className={`flex-1 ${inputCls}`}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={t.urlPlaceholder}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void addUrl();
                }}
              />
              <button
                type="button"
                onClick={() => void addUrl()}
                className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-background"
              >
                {t.add}
              </button>
            </div>
          </div>

          {/* Gallery — pick an existing item */}
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">{t.gallery}</p>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.empty}</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {items.map((item) => {
                  const ref = mediaRef(item as never);
                  const selected = ref === value;
                  const alt = (item.alt as { es?: string; en?: string } | undefined)?.[language] ?? "";
                  return (
                    <button
                      key={(item.id as string) ?? ref}
                      type="button"
                      onClick={() => pick(ref)}
                      title={(item.filename as string) ?? ""}
                      className={`aspect-square overflow-hidden rounded-md border bg-background transition-colors ${
                        selected ? "border-accent ring-2 ring-accent" : "border-border hover:border-accent"
                      }`}
                    >
                      <img src={resolveAssetUrl(ref)} alt={alt} className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
