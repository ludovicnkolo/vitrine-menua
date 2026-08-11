export const handleFormSubmit = async ({
  e,
  endpoint,
  lang,
  onSuccess,
  setSubmitStatus,
  setIsSubmitting,
  setEmailError,
  successMessage,
  errorMessage,
}: {
  e: React.FormEvent<HTMLFormElement>;
  endpoint: string;
  lang: string;
  onSuccess?: () => void;
  setSubmitStatus: (status: { type: "success" | "error"; message: string } | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setEmailError?: (error: string | null) => void;
  successMessage: string;
  errorMessage: string;
}) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);
  if (setEmailError) setEmailError(null);
  
  try {
    const formData = new FormData(e.currentTarget);
    const apiUrl = ''; // Rely on Next.js rewrites
    const res = await fetch(`${apiUrl}${endpoint}?lang=${encodeURIComponent(lang.toLowerCase())}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    
    if (res.ok && data.success) {
      setSubmitStatus({ type: "success", message: data.message || successMessage });
      (e.target as HTMLFormElement).reset();
      if (onSuccess) onSuccess();
      setTimeout(() => setSubmitStatus(null), 3000);
    } else {
      if (setEmailError && (data.code === 'ERROR_EMAIL_INVALID' || data.code === 'ERROR_EMAIL_REQUIRED')) {
        setEmailError(data.error);
        // Efface l'erreur après 5 secondes
        setTimeout(() => setEmailError(null), 5000);
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Une erreur s'est produite." });
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    }
  } catch (error) {
    setSubmitStatus({ type: "error", message: errorMessage });
    setTimeout(() => setSubmitStatus(null), 3000);
  } finally {
    setIsSubmitting(false);
  }
};

/**
 * Valide un fichier PDF selon les règles métier communes.
 * @returns {string | null} Message d'erreur, ou null si valide.
 */
export function validatePdfFile(file: File | null | undefined): string | null {
  if (!file || file.size === 0) return null;
  if (file.type !== "application/pdf") {
    return "Seuls les fichiers au format PDF sont acceptés.";
  }
  if (file.size > 5 * 1024 * 1024) {
    return "Le fichier PDF est trop volumineux (maximum 5 Mo).";
  }
  return null;
}

