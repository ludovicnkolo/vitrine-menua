import React from "react";

const ActionDropdown = ({ isOpen, menuRef, children, width = "150px" }) => {
  if (!isOpen) return null;
  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        right: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        marginRight: "0.5rem",
        background: "#FFF",
        border: "1px solid #E2E8F0",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        zIndex: 10,
        width,
        display: "flex",
        flexDirection: "column",
        padding: "0.25rem 0",
      }}
    >
      {children}
    </div>
  );
};

export default ActionDropdown;
