import React from "react";

const TaskField = ({
  label,
  value,
  readOnly = true,
  onChange = null,
  isTextarea = false,
}) => {
  const id = `field-${String(label || "").replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="block mb-2 font-medium">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          value={value || ""}
          onChange={onChange}
          readOnly={readOnly}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: readOnly
              ? "1px solid var(--border)"
              : "1px solid var(--primary)",
            background: readOnly ? "var(--surface)" : "#FFF",
            minHeight: "100px",
            resize: "vertical",
          }}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value || ""}
          onChange={onChange}
          readOnly={readOnly}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: readOnly
              ? "1px solid var(--border)"
              : "1px solid var(--primary)",
            background: readOnly ? "var(--surface)" : "#FFF",
          }}
        />
      )}
    </div>
  );
};

export default TaskField;
