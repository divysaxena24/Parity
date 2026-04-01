import { sql } from "@/lib/db";
import { verifySession } from "@/lib/admin-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-session")?.value;
    const session = verifySession(token);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admins = await sql`
      SELECT email, created_at 
      FROM app_admins 
      ORDER BY created_at ASC
    `;
    
    return NextResponse.json(admins);
  } catch (err) {
    console.error("Fetch Admins API Error:", err);
    return NextResponse.json({ error: "Failed to fetch administrative team." }, { status: 500 });
  }
}
