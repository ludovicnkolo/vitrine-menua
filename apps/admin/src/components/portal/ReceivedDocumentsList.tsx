import React from "react";
import { FileText, Check, PenLine, Download } from "lucide-react";
import type { DocumentItem } from "../../pages/ClientPortalPage";

interface ReceivedDocumentsListProps {
  receivedDocs: DocumentItem[];
  handleOpenCorrection: (doc: DocumentItem) => void;
  handleValidateDoc: (doc: DocumentItem) => void | Promise<void>;
  handleDownload: (doc: DocumentItem) => void;
}

const ReceivedDocumentsList: React.FC<ReceivedDocumentsListProps> = ({
  receivedDocs,
  handleOpenCorrection,
  handleValidateDoc,
  handleDownload,
}) => {
  return (
    <div className="divide-y divide-slate-100">
      {receivedDocs.length === 0 ? (
        <div className="p-10 text-center text-xs text-slate-400">
          Aucun document reçu de MENUA pour le moment.
        </div>
      ) : (
        receivedDocs.map((doc) => {
          const isEnAttente =
            doc.status === "EN_ATTENTE" || doc.status === "En attente";
          const isValide = doc.status === "VALIDE" || doc.status === "Validé";
          const isACorriger =
            doc.status === "A_CORRIGER" || doc.status === "À corriger";

          return (
            <div
              key={doc.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
            >
              {/* Partie gauche : Icône fichier, Nom, Taille, Date, Statut */}
              <div className="flex items-center gap-3.5 min-w-0">
                <FileText
                  className="w-5 h-5 text-slate-700 shrink-0"
                  strokeWidth={1.8}
                />

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                  <span className="font-bold text-slate-900 text-sm truncate">
                    {doc.name}
                  </span>

                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {doc.fileSize} • {doc.dateStr}
                  </span>

                  {/* Statut Badge */}
                  {isEnAttente && (
                    <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-2.5 py-0.5 rounded-md text-xs font-medium">
                      En attente
                    </span>
                  )}

                  {isValide && (
                    <span className="bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] px-2.5 py-0.5 rounded-md text-xs font-semibold inline-flex items-center gap-1">
                      Validé <Check size={12} strokeWidth={2.5} />
                    </span>
                  )}

                  {isACorriger && (
                    <span className="bg-[#fee2e2] text-[#991b1b] border border-[#fecaca] px-2.5 py-0.5 rounded-md text-xs font-medium">
                      À corriger
                    </span>
                  )}
                </div>
              </div>

              {/* Partie droite : Boutons d'action */}
              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                {isEnAttente && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenCorrection(doc)}
                      className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                    >
                      <PenLine size={13} className="text-slate-600" />
                      <span>À corriger</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleValidateDoc(doc)}
                      className="bg-[#1b4332] hover:bg-[#143225] text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                    >
                      <Check size={14} strokeWidth={2.5} />
                      <span>Valider</span>
                    </button>
                  </>
                )}

                {(isValide || isACorriger) && (
                  <button
                    type="button"
                    onClick={() => handleDownload(doc)}
                    className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                  >
                    <Download size={13} className="text-slate-600" />
                    <span>Télécharger</span>
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ReceivedDocumentsList;
