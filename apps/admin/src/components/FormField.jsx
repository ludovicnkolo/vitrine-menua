import React from "react";

/** Style partagé pour tous les inputs/textareas du back-office admin */
const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid var(--border)",
};

/**
 * Champ de formulaire générique — input, textarea ou select.
 *
 * @param {string}   label       - Libellé affiché
 * @param {string}   type        - Type HTML (text, email, tel, url, …) ou "textarea"
 * @param {*}        value       - Valeur contrôlée
 * @param {Function} onChange    - Handler onChange
 * @param {boolean}  required    - Affiche l'astérisque rouge et ajoute required
 * @param {object}   inputProps  - Props supplémentaires passées à l'élément input/textarea
 */
const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  inputProps = {},
}) => {
  const labelEl = (
    <label
      style={{
        display: "block",
        marginBottom: "0.25rem",
        fontSize: "0.875rem",
        fontWeight: 500,
      }}
    >
      {label} {required && <span style={{ color: "red" }}>*</span>}
    </label>
  );

  if (type === "textarea") {
    return (
      <div>
        {labelEl}
        <textarea
          rows={3}
          value={value || ""}
          onChange={onChange}
          required={required}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
          {...inputProps}
        />
      </div>
    );
  }

  return (
    <div>
      {labelEl}
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        required={required}
        style={inputStyle}
        {...inputProps}
      />
    </div>
  );
};

export default FormField;
