"use server";

import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

/**
 * Administrative: Update Winner Claim Status
 * PRD Section 09: Verification & Approval
 */
export async function updateWinnerStatus(id, status, reason = "") {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return { error: "Unauthorized" };

  try {
     // 1. Update the claim status
     await sql`
       UPDATE winner_claims 
       SET status = ${status}, reason = ${reason} 
       WHERE id = ${id}
     `;

     // 2. If approved, automatically set payout_status to PENDING (for finance audit)
     if (status === 'APPROVED') {
        await sql`UPDATE winner_claims SET payout_status = 'PENDING' WHERE id = ${id}`;
     }

     revalidatePath("/admin/winners");
     return { success: true };
  } catch (err) {
     console.error("Update winner status error:", err);
     return { error: "Failed to update claim status." };
  }
}

/**
 * Administrative: Finalize Payout
 */
export async function finalizePayout(id) {
   const cookieStore = await cookies();
   const token = cookieStore.get("admin-session")?.value;
   const session = verifySession(token);
   if (!session) return { error: "Unauthorized" };

   try {
     await sql`UPDATE winner_claims SET payout_status = 'PAID' WHERE id = ${id}`;
     revalidatePath("/admin/winners");
     return { success: true };
   } catch (err) {
     return { error: "Failed to finalize payout." };
   }
}
