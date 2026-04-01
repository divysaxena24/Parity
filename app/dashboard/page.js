import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { 
  Trophy, 
  Heart, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  CreditCard, 
  AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardOverview({ searchParams }) {
  const { session_id } = await searchParams;
  const { userId } = await auth();
  if (!userId) return null;

  // 0. Handle Stripe Success Callback (if redirecting back)
  if (session_id) {
     const { handleSubscriptionSuccess } = await import("@/actions/stripe");
     await handleSubscriptionSuccess(session_id);
  }

  // 2. Fetch Performance History for Chart
  const performances = await sql`
     SELECT score, date_played FROM scores 
     WHERE user_id = ${userId} 
     ORDER BY date_played ASC LIMIT 7
  `;

  // 3. Fetch Current Open Draw for timing
  const [currentDraw] = await sql`SELECT month, year FROM draws WHERE status = 'OPEN' LIMIT 1`;
  const nextMonthName = currentDraw ? new Date(currentDraw.year, currentDraw.month - 1).toLocaleString('en-US', { month: 'long' }) : "November";

  // 4. Fetch Winnings/Claims
  const claims = await sql`
    SELECT amount, status, payout_status, created_at 
    FROM winner_claims 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC 
    LIMIT 3
  `;
  const totalWon = claims.reduce((acc, curr) => acc + (curr.status === 'APPROVED' ? curr.amount : 0), 0);
  
  // 4b. Fetch Full User and Stats
  const [user] = await sql`SELECT * FROM users WHERE id = ${userId} LIMIT 1`;
  const [scoreCount] = await sql`SELECT count(*) FROM scores WHERE user_id = ${userId}`;
  const [latestScore] = await sql`SELECT score FROM scores WHERE user_id = ${userId} ORDER BY date_played DESC LIMIT 1`;

  // 5. Fetch User's Real Charity Impact Partner
  const [charity] = user?.active_charity_id 
    ? await sql`SELECT * FROM charities WHERE id = ${user.active_charity_id}`
    : [null];

  const stats = [
    { 
      label: "Total Draw Entries", 
      value: scoreCount.count || "0", 
      icon: <Trophy size={18} className="text-emerald-500" /> 
    },
    { 
      label: "Monthly Donation", 
      value: `$${(user?.donation_percentage || 10) * 1.5}`, 
      icon: <Heart size={18} className="text-pink-500" /> 
    },
    { 
      label: "Total Winnings", 
      value: `$${totalWon.toLocaleString()}`, 
      icon: <CreditCard size={18} className="text-blue-500" /> 
    },
    { 
      label: "Next Draw Date", 
      value: `${nextMonthName} 28`, 
      icon: <Calendar size={18} className="text-amber-500" /> 
    },
  ];

  return (
    <DashboardClient>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/5 pb-8 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name || 'Champ'}</h1>
            <p className="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">Here&apos;s your impact summary for {nextMonthName}.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/scores"
              className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
            >
              Enter New Score
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950">
                {stat.icon}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Banner / Status */}
          <div className="lg:col-span-2 space-y-8">
              {user?.subscription_status !== 'ACTIVE' && (
                <div className="rounded-3xl bg-amber-500/10 border border-amber-500/20 p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <AlertCircle size={24} />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-1">
                      <h3 className="font-bold text-amber-900 dark:text-amber-200">Subscription Inactive</h3>
                      <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400 leading-relaxed">Activate your membership today to qualify for the next prize draw and start supporting your favorite charity.</p>
                    </div>
                    <Link 
                      href="/dashboard/settings" 
                      className="rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 shrink-0"
                    >
                      Activate Now
                    </Link>
                </div>
              )}

              {/* Claims Overview */}
              {claims.length > 0 && (
                <div className="rounded-3xl border border-slate-100 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Prize Claims</h3>
                    <Link href="/dashboard/winnings" className="text-emerald-600 font-bold text-sm hover:underline">View History</Link>
                  </div>
                  <div className="space-y-4">
                    {claims.map((claim, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-white/5">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">${claim.amount.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">{new Date(claim.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-widest ${claim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : claim.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {claim.status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Payout: {claim.payout_status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-3xl border border-slate-100 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Impact Partner</h3>
                    <Link href="/charities" className="text-emerald-600 font-bold text-xs sm:text-sm flex items-center gap-1 hover:underline shrink-0">Change Charity <ArrowRight size={14} /></Link>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-white/5">
                    <div className="h-24 w-24 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xl shadow-emerald-500/30 overflow-hidden relative">
                        {charity?.image_url ? (
                           <img src={charity.image_url} alt={charity.name} className="absolute inset-0 h-full w-full object-cover opacity-80" />
                        ) : <Heart size={48} />}
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{charity?.name || 'High-Impact Partners'}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-4 leading-relaxed max-w-md">
                          {charity?.mission || 'Select a high-vetted global charity organization to receive your support with every tracked swing.'}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                          <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold dark:bg-emerald-900/30 uppercase tracking-widest">{charity?.category || 'Environment'}</div>
                          <div className="text-xs font-bold text-slate-500 flex items-center gap-1"><Users size={12} /> {Math.floor(Math.random() * 100) + 20} Other Supporters</div>
                        </div>
                    </div>
                  </div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm min-h-64 flex flex-col justify-center">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Performance Engine</h3>
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-emerald-500" />
                       <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Stableford Sync</span>
                    </div>
                 </div>
                 
                 {performances.length > 0 ? (
                    <div className="h-32 flex items-end gap-2 group">
                       {performances.map((p, i) => (
                          <div key={i} className="flex-1 bg-emerald-500/10 rounded-t-xl group-hover:bg-emerald-500/20 transition-all relative group/bar" style={{ height: `${(p.score / 45) * 100}%` }}>
                             <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[10px] font-black text-emerald-600">{p.score}</div>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="flex flex-col items-center">
                       <TrendingUp size={48} className="text-slate-200 dark:text-slate-800 mb-4" />
                       <p className="text-sm text-slate-500 dark:text-slate-400">Charts will activate once you have recorded your first score.</p>
                    </div>
                 )}
              </div>
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-8">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Subscription Details</h3>
                <div className="space-y-4">
                    <DetailItem icon={<CreditCard size={16} />} label="Current Plan" value={user?.subscription_status === 'ACTIVE' ? 'Standard' : 'None'} />
                    <DetailItem icon={<Calendar size={16} />} label="Latest Score" value={latestScore?.score || 'N/A'} />
                    <DetailItem icon={<Heart size={16} />} label="Donation %" value={`${user?.donation_percentage || 10}%`} />
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-white/20 blur-[60px] group-hover:scale-150 transition-transform" />
                  <Trophy size={32} className="mb-4 text-emerald-200" />
                  <h3 className="text-xl font-bold mb-2">October Draw Pool</h3>
                  <div className="text-3xl font-black mb-6">$152,400.00</div>
                  <p className="text-sm text-emerald-100 leading-relaxed mb-6">5 days remaining to qualify for this month&apos;s rewards.</p>
                  <Link href="/dashboard/draws" className="block w-full py-3 rounded-xl bg-white text-emerald-700 text-center font-bold text-sm hover:bg-emerald-50 transition-colors">
                    View Draw Rules
                  </Link>
              </div>
          </div>
        </div>
      </div>
    </DashboardClient>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          {icon}
          <span className="text-xs font-semibold">{label}</span>
       </div>
       <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">{value}</span>
    </div>
  );
}

function TrendingUp({ className, size }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
