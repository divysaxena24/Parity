import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/admin-auth";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
