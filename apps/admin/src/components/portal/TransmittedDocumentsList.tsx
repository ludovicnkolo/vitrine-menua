import React from "react";
import { FileText, Download } from "lucide-react";
import type { DocumentItem } from "../../pages/ClientPortalPage";

interface TransmittedDocumentsListProps {
  transmittedDocs: DocumentItem[];
  handleDownload: (doc: DocumentItem) => void;
}

const TransmittedDocumentsList: React.FC<TransmittedDocumentsListProps> = ({
  transmittedDocs,
  handleDownload,
}) => {
  return (
    <div className="divide-y divide-slate-100">
      {transmittedDocs.length === 0 ? (
        <div className="p-10 text-center text-xs text-slate-400">
          Aucun document transmis pour le moment.
        </div>
      ) : (
        transmittedDocs.map((doc, idx) => {
          const isZip =
            doc.name.toLowerCase().endsWith(".zip") ||
            doc.name.toLowerCase().endsWith(".rar");

          return (
            <div
              key={doc.id || idx}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {isZip ? (
                  <div className="w-5 h-5 rounded border border-slate-400 text-[9px] font-bold text-slate-700 flex items-center justify-center shrink-0">
                    ZIP
                  </div>
                ) : (
                  <FileText
                    className="w-5 h-5 text-slate-700 shrink-0"
                    strokeWidth={1.8}
                  />
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                  <span className="font-bold text-slate-900 text-sm truncate">
                    {doc.name}
                  </span>

                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {doc.fileSize} • {doc.dateStr}
                  </span>

                  {/* Badges statut */}
                  {doc.badges?.map((badge, bIdx) => {
                    let style =
                      "bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]";
                    if (badge.variant === "blue") {
                      style =
                        "bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe]";
                    } else if (badge.variant === "green") {
                      style =
                        "bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]";
                    } else if (badge.variant === "amber") {
                      style =
                        "bg-[#fef3c7] text-[#92400e] border border-[#fde68a]";
                    }

                    return (
                      <span
                        key={bIdx}
                        className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${style}`}
                      >
                        {badge.text}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Bouton Télécharger la copie */}
              <div className="shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                >
                  <Download size={13} className="text-slate-600" />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TransmittedDocumentsList;
