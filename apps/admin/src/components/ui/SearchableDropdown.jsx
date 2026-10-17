import React, { useState, useEffect, useRef } from "react";

/**
 * Menu déroulant avec champ de recherche intégré.
 */
export default function SearchableDropdown({ options, value, onChange, placeholder = "Sélectionner..." }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else {
      setSearchTerm("");
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        const selectedOption = options.find((opt) => opt.value === value);
        if (selectedOption) setSearchTerm(selectedOption.label);
        else setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, options]);

  const filteredOptions = options.filter((opt) =>
    (opt.label || "").toLowerCase().includes((searchTerm || "").toLowerCase()),
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          setSearchTerm("");
        }}
        className="input-field w-full"
        style={{
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          background: "#FFF",
        }}
      />
      {isOpen && (
        <div
          className="absolute w-full"
          style={{
            top: "100%",
            zIndex: 1000,
            background: "#FFF",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            marginTop: "0.25rem",
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                className="cursor-pointer hover:bg-slate-50 transition-colors"
                style={{ padding: "0.75rem", borderBottom: "1px solid #f1f5f9" }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt.value);
                  setSearchTerm(opt.label);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))
          ) : (
            <div style={{ padding: "0.75rem", color: "var(--text-muted)" }}>
              Aucun résultat trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
}
