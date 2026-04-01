"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Updates the user's active charity and donation percentage.
 * PRD Section 08: Enforces 10% minimum.
 */
export async function updateCharitySettings(formData) {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  const charityId = formData.get("charityId");
  const donationPercentage = parseInt(formData.get("donationPercentage") || "10");

  // Validate PRD requirement: 10% Min
  if (donationPercentage < 10) {
    return { error: "Minimum donation is 10%" };
  }

  try {
    await sql`
      UPDATE users 
      SET 
        active_charity_id = ${charityId},
        donation_percentage = ${donationPercentage},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update charity error:", error);
    return { error: "Failed to update charity settings" };
  }
}

/**
 * Records an independent donation (not tied to subscription).
 * PRD Section 08: Independent donation option.
 */
export async function recordDonation(charityId, amount) {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  try {
    const id = `don_${Math.random().toString(36).substring(2, 11)}`;
    await sql`
      INSERT INTO donations (id, user_id, charity_id, amount)
      VALUES (${id}, ${userId}, ${charityId}, ${amount})
    `;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Record donation error:", error);
    return { error: "Failed to process donation" };
  }
}

/**
 * Fetches all available charities for the directory.
 * PRD Section 08: Charity directory features.
 */
export async function getCharities() {
  try {
    return await sql`SELECT * FROM charities ORDER BY is_featured DESC, name ASC`;
  } catch (error) {
    console.error("Get charities error:", error);
    return [];
  }
}
