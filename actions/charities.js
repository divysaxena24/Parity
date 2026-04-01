"use server";

import { sql, createId } from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

/**
 * Administrative: Create New Charity
 * PRD Section 11.2: Charity Selection
 */
export async function createCharity(formData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return { error: "Unauthorized" };

  try {
    const id = createId();
    const { name, slug, category, shortDescription, fullDescription, image, isFeatured } = formData;

    await sql`
      INSERT INTO charities (id, name, slug, category, short_description, full_description, image, is_featured)
      VALUES (${id}, ${name}, ${slug}, ${category}, ${shortDescription}, ${fullDescription}, ${image}, ${isFeatured || false})
    `;
    
    revalidatePath("/admin/charities");
    revalidatePath("/charities");
    return { success: true };
  } catch (err) {
    console.error("Create charity error:", err);
    return { error: "Failed to create charity organization." };
  }
}

/**
 * Administrative: Update Existing Charity
 */
export async function updateCharity(id, formData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return { error: "Unauthorized" };

  try {
    const { name, slug, category, shortDescription, fullDescription, image, isFeatured } = formData;

    await sql`
      UPDATE charities 
      SET name = ${name}, 
          slug = ${slug}, 
          category = ${category}, 
          short_description = ${shortDescription},
          full_description = ${fullDescription},
          image = ${image},
          is_featured = ${isFeatured},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    
    revalidatePath("/admin/charities");
    revalidatePath(`/charity/${slug}`);
    return { success: true };
  } catch (err) {
    console.error("Update charity error:", err);
    return { error: "Failed to update charity." };
  }
}

/**
 * Administrative: Delete Charity
 */
export async function deleteCharity(id) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return { error: "Unauthorized" };

  try {
    // 1. Check if users are pledged to this charity
    const pldgedUsers = await sql`SELECT count(*) FROM users WHERE active_charity_id = ${id}`;
    if (parseInt(pldgedUsers[0].count) > 0) {
      return { error: `Cannot delete charity. ${pldgedUsers[0].count} users are currently pledged to it. Re-assign them first.` };
    }

    await sql`DELETE FROM charities WHERE id = ${id}`;
    revalidatePath("/admin/charities");
    return { success: true };
  } catch (err) {
    console.error("Delete charity error:", err);
    return { error: "Failed to delete charity organization." };
  }
}
