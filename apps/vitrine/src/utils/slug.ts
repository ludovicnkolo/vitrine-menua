export const generateSlug = (title: string, _id?: string | number) => {
  if (!title) return _id ? String(_id) : "";
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  
  return slug;
};
