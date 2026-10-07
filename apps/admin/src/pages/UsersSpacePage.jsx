import React from "react";
import UsersPage from "./UsersPage";
import RolesPage from "./RolesPage";
import PolesPage from "./PolesPage";
import SpacePageLayout from "../components/SpacePageLayout";

const UsersSpacePage = () => (
  <SpacePageLayout
    initialTab="equipe"
    tabs={[
      { id: "equipe", label: "Équipe" },
      { id: "client", label: "Client" },
      { id: "role", label: "Rôle" },
      { id: "poles", label: "Pôles" },
    ]}
  >
    {(tab) => (
      <>
        {tab === "equipe" && <UsersPage forceTab="interne" />}
        {tab === "client" && <UsersPage forceTab="externe" />}
        {tab === "role" && <RolesPage />}
        {tab === "poles" && <PolesPage />}
      </>
    )}
  </SpacePageLayout>
);

export default UsersSpacePage;
