import "./admin.css";
import AdminLayoutWrapper from "./AdminLayoutWrapper";

export const metadata = {
  title: "MyCRM - Administration",
  description: "Espace d'administration Menua Consulting",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50 text-gray-900 font-sans m-0 p-0 flex h-screen overflow-hidden">
        <AdminLayoutWrapper>
          {children}
        </AdminLayoutWrapper>
      </body>
    </html>
  );
}
