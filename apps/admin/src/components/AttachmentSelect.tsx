import React, { ChangeEvent } from "react";

export interface AttachmentSelectProps {
  files?: (string | null | undefined)[];
  onPreview?: (fileUrl: string) => void;
}

const AttachmentSelect: React.FC<AttachmentSelectProps> = ({ files, onPreview }) => {
  if (!files || files.length === 0) {
    return (
      <span className="text-[var(--text-muted)] text-sm">
        Aucun fichier
      </span>
    );
  }

  const validFiles = files.filter(Boolean).reduce<string[]>((acc, f) => {
    if (typeof f === "string") {
      const parts = f
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p);
      acc.push(...parts);
    }
    return acc;
  }, []);

  if (validFiles.length === 0) {
    return (
      <span className="text-[var(--text-muted)] text-sm">
        Aucun fichier
      </span>
    );
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value && onPreview) {
      onPreview(e.target.value);
      e.target.selectedIndex = 0;
    }
  };

  return (
    <select
      onChange={handleChange}
      className="p-2 w-full cursor-pointer rounded-md border border-[var(--border)] bg-white text-sm outline-none focus:border-[var(--primary)] transition-colors"
    >
      <option value="">-- Sélectionner un fichier pour l'ouvrir --</option>
      {validFiles.map((file, idx) => (
        <option key={`${file}-${idx}`} value={file}>
          {file}
        </option>
      ))}
    </select>
  );
};

export default AttachmentSelect;
