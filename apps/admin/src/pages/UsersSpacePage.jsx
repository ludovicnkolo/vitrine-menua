import React, { useMemo, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import SpacePageLayout from "../components/SpacePageLayout";

// --- Lazy Loading des vues pour optimiser le bundle initial ---
const UsersPage = lazy(() => import("./UsersPage"));
const RolesPage = lazy(() => import("./RolesPage"));
const PolesPage = lazy(() => import("./PolesPage"));

// Fallback visuel standardisé pendant le chargement d'un onglet
const TabLoadingFallback = () => (
  <div className="flex h-64 w-full items-center justify-center text-sm text-[var(--text-muted)]">
    <span className="animate-pulse">Chargement de la section...</span>
  </div>
);

export const UsersSpacePage = () => {
  const { t } = useTranslation();

  // Configuration déclarative et mémoïsée avec clés d'internationalisation
  const tabs = useMemo(
    () => [
      {
        id: "equipe",
        label: t("users_space.tabs.team", "Équipe"),
        labelKey: "users_space.tabs.team",
      },
      {
        id: "client",
        label: t("users_space.tabs.clients", "Client"),
        labelKey: "users_space.tabs.clients",
      },
      {
        id: "role",
        label: t("users_space.tabs.roles", "Rôles"),
        labelKey: "users_space.tabs.roles",
      },
      {
        id: "poles",
        label: t("users_space.tabs.poles", "Pôles"),
        labelKey: "users_space.tabs.poles",
      },
    ],
    [t]
  );

  // Table de correspondance déclarative (supporte à la fois "role" et "roles")
  const renderTabContent = (activeTabId) => {
    switch (activeTabId) {
      case "equipe":
        return <UsersPage forceTab="interne" />;
      case "client":
        return <UsersPage forceTab="externe" />;
      case "role":
      case "roles":
        return <RolesPage />;
      case "poles":
        return <PolesPage />;
      default:
        return null;
    }
  };

  return (
    <SpacePageLayout initialTab="equipe" tabs={tabs}>
      {(activeTabId) => (
        <Suspense fallback={<TabLoadingFallback />}>
          {renderTabContent(activeTabId)}
        </Suspense>
      )}
    </SpacePageLayout>
  );
};

export default UsersSpacePage;

