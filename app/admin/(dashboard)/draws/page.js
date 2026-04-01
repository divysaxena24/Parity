import { getAdminDraws } from "@/actions/admin";
import DrawEngine from "@/components/admin/DrawEngine";

export default async function AdminDrawsPage() {
  const history = await getAdminDraws();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Draw Engine Portal</h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">Simulate and publish monthly prize draws for active subscribers.</p>
      </div>

      <DrawEngine initialHistory={history} />
    </div>
  );
}
