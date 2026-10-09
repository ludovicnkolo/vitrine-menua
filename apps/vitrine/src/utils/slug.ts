export const generateSlug = (title: string, id?: string) => {
  if (!title) return id || "";
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  
  if (id) {
    return `${slug}-${id}`;
  }
  return slug;
};
