import { auth, currentUser } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import SettingsClient from "@/components/dashboard/SettingsClient";

export default async function SettingsPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  if (!userId) return null;

  // Fetch real data from Neon
  const [userData] = await sql`SELECT * FROM users WHERE id = ${userId}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-8 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Manage your profile, membership, and charity preferences.</p>
      </div>

      <SettingsClient userData={userData} clerkUser={JSON.parse(JSON.stringify(clerkUser))} />
    </div>
  );
}

function Input({ label, defaultValue, disabled, type = "text" }) {
  return (
    <div className="space-y-1.5">
       <label className="text-xs font-bold text-slate-400 uppercase ml-1">{label}</label>
       <input 
         type={type}
         defaultValue={defaultValue} 
         disabled={disabled}
         className={`w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 px-5 text-sm outline-none transition-all focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
       />
    </div>
  );
}
