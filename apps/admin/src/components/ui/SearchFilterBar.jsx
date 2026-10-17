import React from "react";
import { Search, X } from "lucide-react";

/**
 * Composant de recherche et de filtres unifié.
 * 
 * @param {string} value - Valeur actuelle du champ de recherche
 * @param {function} onChange - Callback lors du changement de valeur
 * @param {string} [placeholder="Rechercher..."] - Texte d'indication
 * @param {React.ReactNode} [actions] - Boutons d'action optionnels à droite (ex: Nouveau, Importer)
 * @param {React.ReactNode} [filters] - Sélecteurs de filtres optionnels
 * @param {string} [width="260px"] - Largeur du champ de recherche
 */
export default function SearchFilterBar({
  value,
  onChange,
  placeholder = "Rechercher...",
  actions,
  filters,
  width = "260px",
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
      <div className="flex items-center flex-wrap gap-3">
        {/* Champ de recherche */}
        <div className="relative" style={{ width }}>
          <Search
            size={16}
            color="var(--text-muted)"
            className="absolute"
            style={{
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-[var(--text-main)]"
            style={{
              padding: "0.55rem 2rem 0.55rem 2.2rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              fontSize: "0.85rem",
            }}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute cursor-pointer flex items-center justify-center hover:opacity-80"
              style={{
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
              }}
              title="Effacer la recherche"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filtres additionnels (dropdowns, selects) */}
        {filters && <div className="flex items-center gap-2 flex-wrap">{filters}</div>}
      </div>

      {/* Boutons d'action à droite */}
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
