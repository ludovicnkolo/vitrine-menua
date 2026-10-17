import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  FileVideo,
  FileAudio,
  FileCode,
} from "lucide-react";

export const getFileIconAndColor = (filename) => {
  if (!filename) return { Icon: FileText, color: "var(--primary)" };
  const ext = filename.split(".").pop().toLowerCase();

  switch (ext) {
    case "pdf":
      return { Icon: FileText, color: "#EF4444" }; // Rouge
    case "doc":
    case "docx":
      return { Icon: FileText, color: "#3B82F6" }; // Bleu
    case "xls":
    case "xlsx":
    case "csv":
      return { Icon: FileSpreadsheet, color: "#10B981" }; // Vert
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
      return { Icon: FileImage, color: "#8B5CF6" }; // Violet
    case "zip":
    case "rar":
    case "tar":
    case "gz":
    case "7z":
      return { Icon: FileArchive, color: "#F59E0B" }; // Orange
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
      return { Icon: FileVideo, color: "#EC4899" }; // Rose
    case "mp3":
    case "wav":
    case "ogg":
      return { Icon: FileAudio, color: "#14B8A6" }; // Bleu canard
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "json":
    case "html":
    case "css":
      return { Icon: FileCode, color: "#64748B" }; // Gris
    default:
      return { Icon: FileText, color: "var(--primary)" }; // Par défaut
  }
};
