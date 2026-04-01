import { getAdminCharities } from "@/actions/admin";
import CharityManager from "@/components/admin/CharityManager";

export default async function AdminCharitiesPage() {
  const charities = await getAdminCharities();

  return (
    <div className="space-y-8">
      {/* Header handled inside CharityManager for interactive Add button */}
      <CharityManager initialCharities={charities} />
    </div>
  );
}
