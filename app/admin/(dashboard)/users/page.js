import { getAdminUsers } from "@/actions/admin";
import UserTable from "@/components/admin/UserTable";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-4 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Directory & Subscriptions</h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">Manage all registered users and their platform permissions.</p>
        </div>
      </div>

      <UserTable initialUsers={users} />
    </div>
  );
}
