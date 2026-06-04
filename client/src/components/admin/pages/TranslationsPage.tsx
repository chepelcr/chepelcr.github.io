import { useEffect, useMemo, useState } from "react";
import { useAdminUi } from "@/lib/admin-ui";
import { downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { FloatingSaveButton } from "@/components/admin/FloatingSaveButton";
import esData from "@/translations/es.json";
import enData from "@/translations/en.json";

type Dict = Record<string, string>;

const inputClass =
  "w-full bg-background border border-border rounded-md px-3 py-2 text-sm";

/** First dot-segment of a key, used to group the table. */
function groupOf(key: string): string {
  const dot = key.indexOf(".");
  return dot === -1 ? key : key.slice(0, dot);
}

export default function TranslationsPage() {
  const setEditor = useAdminUi((state) => state.setEditor);
  const clearEditor = useAdminUi((state) => state.clearEditor);

  // Local drafts seeded from the bundled translation files.
  const [esDraft, setEsDraft] = useState<Dict>(() => ({ ...(esData as Dict) }));
  const [enDraft, setEnDraft] = useState<Dict>(() => ({ ...(enData as Dict) }));
  const [search, setSearch] = useState("");

  // Manual dirty tracking: the flat translation files are not store entities.
  const dirty = useMemo(
    () =>
      JSON.stringify(esDraft) !== JSON.stringify(esData) ||
      JSON.stringify(enDraft) !== JSON.stringify(enData),
    [esDraft, enDraft],
  );

  const save = async () => {
    await downloadJson("es.json", esDraft);
    await downloadJson("en.json", enDraft);
  };

  // Register with the admin UI shell so the nav guard knows about unsaved edits.
  useEffect(() => {
    setEditor({ dirty, filename: "translations", save });
    return () => clearEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);

  // Warn before leaving the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Merged, sorted, de-duplicated key list across both languages.
  const allKeys = useMemo(() => {
    const set = new Set<string>([...Object.keys(esDraft), ...Object.keys(enDraft)]);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [esDraft, enDraft]);

  // Apply the search filter, then group by first dot-segment.
  const grouped = useMemo(() => {
    const term = search.trim().toLowerCase();
    const map = new Map<string, string[]>();
    for (const key of allKeys) {
      if (term) {
        const haystack = `${key} ${esDraft[key] ?? ""} ${enDraft[key] ?? ""}`.toLowerCase();
        if (!haystack.includes(term)) continue;
      }
      const group = groupOf(key);
      const list = map.get(group);
      if (list) list.push(key);
      else map.set(group, [key]);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [allKeys, esDraft, enDraft, search]);

  const setEs = (key: string, value: string) =>
    setEsDraft((prev) => ({ ...prev, [key]: value }));
  const setEn = (key: string, value: string) =>
    setEnDraft((prev) => ({ ...prev, [key]: value }));

  const totalShown = grouped.reduce((sum, [, keys]) => sum + keys.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Translations" />

      <div className="space-y-1.5">
        <input
          type="text"
          className={inputClass}
          value={search}
          placeholder="Search keys or values…"
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {totalShown} of {allKeys.length} keys
        </p>
      </div>

      {grouped.map(([group, keys]) => (
        <div key={group} className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="border-b border-border px-4 py-2">
            <h3 className="text-sm font-semibold text-foreground">{group}</h3>
          </div>
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="w-1/4 px-4 py-2 font-medium">Key</th>
                <th className="px-4 py-2 font-medium">ES</th>
                <th className="px-4 py-2 font-medium">EN</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key} className="border-b border-border last:border-0 align-top">
                  <td className="px-4 py-2">
                    <code className="text-xs text-muted-foreground break-all">{key}</code>
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      className={inputClass}
                      rows={1}
                      value={esDraft[key] ?? ""}
                      placeholder="Español"
                      onChange={(e) => setEs(key, e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      className={inputClass}
                      rows={1}
                      value={enDraft[key] ?? ""}
                      placeholder="English"
                      onChange={(e) => setEn(key, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {grouped.length === 0 ? (
        <p className="text-sm text-muted-foreground">No keys match your search.</p>
      ) : null}

      <FloatingSaveButton dirty={dirty} onSave={save} />
    </div>
  );
}
