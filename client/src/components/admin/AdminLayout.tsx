import { ReactNode, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { UnsavedChangesModal } from "@/components/admin/UnsavedChangesModal";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileRender, setMobileRender] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Scroll content back to top on route change.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location]);

  const openMobile = () => {
    setMobileRender(true);
    requestAnimationFrame(() => setMobileOpen(true));
  };
  const closeMobile = () => {
    setMobileOpen(false);
    window.setTimeout(() => setMobileRender(false), 300);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground" data-testid="admin-layout">
      {/* Desktop sidebar */}
      <div className="hidden shrink-0 lg:flex">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile drawer (animated in + out) */}
      {mobileRender && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
            onClick={closeMobile}
          />
          <div
            className={`relative z-10 h-full w-64 transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <AdminSidebar collapsed={false} onToggle={closeMobile} onClose={closeMobile} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar onMenu={openMobile} />
        <main ref={mainRef} className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>

      <UnsavedChangesModal />
    </div>
  );
}
