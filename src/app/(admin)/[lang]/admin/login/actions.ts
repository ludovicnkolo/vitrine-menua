"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  // Retrieve credentials (not validating against a DB right now, any login works as requested)
  const email = formData.get("email");
  const password = formData.get("password");

  if (email && password) {
    // Set authentication cookie valid for 1 day
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    redirect("/admin");
  }
}
