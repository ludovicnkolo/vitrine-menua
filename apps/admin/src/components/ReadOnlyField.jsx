import React from "react";

const ReadOnlyField = ({ label, value }) => {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontWeight: 500,
          fontSize: "0.875rem",
        }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        readOnly
        className="input-field"
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          background: "#F8FAFC",
          color: "var(--text-main)",
        }}
      />
    </div>
  );
};

export default ReadOnlyField;
