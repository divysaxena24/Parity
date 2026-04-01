import { 
  Users, 
  CreditCard, 
  Heart, 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight
} from "lucide-react";
import Link from "next/link";
import { getAdminStats } from "@/actions/admin";
import AdminCharts from "@/components/admin/AdminCharts";

export default async function AdminOverview() {
  const stats = await getAdminStats();

  if (!stats) return <div className="p-8 text-zinc-500">Failed to load platform data. Please try again later.</div>;

  const kpiItems = [
    { label: "Total Users", value: stats.kpis.totalUsers, change: "+12.5%", trend: "up", icon: <Users size={18} /> },
    { label: "Active Subs", value: stats.kpis.activeSubs, change: "+8.2%", trend: "up", icon: <CreditCard size={18} /> },
    { label: "Prize Pool", value: `$${stats.kpis.totalPrizePool.toLocaleString()}`, change: "-2.4%", trend: "down", icon: <Trophy size={18} /> },
    { label: "Charity Total", value: `$${stats.kpis.totalCharity.toLocaleString()}`, change: "+15.1%", trend: "up", icon: <Heart size={18} /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Global Analytics</h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">Real-time platform performance and impact monitoring.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiItems.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black"
          >
             <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 text-emerald-600">
                   {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                   {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {stat.change}
                </div>
             </div>
             <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500 tracking-tight">{stat.label}</p>
             <p className="mt-1 text-2xl font-black text-zinc-950 dark:text-white leading-none tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <AdminCharts 
        subHistory={stats.subHistory} 
        charityDist={stats.charityDist} 
      />

      {/* Recent Activity Table Teaser */}
      <div className="rounded-3xl border border-zinc-100 bg-white overflow-hidden dark:border-zinc-800 dark:bg-black shadow-sm">
         <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Prize Claims</h3>
            <Link href="/admin/winners" className="text-xs font-bold text-emerald-600 hover:underline">View All Claims</Link>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                  <tr>
                     <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">User</th>
                     <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Amount</th>
                     <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                     <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {stats.recentClaims.length > 0 ? (
                    stats.recentClaims.map((claim) => (
                      <ClaimRow 
                        key={claim.id}
                        user={claim.user_name} 
                        amount={`$${claim.amount.toLocaleString()}`} 
                        status={claim.status} 
                        date={new Date(claim.created_at).toLocaleDateString()} 
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-8 text-center text-zinc-500 text-sm italic underline">No claims submitted yet.</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

function ClaimRow({ user, amount, status, date }) {
  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
       <td className="px-8 py-4 text-sm font-bold text-zinc-900 dark:text-white">{user}</td>
       <td className="px-8 py-4 text-sm font-black text-emerald-600">{amount}</td>
       <td className="px-8 py-4">
          <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-widest ${status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
             {status}
          </span>
       </td>
       <td className="px-8 py-4 text-xs text-zinc-400 font-medium">{date}</td>
    </tr>
  );
}
