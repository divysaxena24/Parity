import { getAdminWinners } from "@/actions/admin";
import WinnerManagement from "@/components/admin/WinnerManagement";

export default async function AdminWinnersPage() {
  const claims = await getAdminWinners();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Winner Verification Portal</h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">Review submitted prize claims and audit score proof documentation.</p>
      </div>

      <WinnerManagement initialClaims={claims} />
    </div>
  );
}
