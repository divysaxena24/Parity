"use server";

import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Submits a winner claim with proof of scores.
 * PRD Section 09: Proof upload (Screenshot).
 */
export async function submitClaim(formData) {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  const drawId = formData.get("drawId");
  const amount = parseFloat(formData.get("amount"));
  const proofFile = formData.get("proof");

  if (!proofFile || !drawId || isNaN(amount)) {
    return { error: "Missing required claim details" };
  }

  try {
    // 1. Upload proof to Cloudinary
    const buffer = await proofFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:${proofFile.type};base64,${base64Image}`;
    
    const uploadRes = await cloudinary.uploader.upload(dataUrl, {
      folder: "parity/claims",
    });

    // 2. Create claim in Neon
    const id = `claim_${Math.random().toString(36).substring(2, 11)}`;
    await sql`
      INSERT INTO winner_claims (id, user_id, draw_id, amount, status, proof_url)
      VALUES (${id}, ${userId}, ${drawId}, ${amount}, 'PENDING', ${uploadRes.secure_url})
    `;

    revalidatePath("/dashboard");
    return { success: true, id };
  } catch (error) {
    console.error("Submit claim error:", error);
    return { error: "Failed to submit claim. Please try again." };
  }
}

/**
 * Updates the status of a winner claim.
 * PRD Section 09: Admin review (Approve/Reject).
 */
export async function updateClaimStatus(claimId, status, reason = "") {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  // Verification: Ensure user is ADMIN (Placeholder check)
  // In production, sync role to DB and check here
  
  try {
    await sql`
      UPDATE winner_claims 
      SET 
        status = ${status}, 
        reason = ${reason}, 
        payout_status = ${status === 'APPROVED' ? 'PENDING' : 'FAILED'},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${claimId}
    `;

    revalidatePath("/admin/winners");
    return { success: true };
  } catch (error) {
    console.error("Update claim error:", error);
    return { error: "Failed to update claim status" };
  }
}

/**
 * Marks a claim as PAID.
 * PRD Section 09: Payment States (Pending -> Paid).
 */
export async function markAsPaid(claimId) {
  try {
    await sql`
      UPDATE winner_claims 
      SET 
        payout_status = 'PAID',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${claimId}
    `;
    revalidatePath("/admin/winners");
    return { success: true };
  } catch (error) {
    console.error("Mark paid error:", error);
    return { error: "Failed to mark as paid" };
  }
}
