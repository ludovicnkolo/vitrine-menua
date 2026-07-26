export const handleFormSubmit = async ({
  e,
  endpoint,
  lang,
  onSuccess,
  setSubmitStatus,
  setIsSubmitting,
  successMessage,
  errorMessage,
}: {
  e: React.FormEvent<HTMLFormElement>;
  endpoint: string;
  lang: string;
  onSuccess?: () => void;
  setSubmitStatus: (status: { type: "success" | "error"; message: string } | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  successMessage: string;
  errorMessage: string;
}) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);
  
  try {
    const formData = new FormData(e.currentTarget);
    const apiUrl = process.env.NODE_ENV === 'production' ? '' : process.env.NEXT_PUBLIC_API_URL;
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
      setSubmitStatus({ type: "error", message: data.error || "Une erreur s'est produite." });
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  } catch (error) {
    setSubmitStatus({ type: "error", message: errorMessage });
    setTimeout(() => setSubmitStatus(null), 3000);
  } finally {
    setIsSubmitting(false);
  }
};
