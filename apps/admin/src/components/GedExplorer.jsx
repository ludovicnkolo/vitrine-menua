import React, { useState } from "react";
import { Folder, ChevronRight, ChevronDown } from "lucide-react";

export const flattenFolderIds = (folder) => {
  let ids = [folder.id];
  if (folder.subDossiers) {
    folder.subDossiers.forEach((sub) => {
      ids = [...ids, ...flattenFolderIds(sub)];
    });
  }
  return ids;
};

const GedExplorer = ({
  tree,
  multiSelect,
  selectedIds = [],
  selectedId,
  onSelectId,
  onToggleChildren,
  hideBreadcrumb = false,
  disabledIds = [],
}) => {
  const [path, setPath] = useState([tree]);

  const currentFolder = path[path.length - 1];
  const children = currentFolder?.subDossiers || [];

  return (
    <div
      className="p-4" style={{border:"1px solid var(--border)",borderRadius:"8px",background:"#F8FAFC"}}
    >
      {/* Breadcrumb */}
      {!hideBreadcrumb && (
        <div
          className="flex items-center flex-wrap gap-2 mb-4 p-2" style={{background:"#FFF",borderRadius:"4px",border:"1px solid #e2e8f0"}}
        >
          {path.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <span
                onClick={() => setPath(path.slice(0, index + 1))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPath(path.slice(0, index + 1));
                  }
                }}
                tabIndex={0}
                role="button"
                style={{
                  cursor: "pointer",
                  color: "var(--primary)",
                  fontWeight: index === path.length - 1 ? 600 : 400,
                }}
              >
                {folder.name}
              </span>
              {index < path.length - 1 && (
                <ChevronRight size={14} style={{ color: "#94a3b8" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Grid of Folders */}
      <div className="flex flex-wrap gap-4">
        {children.map((child) => {
          const isSelected = multiSelect
            ? selectedIds.includes(child.id)
            : selectedId === child.id;
          return (
            <div
              key={child.id}
              className="relative" style={{width:"110px"}}
            >
              <div
                className="absolute" style={{top:"4px",left:"4px",zIndex:10}}
              >
                {!disabledIds.includes(child.id) && (
                  <input
                    type={multiSelect ? "checkbox" : "radio"}
                    checked={isSelected}
                    onChange={() =>
                      multiSelect
                        ? onToggleChildren(child)
                        : onSelectId(child.id)
                    }
                    className="cursor-pointer"
                  />
                )}
              </div>
              <div
                onClick={() => {
                  if (!hideBreadcrumb) {
                    setPath([...path, child]);
                  } else {
                    multiSelect
                      ? onToggleChildren(child)
                      : onSelectId(child.id);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!hideBreadcrumb) {
                      setPath([...path, child]);
                    } else {
                      multiSelect
                        ? onToggleChildren(child)
                        : onSelectId(child.id);
                    }
                  }
                }}
                tabIndex={0}
                role="button"
                style={{
                  border: isSelected
                    ? "2px solid var(--primary)"
                    : "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "1.5rem 0.5rem",
                  cursor: "pointer",
                  textAlign: "center",
                  background: isSelected ? "#e0f2fe" : "#FFF",
                  transition: "all 0.2s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Folder
                  size={40}
                  style={{ color: "#eab308" }}
                  fill={isSelected ? "#fef08a" : "none"}
                />
                <div
                  className="mt-2 font-medium" style={{fontSize:"0.75rem",wordBreak:"break-word",color:"var(--text)"}}
                >
                  {child.name}
                </div>
              </div>
            </div>
          );
        })}
        {children.length === 0 && (
          <div
            className="w-full text-center p-4" style={{color:"#94a3b8"}}
          >
            Ce dossier est vide.
          </div>
        )}
      </div>
    </div>
  );
};

export default GedExplorer;
