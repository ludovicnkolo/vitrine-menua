import React from "react";
import { Search } from "lucide-react";

const UsersToolbar = ({
  forceTab,
  tab,
  setTab,
  searchTerm,
  setSearchTerm,
  filterUserStatus,
  setFilterUserStatus,
  filterUserRole,
  setFilterUserRole,
  rolesList = [],
  setShowModal,
  setShowExternalModal,
  t,
}) => {
  return (
    <>
      {!forceTab && (
        <div className="mb-6">
          <h1
            className="font-semibold text-[var(--text-main)]"
            style={{ fontSize: "1.5rem" }}
          >
            Membres
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Gestion des équipes internes et des clients
          </p>
        </div>
      )}

      {!forceTab && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setTab("interne");
                setSearchTerm("");
                setFilterUserStatus("all");
                setFilterUserRole("all");
              }}
              style={{
                background:
                  tab === "interne" ? "var(--primary)" : "transparent",
                color: tab === "interne" ? "#FFF" : "var(--text-muted)",
                border:
                  tab === "interne"
                    ? "1px solid var(--primary)"
                    : "1px solid #E2E8F0",
                borderRadius: "6px",
                padding: "0 0.75rem",
                height: "28px",
                lineHeight: 1,
                width: "fit-content",
                whiteSpace: "nowrap",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Interne
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("externe");
                setSearchTerm("");
                setFilterUserStatus("all");
                setFilterUserRole("all");
              }}
              style={{
                background:
                  tab === "externe" ? "var(--primary)" : "transparent",
                color: tab === "externe" ? "#FFF" : "var(--text-muted)",
                border:
                  tab === "externe"
                    ? "1px solid var(--primary)"
                    : "1px solid #E2E8F0",
                borderRadius: "6px",
                padding: "0 0.75rem",
                height: "28px",
                lineHeight: 1,
                width: "fit-content",
                whiteSpace: "nowrap",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Externe
            </button>
          </div>
          <button
            type="button"
            className="btn btn-primary w-fit"
            onClick={() => {
              if (tab === "interne") setShowModal(true);
              else setShowExternalModal(true);
            }}
            style={{
              whiteSpace: "nowrap",
              padding: "0 0.75rem",
              height: "28px",
              lineHeight: 1,
            }}
          >
            {tab === "interne" ? "Ajouter en Interne" : "Ajouter en Externe"}
          </button>
        </div>
      )}

      {forceTab && (
        <div className="flex justify-end mb-6">
          <button
            type="button"
            className="btn btn-primary w-fit"
            onClick={() => {
              if (tab === "interne") setShowModal(true);
              else setShowExternalModal(true);
            }}
            style={{
              whiteSpace: "nowrap",
              padding: "0 0.75rem",
              height: "28px",
              lineHeight: 1,
            }}
          >
            {tab === "interne"
              ? t("users.addMember", "Ajouter un Membre")
              : t("users.addClient", "Ajouter un Client")}
          </button>
        </div>
      )}

      {/* Search + filter bar */}
      <div
        className="flex mb-4 flex-wrap items-center"
        style={{ gap: "0.75rem" }}
      >
        <div className="relative" style={{ flex: 1, minWidth: "200px" }}>
          <Search
            size={15}
            className="absolute"
            style={{
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder={
              tab === "interne"
                ? "Rechercher par nom ou email..."
                : t(
                    "users.searchClientPlaceholder",
                    "Rechercher par nom, email ou secteur..."
                  )
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-[var(--text-main)]"
            style={{
              padding: "0.55rem 1rem 0.55rem 2.25rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
        </div>
        {tab === "interne" && (
          <select
            value={filterUserRole}
            onChange={(e) => setFilterUserRole(e.target.value)}
            className="text-[var(--text-main)] cursor-pointer"
            style={{
              padding: "0.55rem 1rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              fontSize: "0.875rem",
              minWidth: "160px",
            }}
          >
            <option value="all">Tous les rôles</option>
            {rolesList.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        )}
        <select
          value={filterUserStatus}
          onChange={(e) => setFilterUserStatus(e.target.value)}
          className="text-[var(--text-main)] cursor-pointer"
          style={{
            padding: "0.55rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            fontSize: "0.875rem",
            minWidth: "150px",
          }}
        >
          <option value="all">
            {t("common.allStatuses", "Tous les statuts")}
          </option>
          <option value="actif">{t("common.active", "Actif")}</option>
          <option value="inactif">{t("common.inactive", "Inactif")}</option>
        </select>
      </div>
    </>
  );
};

export default UsersToolbar;
