import { useLocation } from "wouter";
import { useAdminUi } from "@/lib/admin-ui";
import { useAdminStore } from "@/lib/admin-store";
import { useLanguage } from "@/contexts/language-context";
import { Modal } from "@/components/admin/Modal";

const btnBase =
  "rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90";

export function UnsavedChangesModal() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const navTarget = useAdminUi((state) => state.navTarget);
  const filename = useAdminUi((state) => state.filename);
  const save = useAdminUi((state) => state.save);
  const closeNav = useAdminUi((state) => state.closeNav);
  const clearEditor = useAdminUi((state) => state.clearEditor);
  const discardEntity = useAdminStore((state) => state.discardEntity);

  const open = Boolean(navTarget);

  const goToTarget = () => {
    const target = navTarget;
    closeNav();
    if (target) navigate(target);
  };

  const handleKeepEditing = () => {
    closeNav();
  };

  const handleDiscard = () => {
    if (filename) discardEntity(filename);
    clearEditor();
    goToTarget();
  };

  const handleSave = async () => {
    if (save) await save();
    clearEditor();
    goToTarget();
  };

  return (
    <Modal
      open={open}
      onClose={handleKeepEditing}
      title={t("admin.unsaved.title")}
      footer={
        <>
          <button
            type="button"
            className={`${btnBase} bg-slate text-foreground`}
            onClick={handleKeepEditing}
          >
            {t("admin.unsaved.keepEditing")}
          </button>
          <button
            type="button"
            className={`${btnBase} border border-border text-foreground`}
            onClick={handleDiscard}
          >
            {t("admin.unsaved.discard")}
          </button>
          <button
            type="button"
            className={`${btnBase} bg-accent text-navy`}
            onClick={handleSave}
          >
            {t("admin.save")}
          </button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">{t("admin.unsaved.message")}</p>
    </Modal>
  );
}
