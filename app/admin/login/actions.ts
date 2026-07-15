"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const password = String(formData.get("password") || "");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    redirect("/admin/login?error=config");
  }

  if (password !== adminPassword) {
    redirect("/admin/login?error=credentials");
  }

  const cookieStore = await cookies();
  const headerStore = await headers();
  const host = headerStore.get("host") || "";
  const isLocalHost = host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("192.168.");

  cookieStore.set("portfolio_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && !isLocalHost,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  redirect("/admin");
}
