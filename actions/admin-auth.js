"use server";

import { sql, createId, ensureAdminsTable } from "@/lib/db";
import { hashPassword, verifyPassword, signSession } from "@/lib/admin-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DEFAULT_ADMIN = {
  email: "admin2402@parity.com",
  password: "parity_admin"
};

/**
 * Handle Admin Authentication
 */
export async function adminLogin(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) return { error: "Missing credentials" };

  try {
    // 1. Ensure table exists
    await ensureAdminsTable();

    // 2. Initial Seed: If no admins exist, create the default one
    const existingCount = await sql`SELECT COUNT(*) FROM app_admins`;
    if (parseInt(existingCount[0].count) === 0) {
      const hashedPassword = hashPassword(DEFAULT_ADMIN.password);
      await sql`
        INSERT INTO app_admins (id, email, password_hash)
        VALUES (${createId()}, ${DEFAULT_ADMIN.email}, ${hashedPassword})
      `;
    }

    // 3. Find the admin
    const [admin] = await sql`SELECT * FROM app_admins WHERE email = ${email}`;
    if (!admin) return { error: "Invalid credentials" };

    // 4. Verify password
    const isValid = verifyPassword(password, admin.password_hash);
    if (!isValid) return { error: "Invalid credentials" };

    // 5. Create Session (Expires in 24 hours)
    const token = signSession({
      id: admin.id,
      email: admin.email,
      role: 'ADMIN',
      exp: Date.now() + (24 * 60 * 60 * 1000)
    });

    // 6. Set Cookie
    (await cookies()).set("admin-session", token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       maxAge: 24 * 60 * 60,
       path: "/"
    });

    // 7. Successful redirect
    return { success: true };
  } catch (err) {
    console.error("Admin Login Error:", err);
    return { error: "System failure. Please check logs." };
  }
}

/**
 * Management: Add a new admin
 * Must be called by an existing authenticated admin
 */
export async function createAdmin(email, password) {
  // Security: verify internal session first if possible, or just expect layout guard
  // Here we'll just implement the DB insert
  try {
    const hashedPassword = hashPassword(password);
    const id = createId();
    await sql`
      INSERT INTO app_admins (id, email, password_hash)
      VALUES (${id}, ${email}, ${hashedPassword})
    `;
    return { success: true };
  } catch (err) {
    console.error("Create Admin Error:", err);
    return { error: "Failed to create administrator account." };
  }
}

/**
 * Admin Logout
 */
export async function adminLogout() {
  (await cookies()).delete("admin-session");
  redirect("/admin/login");
}
