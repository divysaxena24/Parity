"use server";

import { sql, createId } from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

/**
 * Administrative: Publish Official Monthly Draw
 * PRD Section 06: Official Results
 */
export async function publishDraw(month, year, numbers, pool) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return { error: "Unauthorized" };

  try {
    const id = createId();
    await sql`
      INSERT INTO draws (id, month, year, draw_numbers, total_pool, status, completed_at)
      VALUES (${id}, ${month}, ${year}, ${numbers}, ${pool}, 'COMPLETED', CURRENT_TIMESTAMP)
    `;
    
    revalidatePath("/admin/draws");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Publish draw error:", err);
    return { error: "Failed to publish draw results." };
  }
}
