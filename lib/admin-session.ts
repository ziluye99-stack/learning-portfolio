import { cookies } from "next/headers";

export async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("portfolio_admin")?.value === "1";
}
