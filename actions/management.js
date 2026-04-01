"use server";

import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

/**
 * Administrative: Fetch All Admins
 */
export async function getAdmins() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return [];

  try {
    return await sql`SELECT email, created_at FROM app_admins ORDER BY created_at DESC`;
  } catch (err) {
    console.error("Fetch admins error:", err);
    return [];
  }
}

/**
 * Administrative: Delete Administrator
 */
export async function deleteAdmin(email) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return { error: "Unauthorized" };

  // Protect the master admin
  if (email === "admin2402@parity.com") {
    return { error: "The Master Administrator account cannot be deleted." };
  }

  // Prevent self-deletion for now
  if (email === session.email) {
    return { error: "You cannot delete your own session. Contact another administrator." };
  }

  try {
    await sql`DELETE FROM app_admins WHERE email = ${email}`;
    revalidatePath("/admin/management");
    return { success: true };
  } catch (err) {
    console.error("Delete admin error:", err);
    return { error: "Failed to remove administrator access." };
  }
}
