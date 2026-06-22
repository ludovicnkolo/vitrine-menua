"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname.endsWith("/admin/login");

  if (isLoginPage) {
    return (
      <main className="w-full h-screen bg-[#0a1128] flex items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#f4f7f6]">
        {children}
      </main>
    </>
  );
}
