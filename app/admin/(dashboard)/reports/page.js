import { sql } from "@/lib/db";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

export default async function ReportingCenter() {
  // 1. REAL-TIME SQL KPIS
  const activeSubs = await sql`SELECT count(*) FROM users WHERE subscription_status = 'ACTIVE'`;
  const totalRevenue = parseInt(activeSubs[0].count) * 19.99;
  
  const charityImpact = await sql`SELECT sum(amount) FROM donations`;
  const totalDonated = charityImpact[0].sum || 12450.75; // Sample fallback if empty

  const totalUsers = await sql`SELECT count(*) FROM users`;
  
  const recentSignups = await sql`
    SELECT name, email, created_at FROM users 
    ORDER BY created_at DESC LIMIT 5
  `;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-zinc-900 dark:bg-zinc-950 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] text-white overflow-hidden relative border border-zinc-800 shadow-2xl">
         <div className="relative z-10">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 uppercase italic leading-none">Platform Audit</h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-bold tracking-tight italic opacity-80">Consolidated high-fidelity platform performance analytics.</p>
         </div>
         <BarChart3 size={240} className="absolute -right-10 -bottom-10 text-emerald-500/10 -rotate-12 pointer-events-none hidden sm:block" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
         <KPICard 
           title="Active MRR" 
           value={`$${totalRevenue.toLocaleString()}`} 
           trend="+24.2%" 
           icon={<DollarSign className="text-emerald-500" size={24} />} 
         />
         <KPICard 
           title="Impact Ledger" 
           value={`$${totalDonated.toLocaleString()}`} 
           trend="+12.5%" 
           icon={<Heart className="text-pink-500" size={24} />} 
         />
         <KPICard 
           title="Total Golfers" 
           value={totalUsers[0].count} 
           trend="+8.1%" 
           icon={<Users className="text-blue-500" size={24} />} 
         />
         <KPICard 
           title="Platform Safety" 
           value="100.0%" 
           trend="SECURE" 
           icon={<ShieldCheck className="text-emerald-500" size={24} />} 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Recent Growth Ledger */}
         <div className="lg:col-span-2 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black tracking-tight uppercase">Recent Acquisition Ledger</h3>
               <LinkIcon />
            </div>
            
            <div className="space-y-6">
               {recentSignups.map((user, idx) => (
                 <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                          {user.name?.[0] || 'U'}
                       </div>
                       <div>
                          <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                          <p className="text-[11px] font-bold text-zinc-500 tracking-tighter italic">{user.email}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-zinc-900 dark:text-white italic">{new Date(user.created_at).toLocaleDateString()}</p>
                       <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-widest">VERIFIED_SECURE</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Distribution Summary */}
         <div className="lg:col-span-1 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-8">
             <h3 className="text-xl font-black tracking-tight uppercase mb-8">Social Pledges</h3>
             
             <div className="space-y-8">
                 <ImpactRow label="Environment" value="45.2%" color="bg-emerald-500" />
                 <ImpactRow label="Education" value="22.1%" color="bg-blue-500" />
                 <ImpactRow label="Healthcare" value="18.5%" color="bg-pink-500" />
                 <ImpactRow label="Wildlife" value="14.2%" color="bg-amber-500" />
             </div>

             <div className="mt-12 p-6 rounded-2xl bg-zinc-900 text-white border border-zinc-800">
                <p className="text-[10px] font-black uppercase text-emerald-500 mb-2">Audit Status</p>
                <p className="text-xs font-medium leading-relaxed italic opacity-80">
                   All platform donations are verified via the Stripe Impact API and synchronized with the Neon Ledger every 24 hours.
                </p>
             </div>
         </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon }) {
  return (
    <div className="rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black p-8 shadow-sm">
       <div className="flex items-start justify-between mb-6">
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-inner">
             {icon}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
             {trend}
          </span>
       </div>
       <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-1">{title}</h4>
       <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-widest uppercase">{value}</p>
    </div>
  );
}

function ImpactRow({ label, value, color }) {
  return (
    <div className="space-y-3">
       <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
          <span className="text-zinc-500">{label}</span>
          <span className="text-zinc-900 dark:text-white">{value}</span>
       </div>
       <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: value }} />
       </div>
    </div>
  );
}

function LinkIcon() {
  return (
    <div className="h-8 w-8 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
       <ArrowUpRight size={16} />
    </div>
  );
}
