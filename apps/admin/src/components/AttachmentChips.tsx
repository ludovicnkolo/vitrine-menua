import React from "react";
import { Trash } from "lucide-react";

export interface AttachmentChipsProps {
  attachment?: string;
  onRemove?: (attachmentName: string) => void;
}

const AttachmentChips: React.FC<AttachmentChipsProps> = ({
  attachment,
  onRemove,
}) => {
  if (!attachment || !attachment.trim()) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {attachment.split(",").map(
        (att) =>
          att.trim() && (
            <div
              key={att.trim()}
              className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-[var(--border)] max-w-[300px]"
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-700">
                {att.trim()}
              </span>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(att.trim())}
                  className="cursor-pointer flex items-center justify-center bg-transparent border-none text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-md transition-colors"
                  title="Supprimer la pièce jointe"
                >
                  <Trash size={16} />
                </button>
              )}
            </div>
          )
      )}
    </div>
  );
};

export default AttachmentChips;
