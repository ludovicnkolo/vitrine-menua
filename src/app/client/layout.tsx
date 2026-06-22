import "./client.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

export const metadata = {
  title: "Espace Client - Menua Consulting",
  description: "Portail sécurisé pour vos échanges",
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 font-sans m-0 p-0">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
