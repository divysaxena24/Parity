"use server";

import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

/**
 * Administrative: Delete User
 * Completely removes user and all associated records
 */
export async function deleteUser(id) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return { error: "Unauthorized" };

  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    console.error("Delete user error:", err);
    return { error: "Failed to delete user." };
  }
}

/**
 * Administrative: Update User Status
 */
export async function updateUserStatus(id, status) {
   const cookieStore = await cookies();
   const token = cookieStore.get("admin-session")?.value;
   const session = verifySession(token);
   if (!session) return { error: "Unauthorized" };

   try {
     await sql`UPDATE users SET subscription_status = ${status} WHERE id = ${id}`;
     revalidatePath("/admin/users");
     return { success: true };
   } catch (err) {
     return { error: "Failed to update user." };
   }
}

/**
 * Administrative: Toggle User Role (USER/ADMIN)
 */
export async function updateUserRole(id, role) {
   const cookieStore = await cookies();
   const token = cookieStore.get("admin-session")?.value;
   const session = verifySession(token);
   if (!session) return { error: "Unauthorized" };

   try {
     await sql`UPDATE users SET role = ${role} WHERE id = ${id}`;
     revalidatePath("/admin/users");
     return { success: true };
   } catch (err) {
     return { error: "Failed to update user role." };
   }
}
