import { useAdminStore, downloadJson, ENTITY_BY_FILE } from "@/lib/admin-store";
import { getContentFiles } from "@/admin/manifest";
import { PageHeader } from "@/components/admin/PageHeader";
import { useLanguage } from "@/contexts/language-context";
import { resolveIcon } from "@/lib/icons";
import esTranslations from "@/translations/es.json";
import enTranslations from "@/translations/en.json";

const DownloadIcon = resolveIcon("download2");

interface VersionRow {
  /** Filename passed to downloadJson — the on-disk content file. */
  file: string;
  /** Human label for the row. */
  label: string;
  /** Current store value for the file. */
  value: unknown;
}

export default function ContentVersionsPage() {
  const { language } = useLanguage();
  const T = {
    es: {
      title: "Versiones de contenido",
      exportAll: "Exportar todo",
      intro: "Descarga el contenido actual de cualquier archivo, o exporta todos los archivos a la vez.",
      downloadJson: "Descargar JSON",
    },
    en: {
      title: "Content Versions",
      exportAll: "Export all",
      intro: "Download the current content of any file, or export every file at once.",
      downloadJson: "Download JSON",
    },
  }[language];

  // Subscribe to the whole store so each row reflects the live slice value.
  const store = useAdminStore();

  // Real content entities, resolved through their store slices.
  const entityRows: VersionRow[] = getContentFiles().map((file) => {
    const sliceKey = ENTITY_BY_FILE[file];
    return {
      file,
      label: file,
      value: sliceKey ? (store as unknown as Record<string, unknown>)[sliceKey] : undefined,
    };
  });

  // Flat UI-chrome translation files are not store slices; export them directly.
  const translationRows: VersionRow[] = [
    { file: "es.json", label: "translations/es.json", value: esTranslations },
    { file: "en.json", label: "translations/en.json", value: enTranslations },
  ];

  const rows = [...entityRows, ...translationRows];

  const exportAll = async () => {
    for (const row of rows) {
      await downloadJson(row.file, row.value);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={T.title}
        actions={
          <button
            type="button"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
            onClick={() => void exportAll()}
          >
            {T.exportAll}
          </button>
        }
      />

      <p className="text-sm text-muted-foreground">
        {T.intro}
      </p>

      <div className="border border-border rounded-lg bg-card divide-y divide-border">
        {rows.map((row) => (
          <div key={row.file} className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="text-sm font-medium text-foreground truncate" title={row.label}>
              {row.label}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-background"
              onClick={() => void downloadJson(row.file, row.value)}
            >
              <DownloadIcon className="h-4 w-4" />
              {T.downloadJson}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
