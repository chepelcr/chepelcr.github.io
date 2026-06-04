import { ReactNode, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAdminUi } from "@/lib/admin-ui";
import { useEntityDirty } from "@/lib/admin-store";
import { FloatingSaveButton } from "@/components/admin/FloatingSaveButton";
import { labelForFile } from "@/admin/manifest";

interface PageHeaderProps {
  title: string;
  entity?: string;
  value?: unknown;
  onSave?: () => void | Promise<void>;
  actions?: ReactNode;
}

export function PageHeader({ title, entity, value, onSave, actions }: PageHeaderProps) {
  const { language } = useLanguage();
  const setEditor = useAdminUi((state) => state.setEditor);
  const clearEditor = useAdminUi((state) => state.clearEditor);

  // Only computed/registered when this page tracks an entity.
  const dirty = useEntityDirty(entity ?? "", value);
  const tracked = Boolean(entity);
  const isDirty = tracked && dirty;

  const save = async () => {
    await onSave?.();
  };

  // Register/refresh the active editor in the admin UI store.
  useEffect(() => {
    if (!tracked || !entity) return;
    setEditor({ dirty: isDirty, filename: entity, save });
    return () => clearEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracked, entity, isDirty]);

  // Warn before leaving the tab while there are unsaved changes.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {entity ? labelForFile(entity, language) : title}
        </h1>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {tracked ? <FloatingSaveButton dirty={isDirty} onSave={save} /> : null}
    </>
  );
}
