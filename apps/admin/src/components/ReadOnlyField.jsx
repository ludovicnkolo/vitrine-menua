import React from "react";

const ReadOnlyField = ({ label, value }) => {
  return (
    <div>
      <label
        className="block mb-2 font-medium"
      >
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        readOnly
        className="input-field w-full text-[var(--text-main)]" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#F8FAFC"}}
      />
    </div>
  );
};

export default ReadOnlyField;
