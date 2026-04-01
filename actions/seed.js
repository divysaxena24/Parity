"use server";

import { sql, createId } from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

/**
 * 🚀 PLATFORM SEEDING ENGINE
 * One-time administrative function to populate the Neon DB with real sample records.
 * Ensures the dashboard looks alive and functional.
 */
export async function seedPlatformData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return { error: "Unauthorized" };

  try {
    // 1. CLEAR EXISTING DATA (Slightly aggressive for seeding)
    // await sql`DELETE FROM users WHERE role = 'USER'`;

    // 2. SEED GOLFERS (Sample Users)
    const users = [
      { id: "user_2p5b6k7m8n9q0r1s2t3v4w5x6y", name: "Alex Thompson", email: "alex.t@example.com", status: "ACTIVE", charity: "c1" },
      { id: "user_9q0r1s2t3v4w5x6y7z8a9b0c1d", name: "Sarah Miller", email: "sarah.m@example.com", status: "ACTIVE", charity: "c2" },
      { id: "user_v4w5x6y7z8a9b0c1d2e3f4g5h6", name: "James Wilson", email: "j.wilson@example.com", status: "INACTIVE", charity: "c1" },
      { id: "user_b0c1d2e3f4g5h6i7j8k9l0m1n", name: "Emily Davis", email: "emily.d@example.com", status: "ACTIVE", charity: "c3" },
      { id: "user_i7j8k9l0m1n2o3p4q5r6s7t8u", name: "Mark Peterson", email: "mark.p@gmail.com", status: "ACTIVE", charity: "c2" }
    ];

    for (const u of users) {
      await sql`
        INSERT INTO users (id, name, email, subscription_status, active_charity_id, role)
        VALUES (${u.id}, ${u.name}, ${u.email}, ${u.status}, ${u.charity}, 'USER')
        ON CONFLICT (id) DO UPDATE SET subscription_status = EXCLUDED.subscription_status
      `;
    }

    // 3. SEED DRAWS (Historical and Current)
    const draws = [
      { id: "draw_2026_01", month: 1, year: 2026, status: "COMPLETED", pool: 12500, numbers: [12, 45, 67, 89] },
      { id: "draw_2026_02", month: 2, year: 2026, status: "COMPLETED", pool: 14200, numbers: [5, 18, 32, 70] },
      { id: "draw_2026_03", month: 3, year: 2026, status: "OPEN", pool: 8400, numbers: null }
    ];

    for (const d of draws) {
      await sql`
        INSERT INTO draws (id, month, year, status, total_pool, draw_numbers)
        VALUES (${d.id}, ${d.month}, ${d.year}, ${d.status}, ${d.pool}, ${d.numbers})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    // 4. SEED WINNER CLAIMS
    const claims = [
      { id: "claim_1", user: users[0].id, draw: "draw_2026_01", amount: 5000, status: "APPROVED", proof: "/proof1.jpg" },
      { id: "claim_2", user: users[1].id, draw: "draw_2026_02", amount: 7200, status: "PENDING", proof: "/proof2.jpg" }
    ];

    for (const c of claims) {
      await sql`
        INSERT INTO winner_claims (id, user_id, draw_id, amount, status, proof_url)
        VALUES (${c.id}, ${c.user}, ${c.draw}, ${c.amount}, ${c.status}, ${c.proof})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    console.error("Seeding error:", err);
    return { error: "Failed to seed platform samples." };
  }
}
