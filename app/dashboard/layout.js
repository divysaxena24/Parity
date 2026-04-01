import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Trophy, 
  Wallet, 
  Settings, 
  ShieldCheck,
  CreditCard,
  Menu,
  X
} from "lucide-react";
import { DashboardSidebarClient } from "./sidebar-client";
import { MobileMenuToggle } from "./mobile-menu-toggle";

export default async function DashboardLayout({ children }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  // Fetch real account status from Neon Direct
  const [user] = await sql`SELECT subscription_status FROM users WHERE id = ${userId}`;
  const isSubscriber = user?.subscription_status === 'ACTIVE';

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Golf Scores", href: "/dashboard/scores", icon: <ClipboardList size={18} /> },
    { name: "Monthly Draws", href: "/dashboard/draws", icon: <Trophy size={18} /> },
    { name: "My Winnings", href: "/dashboard/winnings", icon: <Wallet size={18} /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile Header Label (Non-blocking) */}
      <div className="lg:hidden fixed top-16 left-0 right-0 h-14 bg-transparent z-30 px-4 flex items-center justify-center pointer-events-none">
         <span className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] opacity-40">Dashboard</span>
      </div>

      {/* Mobile Menu System */}
      <MobileMenuToggle>
        <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between h-full">
          {/* Reuse sidebar content */}
          <div>
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900/30">
                <ShieldCheck size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {isSubscriber ? "Active Member" : "Free Tier"}
                </span>
              </div>
            </div>
            <nav className="space-y-1">
              <DashboardSidebarClient menuItems={menuItems} />
            </nav>
          </div>
          <DashboardSidebarClient isSignOutOnly />
        </aside>
      </MobileMenuToggle>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-64px)] w-64 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 hidden lg:block">
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900/30">
                <ShieldCheck size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Account Status</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                   {isSubscriber ? (
                     <span className="text-emerald-600 flex items-center gap-1"><CreditCard size={12} /> Active</span>
                   ) : (
                     <span className="text-red-500">Inactive</span>
                   )}
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              <DashboardSidebarClient menuItems={menuItems} />
            </nav>
          </div>

          <div className="space-y-4">
             <div className="rounded-2xl bg-slate-950 p-4 text-white dark:bg-emerald-950/20">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Impact Tip</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter 5 scores before the 28th to qualify for this month&apos;s $15k draw.
                </p>
             </div>
             
             <DashboardSidebarClient isSignOutOnly />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-8 pt-24 lg:pt-10">
        {children}
      </main>
    </div>
  );
}
