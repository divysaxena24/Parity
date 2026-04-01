import { getAdmins } from "@/actions/management";
import AdminManager from "@/components/admin/AdminManager";

export default async function AdminManagementPage() {
  const admins = await getAdmins();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight uppercase">Access Control Hub</h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400 font-medium">Manage encrypted internal identities and high-level administrative permissions.</p>
      </div>

      <AdminManager initialAdmins={admins} />
    </div>
  );
}
