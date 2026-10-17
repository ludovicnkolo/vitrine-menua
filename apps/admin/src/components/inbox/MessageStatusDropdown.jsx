import React from "react";
import { MESSAGE_STATUS_CONFIG } from "../../utils/constants";
import { getAllowedMessageStatuses } from "./inboxHelpers";

const MessageStatusDropdown = ({
  msg,
  currentTab,
  isInline = false,
  pendingChanges = {},
  currentUser,
  userRole,
  handleStatusWithModal,
}) => {
  const currentStatus =
    pendingChanges.status !== undefined
      ? pendingChanges.status
      : msg?.status || "NOUVEAU";
  const currentEtiquette =
    pendingChanges.etiquette !== undefined
      ? pendingChanges.etiquette
      : msg?.etiquette || "";
  const role =
    currentUser?.role?.name || currentUser?.role || userRole || "";

  let category = "general";
  const msgType = (msg?.type || "").toLowerCase();
  if (
    currentTab === "contact" ||
    currentEtiquette === "Contact" ||
    msgType === "contact"
  )
    category = "contact";
  else if (
    currentTab === "recrutement" ||
    currentEtiquette === "Recrutement" ||
    msgType === "recrutement"
  )
    category = "recrutement";
  else if (
    currentTab === "interne" ||
    currentEtiquette === "Interne" ||
    msgType === "interne"
  )
    category = "interne";

  const options = getAllowedMessageStatuses(currentStatus, category, role);
  const isDisabled = options.length <= 1;

  const normStatus = (currentStatus || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  const statusCfg = MESSAGE_STATUS_CONFIG[normStatus];
  const statusColor =
    options.length === 0
      ? "#F59E0B"
      : statusCfg?.dot || statusCfg?.color || "#CBD5E1";

  const selectElement = (
    <select
      value={options.length === 0 ? "" : currentStatus}
      onChange={(e) => handleStatusWithModal(e.target.value, currentTab)}
      disabled={isDisabled}
      style={{
        width: "100%",
        padding: "0.5rem 0.75rem",
        borderRadius: "6px",
        border: `1px solid ${
          pendingChanges.status !== undefined ? "#D97706" : statusColor
        }`,
        outline: "none",
        background: isDisabled ? "#F3F4F6" : "#FFF",
        fontWeight: 700,
        fontSize: "0.85rem",
        color: statusColor !== "#CBD5E1" ? statusColor : "var(--text-main)",
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      {options.length === 0 ? (
        <option value="" disabled style={{ color: "#F59E0B" }}>
          ● Sélectionnez une étiquette...
        </option>
      ) : (
        options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="text-[var(--text-main)]"
          >
            ● {opt.label}
          </option>
        ))
      )}
    </select>
  );

  if (isInline) return selectElement;

  return (
    <div>
      <span
        className="block mb-4 font-medium"
        style={{ color: "var(--text-muted)" }}
      >
        Statut
      </span>
      {selectElement}
    </div>
  );
};

export default MessageStatusDropdown;
