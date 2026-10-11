import React, { ChangeEvent, HTMLInputTypeAttribute } from "react";

/** Style partagé pour tous les inputs/textareas du back-office admin */
const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid var(--border)",
};

interface FormFieldProps {
  label: string;
  type?: HTMLInputTypeAttribute | "textarea";
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;
}

/**
 * Champ de formulaire générique — input, textarea ou select.
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  inputProps = {},
}) => {
  const labelEl = (
    <label
      className="block font-medium" style={{marginBottom:"0.25rem"}}
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
          {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
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
        {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    </div>
  );
};

export default FormField;
