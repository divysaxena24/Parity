import { getScores } from "@/actions/scores";
import { 
  Trophy, 
  Trash2, 
  Calendar, 
  Info,
  ClipboardList
} from "lucide-react";
import { ScoresClient } from "./scores-client";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

export default async function ScoresPage() {
  const { userId } = await auth();
  if (!userId) return null;

  // 1. Fetch initial scores from Neon Direct
  const scores = await getScores();
  
  // 2. Fetch subscription status for eligibility check
  const [user] = await sql`SELECT subscription_status FROM users WHERE id = ${userId}`;
  const isSubscriber = user?.subscription_status === 'ACTIVE';

  return (
    <div className="space-y-8">
      {/* Header handled in Client component for the 'New Score' toggle button */}
      <ScoresClient initialScores={scores} isSubscriber={isSubscriber} />
    </div>
  );
}
