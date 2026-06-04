import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { useLanguage } from "@/contexts/language-context";
import { CONTENT_PAGES, labelForFile } from "@/admin/manifest";
import { resolveIcon } from "@/lib/icons";
import { PageHeader } from "@/components/admin/PageHeader";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function kindOf(value: unknown): "object" | "array" | "string" | "number" | "boolean" | "null" {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  const type = typeof value;
  if (type === "object") return "object";
  return type as "string" | "number" | "boolean";
}

/** Renders a primitive leaf value with type-appropriate styling. */
function Leaf({ value }: { value: JsonValue }) {
  const kind = kindOf(value);
  if (kind === "string") return <span className="text-[#10B981] break-all">"{value as string}"</span>;
  if (kind === "number") return <span className="text-[#F59E0B]">{String(value)}</span>;
  if (kind === "boolean") return <span className="text-[#8B5CF6]">{String(value)}</span>;
  return <span className="text-muted-foreground italic">null</span>;
}

function JsonNode({ label, value, depth }: { label?: string; value: JsonValue; depth: number }) {
  const kind = kindOf(value);
  const isBranch = kind === "object" || kind === "array";
  const [open, setOpen] = useState(depth < 2);

  if (!isBranch) {
    return (
      <div className="flex gap-2 py-0.5 font-mono text-xs leading-relaxed">
        {label !== undefined ? <span className="text-primary font-medium shrink-0">{label}:</span> : null}
        <Leaf value={value} />
      </div>
    );
  }

  const entries: [string, JsonValue][] =
    kind === "array"
      ? (value as JsonValue[]).map((item, index) => [String(index), item])
      : Object.entries(value as Record<string, JsonValue>);
  const summary = kind === "array" ? `[${entries.length}]` : `{…}`;

  return (
    <div className="font-mono text-xs leading-relaxed">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-1 py-0.5 text-left hover:bg-background rounded-sm"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
        {label !== undefined ? <span className="text-primary font-medium">{label}:</span> : null}
        <span className="text-muted-foreground">{summary}</span>
      </button>
      {open ? (
        <div className="ml-4 border-l border-border pl-3">
          {entries.map(([childLabel, childValue]) => (
            <JsonNode key={childLabel} label={childLabel} value={childValue} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const T = {
  es: { title: "Explorador de Contenido", subtitle: "Selecciona un archivo para inspeccionar su contenido JSON en vivo." },
  en: { title: "Content Explorer", subtitle: "Select a file to inspect its live JSON content." },
};

/** Maps each content filename → its live store slice. */
function useContentFiles(): { file: string; slice: JsonValue }[] {
  const store = useAdminStore();
  const map: Record<string, unknown> = {
    "personal-info.json": store.personalInfo,
    "hero.json": store.hero,
    "about.json": store.about,
    "skills.json": store.skills,
    "experience.json": store.experience,
    "education.json": store.education,
    "certifications.json": store.certifications,
    "training.json": store.training,
    "projects.json": store.projects,
    "contact.json": store.contact,
    "navigation.json": store.navigation,
    "footer.json": store.footer,
    "seo.json": store.seo,
    "branding.json": store.branding,
    "themes.json": store.themes,
    "media.json": store.media,
  };
  return Object.entries(map).map(([file, slice]) => ({ file, slice: slice as JsonValue }));
}

export default function ContentExplorerPage() {
  const { language } = useLanguage();
  const tt = T[language];
  const files = useContentFiles();
  const [selected, setSelected] = useState(files[0]?.file ?? "");

  const current = files.find((f) => f.file === selected) ?? files[0];

  return (
    <div className="space-y-6">
      <PageHeader title={tt.title} />
      <p className="text-sm text-muted-foreground">{tt.subtitle}</p>

      <div className="flex gap-6">
        {/* Left column — the list of content files */}
        <div className="w-56 flex-shrink-0">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {files.map(({ file }) => {
              const Icon = resolveIcon(CONTENT_PAGES.find((p) => p.file === file)?.icon ?? "code");
              const active = selected === file;
              return (
                <button
                  key={file}
                  type="button"
                  onClick={() => setSelected(file)}
                  data-testid={`explorer-file-${file}`}
                  className={`flex w-full items-center gap-2.5 border-b border-border px-3 py-2.5 text-left transition-colors last:border-0 ${
                    active ? "bg-accent/15 text-accent" : "text-muted-foreground hover:bg-background"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-accent" : ""}`} />
                  <span className="flex min-w-0 flex-col">
                    <span className={`truncate text-sm font-medium ${active ? "text-accent" : "text-foreground"}`}>
                      {labelForFile(file, language)}
                    </span>
                    <span className="truncate font-mono text-[10px] text-muted-foreground">{file}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column — the selected file's JSON tree */}
        <div className="min-h-64 flex-1 overflow-auto rounded-2xl border border-border bg-card p-5">
          {current ? (
            <>
              <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
                <span className="text-sm font-semibold text-foreground">{labelForFile(current.file, language)}</span>
                <span className="font-mono text-xs text-muted-foreground">{current.file}</span>
              </div>
              <JsonNode value={current.slice} depth={0} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
