import { ComponentType } from "react";
import { Redirect, Route, Switch, type RouteComponentProps } from "wouter";
import { ADMIN_ENABLED } from "@/lib/admin-enabled";
import { ALL_PAGES } from "@/admin/manifest";
import { AdminLayout } from "@/components/admin/AdminLayout";

import PersonalInfoPage from "@/components/admin/pages/PersonalInfoPage";
import HeroPage from "@/components/admin/pages/HeroPage";
import AboutPage from "@/components/admin/pages/AboutPage";
import SkillsPage from "@/components/admin/pages/SkillsPage";
import ExperiencePage from "@/components/admin/pages/ExperiencePage";
import EducationPage from "@/components/admin/pages/EducationPage";
import CertificationsPage from "@/components/admin/pages/CertificationsPage";
import TrainingPage from "@/components/admin/pages/TrainingPage";
import ProjectsPage from "@/components/admin/pages/ProjectsPage";
import ContactPage from "@/components/admin/pages/ContactPage";
import NavigationPage from "@/components/admin/pages/NavigationPage";
import FooterPage from "@/components/admin/pages/FooterPage";
import SeoPage from "@/components/admin/pages/SeoPage";
import SiteIdentityPage from "@/components/admin/pages/SiteIdentityPage";
import MediaPage from "@/components/admin/pages/MediaPage";
import TranslationsPage from "@/components/admin/pages/TranslationsPage";
import ContentVersionsPage from "@/components/admin/pages/ContentVersionsPage";
import InventoryPage from "@/components/admin/pages/InventoryPage";
import DiagnosticsPage from "@/components/admin/pages/DiagnosticsPage";
import ContentExplorerPage from "@/components/admin/pages/ContentExplorerPage";
import DashboardPage from "@/components/admin/pages/DashboardPage";

// Maps each manifest route to its statically-imported page component.
const PAGE_COMPONENTS: Record<string, ComponentType<RouteComponentProps>> = {
  "/admin/personal-info": PersonalInfoPage,
  "/admin/hero": HeroPage,
  "/admin/about": AboutPage,
  "/admin/skills": SkillsPage,
  "/admin/experience": ExperiencePage,
  "/admin/education": EducationPage,
  "/admin/certifications": CertificationsPage,
  "/admin/training": TrainingPage,
  "/admin/projects": ProjectsPage,
  "/admin/contact": ContactPage,
  "/admin/navigation": NavigationPage,
  "/admin/footer": FooterPage,
  "/admin/seo": SeoPage,
  "/admin/identity": SiteIdentityPage,
  "/admin/media": MediaPage,
  "/admin/translations": TranslationsPage,
  "/admin/content-versions": ContentVersionsPage,
  "/admin/inventory": InventoryPage,
  "/admin/diagnostics": DiagnosticsPage,
  "/admin/content-explorer": ContentExplorerPage,
  "/admin/dashboard": DashboardPage,
};

export default function AdminRouter() {
  if (!ADMIN_ENABLED) return <Redirect to="/" />;

  return (
    <AdminLayout>
      <Switch>
        {ALL_PAGES.map((page) => {
          const Component = PAGE_COMPONENTS[page.route];
          if (!Component) return null;
          return <Route key={page.route} path={page.route} component={Component} />;
        })}

        {/* Index + legacy redirects */}
        <Route path="/admin">
          <Redirect to="/admin/dashboard" />
        </Route>
        <Route path="/admin/branding">
          <Redirect to="/admin/identity" />
        </Route>
        <Route path="/admin/themes">
          <Redirect to="/admin/identity" />
        </Route>

        {/* Unknown admin route falls back to the dashboard. */}
        <Route>
          <Redirect to="/admin/dashboard" />
        </Route>
      </Switch>
    </AdminLayout>
  );
}
