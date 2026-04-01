"use server";

import { sql, createId } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addScore(formData) {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  const score = parseInt(formData.get("score"));
  const datePlayedStr = formData.get("datePlayed");
  const datePlayed = new Date(datePlayedStr);

  if (isNaN(score) || score < 1 || score > 45) {
    return { error: "Score must be between 1 and 45" };
  }

  try {
    // 1. Ensure user exists in our Neon 'users' table (Sync on demand)
    const handle = userId; // Fallback handle
    await sql`
      INSERT INTO users (id, username)
      VALUES (${userId}, ${handle})
      ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username
    `;

    // 2. Create the new score
    const id = createId();
    await sql`
      INSERT INTO scores (id, user_id, score, date_played)
      VALUES (${id}, ${userId}, ${score}, ${datePlayed})
    `;

    // 3. ENFORCE RULE: Only latest 5 are retained
    const userScores = await sql`
      SELECT id FROM scores 
      WHERE user_id = ${userId}
      ORDER BY date_played DESC
    `;

    if (userScores.length > 5) {
      const idsToDelete = userScores.slice(5).map(s => s.id);
      // Delete in batches
      await sql`
        DELETE FROM scores 
        WHERE id = ANY(${idsToDelete})
      `;
    }

    revalidatePath("/dashboard/scores");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Add score error:", error);
    return { error: "Failed to add score" };
  }
}

export async function deleteScore(id) {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  try {
    await sql`
      DELETE FROM scores 
      WHERE id = ${id} AND user_id = ${userId}
    `;
    revalidatePath("/dashboard/scores");
    return { success: true };
  } catch (error) {
    console.error("Delete score error:", error);
    return { error: "Failed to delete score" };
  }
}

export async function getScores() {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    const scores = await sql`
      SELECT * FROM scores 
      WHERE user_id = ${userId}
      ORDER BY date_played DESC
    `;
    return scores;
  } catch (error) {
    console.error("Get scores error:", error);
    return [];
  }
}
