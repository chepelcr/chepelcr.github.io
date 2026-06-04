import { useState } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface FloatingSaveButtonProps {
  dirty: boolean;
  onSave: () => Promise<void>;
}

export function FloatingSaveButton({ dirty, onSave }: FloatingSaveButtonProps) {
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSaved(false);
    try {
      await onSave();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (!dirty && !saving && !saved) return null;

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-navy shadow-xl transition-opacity hover:opacity-90 disabled:opacity-70"
    >
      {saving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : saved ? (
        <Check className="h-4 w-4" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      {saving ? t("admin.saving") : saved ? t("admin.saved") : t("admin.save")}
    </button>
  );
}
