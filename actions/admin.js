"use server";

import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/admin-auth";

/**
 * Fetches real-time platform statistics for the Admin Dashboard.
 * PRD Section 11: Total users, prize pools, and charity totals.
 */
export async function getAdminStats() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  
  if (!session) return null;

  try {
    // 1. Core KPIs
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const activeSubs = await sql`SELECT COUNT(*) as count FROM users WHERE subscription_status = 'ACTIVE'`;
    const prizePoolCount = await sql`SELECT SUM(total_pool) as total FROM draws`;
    const charityTotal = await sql`SELECT SUM(amount) as total FROM donations`;

    // 2. Charity Distribution for Pie Chart
    const charityDist = await sql`
      SELECT c.category as name, SUM(d.amount) as value 
      FROM donations d 
      JOIN charities c ON d.charity_id = c.id 
      GROUP BY c.category
    `;

    // 3. Recent Prize Claims for Table
    const recentClaims = await sql`
      SELECT wc.*, u.name as user_name 
      FROM winner_claims wc 
      JOIN users u ON wc.user_id = u.id 
      ORDER BY wc.created_at DESC 
      LIMIT 10
    `;

    // 4. Monthly Subscriptions for Area Chart
    const subHistory = await sql`
      SELECT TO_CHAR(created_at, 'Mon') as name, COUNT(*) as value 
      FROM subscriptions 
      GROUP BY TO_CHAR(created_at, 'Mon') 
      ORDER BY MIN(created_at)
    `;

    return {
      kpis: {
        totalUsers: userCount[0].count,
        activeSubs: activeSubs[0].count,
        totalPrizePool: prizePoolCount[0].total || 0,
        totalCharity: charityTotal[0].total || 0
      },
      charityDist,
      recentClaims,
      subHistory: subHistory.length > 0 ? subHistory : [
        { name: 'Jul', value: 0 },
        { name: 'Aug', value: 0 },
        { name: 'Sep', value: 0 },
        { name: 'Oct', value: 0 }
      ]
    };
  } catch (error) {
    console.error("Get admin stats error:", error);
    return null;
  }
}

/**
 * PHASE 2: User Directory
 */
export async function getAdminUsers() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return [];

  return await sql`
    SELECT u.*, c.name as charity_name 
    FROM users u 
    LEFT JOIN charities c ON u.active_charity_id = c.id 
    ORDER BY u.created_at DESC
  `;
}

/**
 * PHASE 3: Winner Claims portal
 */
export async function getAdminWinners() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return [];

  return await sql`
    SELECT wc.*, u.name as user_name, u.email as user_email, d.month, d.year 
    FROM winner_claims wc 
    JOIN users u ON wc.user_id = u.id 
    JOIN draws d ON wc.draw_id = d.id 
    ORDER BY wc.created_at DESC
  `;
}

/**
 * PHASE 4: Draw Engine History
 */
export async function getAdminDraws() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  const session = verifySession(token);
  if (!session) return [];

  return await sql`
    SELECT * FROM draws 
    ORDER BY year DESC, month DESC 
    LIMIT 24
  `;
}

/**
 * PHASE 5: Charity Management
 */
export async function getAdminCharities() {
   const cookieStore = await cookies();
   const token = cookieStore.get("admin-session")?.value;
   const session = verifySession(token);
   if (!session) return [];

   return await sql`
     SELECT * FROM charities 
     ORDER BY is_featured DESC, name ASC
   `;
}
