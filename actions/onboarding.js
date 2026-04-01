"use server";

import { sql } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Persists the user's initial charity and donation percentage selections.
 * Required for PRD Section 08/10.
 */
export async function completeOnboarding(formData) {
  console.time("[ONBOARDING_TRACE] Full Execution");
  try {
    const { userId, user } = await auth();
    if (!userId) return { error: "Not authenticated" };

    const charityId = formData.get("charityId");
    const donationPercentage = parseInt(formData.get("donationPercentage"));

    if (!charityId || isNaN(donationPercentage)) {
      return { error: "Missing required fields" };
    }

    if (donationPercentage < 10) {
      return { error: "Donation percentage must be at least 10%" };
    }

    // 1. UPSERT logic to handle race conditions with Clerk Sync Webhook
    console.time("[ONBOARDING_TRACE] Database UPSERT");
    // We use a robust UPSERT to ensure the user record exists even if the webhook is late
    await sql`
      INSERT INTO users (id, email, active_charity_id, donation_percentage)
      VALUES (
        ${userId}, 
        ${user?.emailAddresses?.[0]?.emailAddress || "syncing..."}, 
        ${charityId}, 
        ${donationPercentage}
      )
      ON CONFLICT (id) DO UPDATE 
      SET active_charity_id = EXCLUDED.active_charity_id,
          donation_percentage = EXCLUDED.donation_percentage,
          updated_at = CURRENT_TIMESTAMP
    `;
    console.timeEnd("[ONBOARDING_TRACE] Database UPSERT");

    // 2. Update Clerk Metadata for Middleware tracking
    console.time("[ONBOARDING_TRACE] Clerk Metadata Sync");
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true
      }
    });
    console.timeEnd("[ONBOARDING_TRACE] Clerk Metadata Sync");

    revalidatePath("/dashboard");
    revalidatePath("/admin");
    
    console.timeEnd("[ONBOARDING_TRACE] Full Execution");
    return { success: true };
  } catch (error) {
    console.error("[ONBOARDING_ERROR]:", error);
    return { error: "Failed to finalize your profile. Please try again." };
  }
}
