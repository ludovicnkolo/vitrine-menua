import React from "react";
import UsersPage from "./UsersPage";
import RolesPage from "./RolesPage";
import SpacePageLayout from "../components/SpacePageLayout";

const UsersSpacePage = () => (
  <SpacePageLayout
    initialTab="equipe"
    tabs={[
      { id: "equipe", label: "Équipe" },
      { id: "client", label: "Client" },
      { id: "role", label: "Rôle" },
    ]}
  >
    {(tab) => (
      <>
        {tab === "equipe" && <UsersPage forceTab="interne" />}
        {tab === "role" && <RolesPage />}
        {tab === "client" && <UsersPage forceTab="externe" />}
      </>
    )}
  </SpacePageLayout>
);

export default UsersSpacePage;
